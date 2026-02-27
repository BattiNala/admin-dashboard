// src/components/common/Badge.jsx
export default function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-gray-100 text-gray-800",
    critical: "bg-red-100 text-red-800",
    high: "bg-orange-100 text-orange-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
    pending: "bg-red-100 text-red-800",
    "in progress": "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[variant.toLowerCase()] || styles.default
      }`}
    >
      {children}
    </span>
  );
}
