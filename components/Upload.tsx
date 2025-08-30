import React, { useState, useCallback } from 'react';
import { Icon } from './Icon';
import { Spinner } from './Spinner';
import type { ImageFile } from '../types';

// Declare heic2any which is loaded from a CDN in index.html
declare const heic2any: any;

interface UploadProps {
  onImageUpload: (imageFile: ImageFile) => void;
}

const Upload: React.FC<UploadProps> = ({ onImageUpload }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    let file = files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    // some browsers, especially on mobile, might not set a type. Check extension as a fallback.
    const isHeic = file.type.toLowerCase() === 'image/heic' || file.name.toLowerCase().endsWith('.heic');
    const maxSize = 10 * 1024 * 1024; // 10MB

    const fileType = file.type.toLowerCase();
    const isValidType = validTypes.includes(fileType) || (fileType === '' && isHeic);

    if (!isValidType) {
      setError('Invalid file type. Please upload a JPG, PNG, WEBP or HEIC file.');
      return;
    }

    if (file.size > maxSize) {
      setError('File is too large. Please upload an image under 10MB.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      if (isHeic) {
        setStatusText('Converting image...');
        const conversionResult = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.92,
        });
        const convertedBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
        file = new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpeg'), { type: 'image/jpeg' });
      }

      setStatusText('Preparing image...');

      const normalizedImage = await new Promise<ImageFile>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          if (!event.target?.result) {
            return reject(new Error("Failed to read the file."));
          }
          const img = new Image();
          img.src = event.target.result as string;

          img.onload = () => {
            const MAX_DIMENSION = 1024;
            let { width, height } = img;

            if (width > height) {
              if (width > MAX_DIMENSION) {
                height = Math.round(height * (MAX_DIMENSION / width));
                width = MAX_DIMENSION;
              }
            } else {
              if (height > MAX_DIMENSION) {
                width = Math.round(width * (MAX_DIMENSION / height));
                height = MAX_DIMENSION;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Could not get canvas context.'));
            
            ctx.drawImage(img, 0, 0, width, height);

            const mimeType = 'image/jpeg';
            const base64 = canvas.toDataURL(mimeType, 0.92);
            resolve({ base64, mimeType });
          };
          img.onerror = (err) => reject(new Error('Failed to load image for processing.'));
        };
        reader.onerror = (err) => reject(new Error('Failed to read the file.'));
      });

      onImageUpload(normalizedImage);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to process image: ${message}`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [onImageUpload]);


  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);


  return (
    <div className="max-w-xl mx-auto text-center">
      <label
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        htmlFor="file-upload"
        className={`relative block w-full rounded-lg border-2 border-dashed p-12 text-center hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer transition-colors duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center">
             <Spinner className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400" />
             <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
              {statusText}
            </span>
          </div>
        ) : (
          <>
            <Icon name="upload" className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
              Click to upload or drag and drop
            </span>
            <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, WEBP, HEIC up to 10MB
            </span>
          </>
        )}
         <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/png, image/jpeg, image/webp, image/heic, .heic"
            onChange={(e) => handleFileChange(e.target.files)}
            disabled={isProcessing}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Upload;
