import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { resolveApiUrl } from "@/utils/apiUrl";
import { Camera, CheckCircle2, Loader2, MapPin, Trash2 } from "lucide-react";

const initialForm = {
  issue_type: "",
  location: "",
  description: "",
};

const fetchIssueEndpoint = async (path, init = {}) => {
  const candidates = [
    resolveApiUrl(`/api/issue/${path}`),
    resolveApiUrl(`/api/issues/${path}`),
  ];

  let lastError = null;

  for (const url of candidates) {
    try {
      const response = await fetch(url, init);
      if (response.ok || response.status !== 404) {
        return response;
      }
      lastError = new Error(`Endpoint not found: ${url}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Issue endpoint request failed");
};

function AnonymousIssuePage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const previewUrlsRef = useRef([]);

  const [form, setForm] = useState(initialForm);
  const [issueTypes, setIssueTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [typeError, setTypeError] = useState("");
  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
  };

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
        const response = await fetchIssueEndpoint("get-issue-types", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.detail || "Failed to load issue types");
        }

        const types = Array.isArray(data?.types)
          ? data.types
              .map((item) => {
                if (typeof item === "string") return item;
                return item?.issue_type || item?.name || item?.label || "";
              })
              .filter(Boolean)
          : [];

        setIssueTypes(types);
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

  const startCamera = async () => {
    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Live camera is not supported by this browser.");
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOpen(true);
      return true;
    } catch (error) {
      console.error("Camera start error:", error);
      setCameraError("Camera permission was denied or unavailable.");
      return false;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      toast.error("Open live camera first.");
      return false;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      toast.error("Unable to capture photo.");
      return false;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const blob = dataURItoBlob(dataUrl);
    if (!blob) {
      toast.error("Failed to create image.");
      return false;
    }

    const file = new File([blob], `issue-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    const previewUrl = URL.createObjectURL(file);
    previewUrlsRef.current.push(previewUrl);
    setPhotos((current) => [...current, { file, previewUrl }]);
    setErrors((current) => ({ ...current, photos: "" }));
    toast.success("Photo captured.");
    return true;
  };

  const dataURItoBlob = (dataURI) => {
    try {
      const parts = dataURI.split(",");
      const byteString = atob(parts[1]);
      const mimeString = parts[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    } catch {
      return null;
    }
  };

  const handleCameraAction = () => {
    setCameraError("");
    if (!cameraOpen) {
      startCamera();
      return;
    }

    const ok = capturePhoto();
    if (ok) {
      stopCamera();
    }
  };

  const useCurrentLocation = () => {
    setGpsError("");

    if (!navigator.geolocation) {
      setGpsError("GPS location is not supported by this browser.");
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        setForm((current) => ({
          ...current,
          location: `Current location: ${latitude}, ${longitude}`,
        }));
        setErrors((current) => ({ ...current, location: "" }));
        setGpsLoading(false);
        toast.success("Current location added.");
      },
      (error) => {
        console.error("GPS error:", error);
        setGpsError("Unable to read your current location.");
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
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

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setSuccess(null);
    photos.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
    previewUrlsRef.current = [];
    setPhotos([]);
    stopCamera();
    setCameraError("");
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
    if (form.location.trim().length < 3)
      nextErrors.location = "Enter a valid location.";
    if (form.description.trim().length < 10)
      nextErrors.description = "Describe the issue in at least 10 characters.";
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
      const payload = {
        issue_type: form.issue_type.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
      };

      const formData = new FormData();
      formData.append("issue_create", JSON.stringify(payload));
      photos.forEach(({ file }) => {
        formData.append("photos", file, file.name);
      });

      const response = await fetchIssueEndpoint("anon-create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "Failed to submit issue",
        );
      }

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
                  onClick={handleCameraAction}
                  className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-700 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200/50"
                >
                  <Camera size={16} />
                  {cameraOpen ? "Capture live photo" : "Open live camera"}
                </button>
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
                {cameraOpen ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="aspect-4/3 w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-4/3 items-center justify-center bg-slate-900 px-4 text-center text-sm text-slate-300">
                    Live camera opens here. Tap the button once to open camera,
                    and again to capture.
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
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Thamel, Kathmandu or use GPS"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-100 ${errors.location ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-white"}`}
                  />
                  <button
                    type="button"
                    onClick={useCurrentLocation}
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
                {errors.location ? (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.location}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description <span className="text-red-500">*</span>
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
