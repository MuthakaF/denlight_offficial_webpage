import React, { useState } from 'react';
import { PhoneProduct } from '../types';
import { saveCustomProductImage, resetCustomProductImage, getProductImageUrl } from '../utils/imageStorage';
import { X, Upload, Link as LinkIcon, Check, RotateCcw, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImageUploaderModalProps {
  product: PhoneProduct | null;
  onClose: () => void;
  onImageUpdated?: () => void;
}

export const ImageUploaderModal: React.FC<ImageUploaderModalProps> = ({
  product,
  onClose,
  onImageUpdated
}) => {
  if (!product) return null;

  const currentDisplayUrl = getProductImageUrl(product.id, product.imageUrl);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState<string>(currentDisplayUrl.startsWith('data:') ? '' : currentDisplayUrl);
  const [previewUrl, setPreviewUrl] = useState<string>(currentDisplayUrl);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrorMsg('');
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('Image file size must be under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPreviewUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL change
  const handleUrlSubmit = () => {
    setErrorMsg('');
    if (!urlInput.trim()) {
      setErrorMsg('Please enter a valid image URL');
      return;
    }
    setPreviewUrl(urlInput.trim());
  };

  // Apply changes
  const handleApply = () => {
    if (!previewUrl) return;
    saveCustomProductImage(product.id, previewUrl);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      if (onImageUpdated) onImageUpdated();
      onClose();
    }, 600);
  };

  // Reset to default
  const handleReset = () => {
    resetCustomProductImage(product.id);
    setPreviewUrl(product.imageUrl);
    setUrlInput(product.imageUrl);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      if (onImageUpdated) onImageUpdated();
      onClose();
    }, 600);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border-2 border-black rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-100 text-zinc-700 hover:text-black hover:bg-zinc-200 transition-colors z-20 cursor-pointer"
          title="Close / Go Back"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Customize Product Photo</span>
          </div>
          <h3 className="text-xl font-black text-zinc-950">{product.name}</h3>
          <p className="text-xs text-zinc-600">
            Upload your own device photo from local storage or paste an online image URL. It will instantly render on the site for your shop visitors.
          </p>
        </div>

        {/* Image Preview Box */}
        <div className="relative aspect-video bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-xl p-4 flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="max-h-full object-contain"
              onError={() => setErrorMsg('Failed to load image preview. Check URL or file format.')}
            />
          ) : (
            <div className="text-center space-y-1 text-zinc-400 font-mono text-xs">
              <ImageIcon className="w-8 h-8 mx-auto" />
              <span>No image preview selected</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Option Tabs */}
        <div className="space-y-4">
          <div className="flex rounded-xl bg-zinc-100 p-1 border border-zinc-300 font-mono text-xs font-bold uppercase">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'upload' ? 'bg-black text-white shadow-sm' : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Device File
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'url' ? 'bg-black text-white shadow-sm' : 'text-zinc-600 hover:text-black'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              Paste Image URL
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-black uppercase">
                Choose Image File from your Device:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-zinc-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-bold file:bg-black file:text-white hover:file:bg-zinc-800 cursor-pointer border border-zinc-300 rounded-xl p-1 bg-zinc-50"
              />
              <p className="text-[10px] text-zinc-500 font-mono">
                Supports JPG, PNG, WEBP, GIF (Max 8MB). Automatically converted for live publishing view.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-black uppercase">
                Enter Web Image URL:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/my-phone-photo.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-black font-mono"
                />
                <button
                  onClick={handleUrlSubmit}
                  className="px-4 py-2.5 bg-zinc-200 hover:bg-zinc-300 text-black text-xs font-mono font-bold rounded-xl uppercase"
                >
                  Preview
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 hover:text-black hover:bg-zinc-100 text-xs font-mono font-bold uppercase transition-colors"
            >
              Cancel / Back
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 text-xs font-mono font-medium uppercase transition-colors"
              title="Revert to original stock photo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <button
            onClick={handleApply}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm ${
              isSavedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-black hover:bg-zinc-800 text-white'
            }`}
          >
            {isSavedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                Updated!
              </>
            ) : (
              <span>Save & Publish Photo</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
