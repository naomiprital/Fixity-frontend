/**
 * Utility functions for handling camera streams, avatar capturing and validation.
 */

/**
 * Validates the uploaded avatar file.
 * Returns an error message string if invalid, or null if valid.
 */
export const validateAvatarFile = (file: File): string | null => {
  if (file.size > 2 * 1024 * 1024) {
    return 'File is too large. Limit is 2MB.';
  }
  return null;
};

/**
 * Starts the webcam video stream.
 */
export const startCameraStream = async (): Promise<MediaStream> => {
  return navigator.mediaDevices.getUserMedia({
    video: { width: 320, height: 320, facingMode: 'user' },
    audio: false,
  });
};

/**
 * Stops the active webcam video stream.
 */
export const stopCameraStream = (stream: MediaStream | null): void => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
};

/**
 * Captures a square photo from a video element and draws it onto a canvas,
 * returning a promise that resolves to a JPEG File.
 */
export const captureCanvasPhoto = (
  video: HTMLVideoElement | null,
  canvas: HTMLCanvasElement | null
): Promise<File | null> => {
  return new Promise((resolve) => {
    if (!video || !canvas) {
      resolve(null);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(null);
      return;
    }

    // Keep square aspect ratio centered
    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    canvas.width = 300;
    canvas.height = 300;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, 300, 300);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'captured_profile.jpg', { type: 'image/jpeg' });
          resolve(file);
        } else {
          resolve(null);
        }
      },
      'image/jpeg',
      0.95
    );
  });
};
