import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Camera,
  CheckCircle2,
  Loader2,
  MapPin,
  Trash2,
  Upload,
} from "lucide-react";
import { useCamera } from "@/hooks/device/useCamera";
import { useGeolocation } from "@/hooks/device/useGeolocation";
import {
  createAnonymousIssue,
  getIssueTypes,
} from "@/api/services/anonymousIssues";
import {
  IssueTypeField,
  PriorityField,
  LocationField,
  ContactNumberField,
  DescriptionField,
  PhotoGallery,
  SuccessMessage,
} from "@/components/anonymous-issue/FormFields";

const INITIAL_FORM = {
  issue_type: "",
  issue_priority: "NORMAL",
  issue_location: "",
  description: "",
  contact_no: "",
  latitude: "",
  longitude: "",
};

const PRIORITY_OPTIONS = ["LOW", "NORMAL", "HIGH"];

function AnonymousIssuePage() {
  const fileInputRef = useRef(null);
  const previewUrlsRef = useRef([]);

  // Use custom hooks
  const {
    videoRef,
    streamRef,
    cameraReady,
    cameraError,
    isCapturing,
    setCameraError,
    initializeCamera,
    capturePhoto: capturePhotoFromCamera,
    stopCamera,
  } = useCamera();

  const { gpsLoading, gpsError, setGpsError, useCurrentLocation } =
    useGeolocation();

  // Form state
  const [form, setForm] = useState(INITIAL_FORM);
  const [issueTypes, setIssueTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [typeError, setTypeError] = useState("");
  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    return () => {
      stopCamera();
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    const loadIssueTypes = async () => {
      setLoadingTypes(true);
      setTypeError("");
      try {
        const data = await getIssueTypes();

        // Extract types and map with index-based IDs
        const types = Array.isArray(data?.types)
          ? data.types
              .map((item, idx) => {
                const typeName =
                  typeof item === "string"
                    ? item
                    : item?.issue_type || item?.name || item?.label || "";
                return typeName ? { id: idx + 1, name: typeName } : null;
              })
              .filter(Boolean)
          : [];

        setDepartments(types);
        setIssueTypes(types.map((t) => t.name));
      } catch (error) {
        console.error("Issue types load error:", error);
        setTypeError("Unable to load issue types right now.");
        toast.error("Unable to load issue types.");
      } finally {
        setLoadingTypes(false);
      }
    };

    loadIssueTypes();
  }, []);

  // ========================================================================
  // CAMERA & PHOTO FUNCTIONS
  // ========================================================================

  const handleCameraClick = async () => {
    setCameraError("");

    if (!cameraReady) {
      // Initialize camera
      const success = await initializeCamera();
      if (!success) {
        return;
      }
    } else {
      // Capture photo
      const photoData = await capturePhotoFromCamera();
      if (photoData) {
        setPhotos((current) => [...current, photoData]);
        setErrors((current) => ({ ...current, photos: "" }));
        // Keep camera open for next photo
      }
    }
  };

  // ========================================================================
  // FILE FUNCTIONS
  // ========================================================================

  // Wrapper to handle GPS location and update form
  const handleUseCurrentLocation = () => {
    useCurrentLocation(({ latitude, longitude, issue_location }) => {
      setForm((current) => ({
        ...current,
        latitude,
        longitude,
        issue_location,
      }));
      setErrors((current) => ({ ...current, issue_location: "" }));
    });
  };

  const removePhoto = (index) => {
    setPhotos((current) => {
      const next = [...current];
      const [removed] = next.splice(index, 1);
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
        previewUrlsRef.current = previewUrlsRef.current.filter(
          (url) => url !== removed.previewUrl,
        );
      }
      return next;
    });
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        toast.error(
          `${file.name} is not an image. Please select image files only.`,
        );
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      previewUrlsRef.current.push(previewUrl);
      setPhotos((current) => [...current, { file, previewUrl }]);
      toast.success(`${file.name} added.`);
    }

    setErrors((current) => ({ ...current, photos: "" }));
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSuccess(null);
    photos.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
    previewUrlsRef.current = [];
    setPhotos([]);
    stopCamera();
    setCameraError("");
    setGpsError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!form.issue_type.trim())
      nextErrors.issue_type = "Please select an issue type.";
    if (form.issue_location.trim().length < 3)
      nextErrors.issue_location = "Enter a valid location.";
    if (form.contact_no.trim().length < 10)
      nextErrors.contact_no = "Enter a valid contact number.";
    if (!form.latitude || !form.longitude)
      nextErrors.gps = "Please use GPS to capture your location.";
    if (photos.length === 0)
      nextErrors.photos = "Capture at least one photo using the camera.";
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the form errors.");
      return;
    }

    setSubmitting(true);
    setSuccess(null);

    try {
      // Find the department ID for the selected issue type name
      const selectedDept = departments.find((d) => d.name === form.issue_type);
      const issueTypeId = selectedDept?.id;

      if (!issueTypeId) {
        throw new Error("Invalid issue type selected");
      }

      const payload = {
        issue_type: issueTypeId,
        issue_priority: form.issue_priority,
        issue_location: form.issue_location.trim(),
        description: form.description.trim(),
        contact_no: form.contact_no.trim(),
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));

      const formData = new FormData();
      formData.append("issue_create", JSON.stringify(payload));
      photos.forEach(({ file }) => {
        formData.append("photos", file, file.name);
      });

      const data = await createAnonymousIssue(formData);

      setSuccess(data);
      toast.success("Anonymous report submitted successfully.");
      resetForm();
    } catch (error) {
      console.error("Anonymous submit error:", error);
      toast.error(error.message || "Failed to submit issue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="rounded-[2rem] bg-linear-to-br from-blue-700 via-blue-600 to-cyan-500 px-6 py-5 text-white shadow-xl shadow-blue-300/40">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <img
                src="/batti-nala.png"
                alt="Batti Nala"
                className="h-28 w-28 object-contain"
              />
            </div>
            <div>
              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                Report an Issue
              </h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/50 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Camera size={18} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-600">
                  Step 1
                </p>
                <h2 className="text-lg font-bold text-slate-900">
                  Capture Photo
                </h2>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-blue-100 bg-linear-to-br from-white to-blue-50 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCameraClick}
                  disabled={isCapturing}
                  className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-700 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200/50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Camera size={16} />
                  {isCapturing
                    ? "Capturing..."
                    : cameraReady
                      ? "Capture Photo"
                      : "Open Camera"}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-blue-700 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  <Upload size={16} />
                  Upload image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Upload images"
                />
              </div>

              {cameraError ? (
                <p className="mt-3 text-xs font-medium text-red-600">
                  {cameraError}
                </p>
              ) : null}
              {errors.photos ? (
                <p className="mt-3 text-xs font-medium text-red-600">
                  {errors.photos}
                </p>
              ) : null}

              <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-blue-100 bg-black">
                {cameraReady ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="aspect-4/3 w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-4/3 items-center justify-center bg-slate-900 px-4 text-center text-sm text-slate-300">
                    Click "Open Camera" to take a photo.
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700"
                >
                  <Trash2 size={16} />
                  Reset
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {photos.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-4 text-sm text-slate-500 sm:col-span-2">
                    No photos captured yet.
                  </div>
                ) : (
                  photos.map((photo, index) => (
                    <div
                      key={photo.previewUrl}
                      className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white"
                    >
                      <img
                        src={photo.previewUrl}
                        alt={`Captured evidence ${index + 1}`}
                        className="h-40 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white"
                        aria-label="Remove photo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/50 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-600">
                  Step 2
                </p>
                <h2 className="text-lg font-bold text-slate-900">
                  Verify Details
                </h2>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Issue Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="issue_type"
                  value={form.issue_type}
                  onChange={handleChange}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-100 ${errors.issue_type ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-white"}`}
                >
                  <option value="">
                    {loadingTypes
                      ? "Loading issue types..."
                      : "Select issue type"}
                  </option>
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {typeError ? (
                  <p className="mt-2 text-xs font-medium text-amber-700">
                    {typeError}
                  </p>
                ) : null}
                {errors.issue_type ? (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.issue_type}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  name="issue_priority"
                  value={form.issue_priority}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-100"
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <input
                    name="issue_location"
                    value={form.issue_location}
                    onChange={handleChange}
                    placeholder="e.g. Main Street near 5th Avenue or use GPS"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-100 ${errors.issue_location ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-white"}`}
                  />
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={gpsLoading}
                    className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-700 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200/50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MapPin size={16} />
                    {gpsLoading
                      ? "Getting current location..."
                      : "Use current location"}
                  </button>
                </div>
                {gpsError ? (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {gpsError}
                  </p>
                ) : null}
                {errors.issue_location ? (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.issue_location}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contact_no"
                  value={form.contact_no}
                  onChange={handleChange}
                  placeholder="e.g. 9801234567"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-100 ${errors.contact_no ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-white"}`}
                />
                {errors.contact_no ? (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.contact_no}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us what is broken and what needs attention."
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-100 ${errors.description ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-white"}`}
                />
                {errors.description ? (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.description}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          {success?.issue_label ? (
            <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-900">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-emerald-600"
                  size={18}
                />
                <div>
                  <p className="font-bold">Report submitted successfully</p>
                  <p className="mt-1 text-sm">
                    Issue label: {success.issue_label} · Status:{" "}
                    {success.status}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-700 via-blue-600 to-cyan-500 px-5 py-4 text-base font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            {submitting ? "Submitting..." : "Submit anonymous report"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AnonymousIssuePage;
