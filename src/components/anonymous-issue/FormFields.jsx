import React from "react";
import { MapPin, Trash2 } from "lucide-react";

/**
 * Error message component
 */
export const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <p className="mt-2 text-xs font-medium text-red-600">{message}</p>;
};

/**
 * Issue Type Select Field
 */
export const IssueTypeField = ({
  value,
  issueTypes,
  loadingTypes,
  typeError,
  error,
  onChange,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Issue Type <span className="text-red-500">*</span>
    </label>
    <select
      name="issue_type"
      value={value}
      onChange={onChange}
      className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-100 ${
        error ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-white"
      }`}
    >
      <option value="">
        {loadingTypes ? "Loading issue types..." : "Select issue type"}
      </option>
      {issueTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
    {typeError && (
      <p className="mt-2 text-xs font-medium text-amber-700">{typeError}</p>
    )}
    <ErrorMessage message={error} />
  </div>
);

/**
 * Priority Select Field
 */
export const PriorityField = ({ value, onChange, options }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Priority <span className="text-red-500">*</span>
    </label>
    <select
      name="issue_priority"
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-100"
    >
      {options.map((priority) => (
        <option key={priority} value={priority}>
          {priority.charAt(0) + priority.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  </div>
);

/**
 * Location Input Field with GPS Button
 */
export const LocationField = ({
  value,
  gpsLoading,
  gpsError,
  error,
  onChange,
  onUseLocation,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Location <span className="text-red-500">*</span>
    </label>
    <div className="space-y-3">
      <input
        name="issue_location"
        value={value}
        onChange={onChange}
        placeholder="e.g. Main Street near 5th Avenue or use GPS"
        className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-100 ${
          error ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-white"
        }`}
      />
      <button
        type="button"
        onClick={onUseLocation}
        disabled={gpsLoading}
        className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-700 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <MapPin size={16} />
        {gpsLoading ? "Getting current location..." : "Use current location"}
      </button>
    </div>
    {gpsError && (
      <p className="mt-2 text-xs font-medium text-red-600">{gpsError}</p>
    )}
    <ErrorMessage message={error} />
  </div>
);

/**
 * Contact Number Input Field
 */
export const ContactNumberField = ({ value, error, onChange }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Contact Number <span className="text-red-500">*</span>
    </label>
    <input
      type="tel"
      name="contact_no"
      value={value}
      onChange={onChange}
      placeholder="e.g. 9801234567"
      className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-100 ${
        error ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-white"
      }`}
    />
    <ErrorMessage message={error} />
  </div>
);

/**
 * Description Textarea Field
 */
export const DescriptionField = ({ value, error, onChange }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Description
    </label>
    <textarea
      name="description"
      value={value}
      onChange={onChange}
      rows={5}
      placeholder="Tell us what is broken and what needs attention."
      className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-100 ${
        error ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-white"
      }`}
    />
    <ErrorMessage message={error} />
  </div>
);

/**
 * Photo Gallery Component
 */
export const PhotoGallery = ({ photos, onRemovePhoto, isLoading }) => (
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
            onClick={() => onRemovePhoto(index)}
            disabled={isLoading}
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white disabled:opacity-50"
            aria-label="Remove photo"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))
    )}
  </div>
);

/**
 * Success Message Component
 */
export const SuccessMessage = ({ data }) => {
  if (!data?.issue_label) return null;

  return (
    <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-900">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-emerald-600">✓</div>
        <div>
          <p className="font-bold">Report submitted successfully</p>
          <p className="mt-1 text-sm">
            Issue label: {data.issue_label} · Status: {data.status}
          </p>
        </div>
      </div>
    </div>
  );
};
