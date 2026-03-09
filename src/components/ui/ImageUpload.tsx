import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Loader2, ZoomIn } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ImageUploadProps {
  value?: string;
  onChange?: (file: File | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  maxSize?: number;
  acceptedTypes?: string[];
  preview?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  placeholder = 'Upload image',
  disabled = false,
  className,
  error,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  preview = true,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const createPreview = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a valid image.');
      return false;
    }
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size exceeds ${maxSize}MB limit.`);
      return false;
    }
    return true;
  }, [maxSize, acceptedTypes]);

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return;
    
    setIsLoading(true);
    createPreview(file);
    onChange?.(file);
    setIsLoading(false);
  }, [createPreview, onChange, validateFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !previewUrl) {
      inputRef.current?.click();
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />
      
      {preview && previewUrl ? (
        <div className="relative group flex flex-col items-center justify-center w-full h-[100%] rounded-md border-2 border-dashed cursor-pointer">
          <img
            src={previewUrl}
            alt="Preview"
            onClick={handleImageClick}
            className="w-full h-[100%] object-cover rounded-md border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:opacity-90 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-[10px] -right-[10px] p-1 rounded-full bg-red-500/90 text-white shadow-md hover:bg-red-600 transition-colors cursor-pointer z-10"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center w-full h-[100%] rounded-md border-2 border-dashed transition-colors cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isDragging 
              ? 'border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-800' 
              : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600',
            error && 'border-red-500'
          )}
        >
          {isLoading ? (
            <Loader2 className="h-8 w-8 text-zinc-400 animate-spin" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-zinc-400 mb-2" />
              <p className="text-sm text-zinc-500">{placeholder}</p>
              <p className="text-xs text-zinc-400 mt-1">
                Max size: {maxSize}MB
              </p>
            </>
          )}
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {/* Image Preview Modal */}
      {isModalOpen && previewUrl && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer p-4 sm:p-6 md:p-8"
          onClick={handleCloseModal}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Full Preview"
              className="max-w-full max-h-full sm:max-w-[95vw] sm:max-h-[85vh] md:max-w-[90vw] md:max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-0 right-0 sm:-top-2 sm:-right-2 md:-top-4 md:-right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white hover:text-zinc-300 transition-colors cursor-pointer z-10"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/60 text-xs sm:text-sm md:hidden">
              Tap outside to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
