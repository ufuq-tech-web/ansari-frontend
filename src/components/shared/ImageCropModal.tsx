"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { getCroppedImg } from "../../lib/crop-image";
import { adminApi } from "../../lib/admin-api";

interface Props {
  imageSrc: string;
  onClose: () => void;
  onCropped: (url: string) => void;
  aspectRatio?: number;
}

export default function ImageCropModal({ imageSrc, onClose, onCropped, aspectRatio = 21 / 9 }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setLoading(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedFile) throw new Error("Failed to crop image.");

      const formData = new FormData();
      formData.append("file", croppedFile);

      const response = await adminApi.upload<{ url: string }>("/products/upload-image", formData);

      onCropped(response.url);
    } catch (e) {
      alert("Failed to upload cropped photo");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-950/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-charcoal-100">
          <div>
            <h3 className="font-poppins font-bold text-xl text-charcoal-900">Crop Image</h3>
            <p className="text-sm font-inter text-charcoal-500 mt-1">Adjust your banner for the perfect fit.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-charcoal-100 transition-colors text-charcoal-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative w-full h-[50vh] bg-charcoal-100">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="p-6 bg-charcoal-50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full max-w-xs">
            <ZoomOut className="w-5 h-5 text-charcoal-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-brand-orange h-1.5 bg-charcoal-200 rounded-lg appearance-none cursor-pointer"
            />
            <ZoomIn className="w-5 h-5 text-charcoal-400" />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-poppins font-semibold text-charcoal-600 border border-charcoal-200 hover:bg-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-poppins font-semibold text-white bg-brand-orange hover:bg-orange-600 shadow-md shadow-brand-orange/20 transition-all disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Crop & Save"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
