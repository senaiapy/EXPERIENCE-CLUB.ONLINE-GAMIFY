'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { uploadProductImage, validateImageFile, getImageUrl } from '@/lib/image-utils';

interface ImageUploadProps {
  productId?: string;
  currentImage?: string;
  onUploadSuccess?: (imageData: any) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  productId,
  currentImage,
  onUploadSuccess,
  onUploadError,
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    currentImage ? getImageUrl(currentImage) : null
  );
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      if (onUploadError) onUploadError(validation.error || 'Invalid file');
      return;
    }

    // Set selected file and preview
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    if (!productId) {
      alert('Product ID is required to upload image');
      if (onUploadError) onUploadError('Product ID is required');
      return;
    }

    setUploading(true);

    try {
      const result = await uploadProductImage(productId, selectedFile);

      if (result.success) {
        alert('Image uploaded successfully!');
        if (onUploadSuccess) onUploadSuccess(result.data);
        // Reset selected file but keep preview
        setSelectedFile(null);
      } else {
        alert(`Upload failed: ${result.error}`);
        if (onUploadError) onUploadError(result.error || 'Upload failed');
      }
    } catch (error: any) {
      alert(`Upload error: ${error.message}`);
      if (onUploadError) onUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePreview = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        {/* Image Preview */}
        <div className="relative w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Product preview"
                fill
                className="object-contain"
                unoptimized
              />
              <button
                type="button"
                onClick={handleRemovePreview}
                disabled={disabled || uploading}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm">No image selected</p>
              </div>
            </div>
          )}
        </div>

        {/* File Input (Hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading}
        />

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={disabled || uploading}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {preview ? 'Change Image' : 'Select Image'}
          </button>

          {selectedFile && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={disabled || uploading || !productId}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload Image</span>
              )}
            </button>
          )}
        </div>

        {/* Instructions */}
        <p className="mt-2 text-xs text-gray-500 text-center">
          JPG, PNG, GIF, or WebP (max 10MB)
        </p>
        {!productId && (
          <p className="mt-1 text-xs text-red-500 text-center">
            Save product first to upload images
          </p>
        )}
      </div>
    </div>
  );
}
