import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertTriangle, Check } from 'lucide-react';

export default function PhotoUploadModal({ album, onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const handleFileSelect = (file) => {
    setError(null);
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG and WebP images are allowed.');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError(null);
      await onUploadSuccess(album.id, selectedFile);
      onClose();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-sky-400" />
              Upload Photo to "{album.name}"
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Supports JPEG, PNG, and WebP format
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-950/50 border border-rose-500/30 text-rose-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          {!previewUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[180px] ${
                isDragOver
                  ? 'border-sky-500 bg-sky-500/10'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/80'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 mb-3 border border-slate-700/60">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Click to browse or drag & drop image here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                MAX file size 10MB • JPG, PNG, WEBP
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-2 group">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-48 object-contain rounded-xl bg-slate-900"
              />
              <div className="p-3 flex items-center justify-between text-xs text-slate-300">
                <span className="truncate max-w-[240px] font-medium">
                  {selectedFile.name}
                </span>
                <span className="text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-rose-600 text-white p-1.5 rounded-full backdrop-blur transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="px-5 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 rounded-xl transition flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Upload Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
