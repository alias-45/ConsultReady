import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, QrCode, AlertCircle, RefreshCw, Upload, Sparkles, KeyRound } from 'lucide-react';
import jsQR from 'jsqr';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';

interface CameraQRScannerProps {
  onScanSuccess: (sessionId: string) => void;
  onScanError: (message: string) => void;
  demoSessionId?: string;
}

export const CameraQRScanner: React.FC<CameraQRScannerProps> = ({
  onScanSuccess,
  onScanError,
  demoSessionId = 'CONSULT_SESSION_8F72A91C'
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const animFrameId = useRef<number | null>(null);

  // Start Camera
  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasPermission(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        setHasPermission(true);
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable', err);
      setHasPermission(false);
      setCameraActive(false);
    }
  }, []);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
    }
  }, []);

  // Continuous frame scanning with jsQR
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (!cameraActive) return;

    const scanFrame = () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        canvasRef.current
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data) {
            // Found a QR code!
            stopCamera();
            onScanSuccess(code.data.trim());
            return;
          }
        }
      }
      animFrameId.current = requestAnimationFrame(scanFrame);
    };

    animFrameId.current = requestAnimationFrame(scanFrame);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [cameraActive, onScanSuccess, stopCamera]);

  // Handle uploaded QR image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imgData.data, imgData.width, imgData.height);
          if (code && code.data) {
            onScanSuccess(code.data.trim());
          } else {
            onScanError('No readable QR code found in uploaded image.');
          }
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    onScanSuccess(manualCode.trim());
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {/* Viewfinder / Camera View */}
      <div className="relative w-full aspect-square max-w-[320px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
        {/* Real Video element */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${
            cameraActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          muted
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Fallback if camera permission is denied or loading */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 mb-3 shadow-inner">
              <Camera className="h-6 w-6 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">Camera Scanner</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[210px] leading-relaxed">
              {hasPermission === false
                ? 'Camera access not permitted. Tap below to use the demo consultation QR.'
                : 'Initializing camera sensor...'}
            </p>
          </div>
        )}

        {/* Scanning Reticle Frame */}
        <div className="relative z-10 w-52 h-52 pointer-events-none">
          {/* 4 Corner brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-[3.5px] border-l-[3.5px] border-blue-500 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-[3.5px] border-r-[3.5px] border-blue-500 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3.5px] border-l-[3.5px] border-blue-500 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3.5px] border-r-[3.5px] border-blue-500 rounded-br-xl" />

          {/* Animated scanning laser line */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38BDF8] animate-pulse my-24" />
        </div>

        {/* Framing guidance overlay */}
        <div className="absolute bottom-3.5 inset-x-3 z-10 text-center">
          <span className="inline-block rounded-full bg-slate-900/85 backdrop-blur-md px-3.5 py-1 text-[11px] font-semibold text-slate-300 border border-slate-700/80 shadow-md">
            Align the QR code within the frame
          </span>
        </div>
      </div>

      {/* Primary Demo Button: Essential for single-device demonstration */}
      <div className="mt-5 w-full space-y-2.5">
        <PrimaryButton
          onClick={() => onScanSuccess(demoSessionId)}
          fullWidth
          size="lg"
          icon={<Sparkles className="h-5 w-5" />}
        >
          Use Demo QR (One Click)
        </PrimaryButton>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Upload image fallback */}
          <label className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200/90 bg-white py-2.5 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition active:scale-95 shadow-2xs">
            <Upload className="h-4 w-4 text-slate-500" />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileUpload}
            />
          </label>

          {/* Manual token input toggle */}
          <SecondaryButton
            onClick={() => setShowManualInput(!showManualInput)}
            size="md"
            icon={<KeyRound className="h-4 w-4" />}
          >
            Enter Code
          </SecondaryButton>
        </div>

        {/* Manual Input Form */}
        {showManualInput && (
          <form
            onSubmit={handleManualSubmit}
            className="mt-2.5 flex gap-2 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-2xs animate-in fade-in duration-150"
          >
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. CONSULT_SESSION_8F72A91C"
              className="flex-1 px-3 py-2 text-xs font-mono uppercase text-slate-900 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition active:scale-95 shadow-sm"
            >
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
