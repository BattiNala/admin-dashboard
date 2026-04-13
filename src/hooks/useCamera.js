import { useState, useRef } from "react";
import { toast } from "sonner";

/**
 * Custom hook for camera operations - Photo capture only
 */
export const useCamera = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  };

  const getCameraErrorMessage = (error) => {
    if (error.name === "NotAllowedError") {
      return "Camera permission denied. Clear browser cache or reset: Chrome Settings → Privacy & security → Camera → Reset for localhost.";
    }
    if (error.name === "NotFoundError") {
      return "No camera found on this device.";
    }
    if (error.name === "NotReadableError") {
      return "Camera already in use by another app (Zoom, Teams, etc.). Close and retry.";
    }
    if (error.name === "OverconstrainedError") {
      return "Camera doesn't support requested settings. Try a different browser.";
    }
    return `Camera error: ${error.message || error.name}`;
  };

  const initializeCamera = async () => {
    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera is not supported by this browser or running on insecure context (use HTTPS or localhost).",
      );
      return false;
    }

    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
      } catch (error) {
        console.warn(
          "Environment camera failed, trying without facingMode:",
          error,
        );
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraReady(true);
          toast.success("Camera ready. Click capture to take a photo.");
        };
      }
      return true;
    } catch (error) {
      console.error("Camera init error:", error);
      setCameraError(getCameraErrorMessage(error));
      return false;
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !streamRef.current) {
      setCameraError("Camera is not initialized. Please try again.");
      return null;
    }

    if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) {
      setCameraError("Camera is loading. Please wait a moment and try again.");
      return null;
    }

    setIsCapturing(true);
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

      // Convert to blob
      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            const file = new File([blob], `photo-${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            const previewUrl = URL.createObjectURL(file);
            resolve({ file, previewUrl });
            toast.success("Photo captured!");
          },
          "image/jpeg",
          0.95,
        );
      });
    } catch (error) {
      console.error("Photo capture error:", error);
      setCameraError("Failed to capture photo. Please try again.");
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  return {
    videoRef,
    streamRef,
    cameraReady,
    cameraError,
    isCapturing,
    setCameraError,
    initializeCamera,
    capturePhoto,
    stopCamera,
  };
};
