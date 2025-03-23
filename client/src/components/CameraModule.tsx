import { useEffect, useRef } from 'react';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';

interface CameraModuleProps {
  onGestureDetected: (gesture: string) => void;
}

export function CameraModule({ onGestureDetected }: CameraModuleProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const gestureRecognizerRef = useRef<GestureRecognizer | null>(null);

  useEffect(() => {
    let lastVideoTime = -1;
    let results: any = undefined;

    async function initializeGestureRecognizer() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm"
      );

      gestureRecognizerRef.current = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO"
      });
    }

    async function startCamera() {
      const constraints = {
        video: { width: 480, height: 480 }
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    async function predictWebcam() {
      if (!videoRef.current || !gestureRecognizerRef.current) return;
      
      if (videoRef.current.currentTime === lastVideoTime) {
        requestAnimationFrame(predictWebcam);
        return;
      }
      
      lastVideoTime = videoRef.current.currentTime;
      
      results = gestureRecognizerRef.current.recognizeForVideo(videoRef.current, Date.now());
      
      if (results.gestures && results.gestures.length > 0) {
        const gesture = results.gestures[0][0];
        onGestureDetected(gesture.categoryName);
      }
      
      requestAnimationFrame(predictWebcam);
    }

    initializeGestureRecognizer().then(() => {
      startCamera().then(() => {
        if (videoRef.current) {
          videoRef.current.addEventListener('loadeddata', predictWebcam);
        }
      });
    });

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
      if (gestureRecognizerRef.current) {
        gestureRecognizerRef.current.close();
      }
    };
  }, [onGestureDetected]);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <video
        ref={videoRef}
        className="w-full rounded-lg shadow-lg"
        autoPlay
        playsInline
      />
    </div>
  );
} 