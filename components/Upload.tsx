import React, { useState, useCallback } from 'react';
import { Icon } from './Icon';
import type { ImageFile } from '../types';

interface UploadProps {
  onImageUpload: (imageFile: ImageFile) => void;
}

const Upload: React.FC<UploadProps> = ({ onImageUpload }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload a JPG, PNG, WEBP or HEIC file.');
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onImageUpload({ base64, mimeType: file.type });
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
      };
      reader.readAsDataURL(file);
    }
  };

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
  }, []);


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
        <Icon name="upload" className="mx-auto h-12 w-12 text-gray-400" />
        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
          Click to upload or drag and drop
        </span>
        <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
          PNG, JPG, WEBP, HEIC up to 12MP
        </span>
         <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/png, image/jpeg, image/webp, image/heic"
            onChange={(e) => handleFileChange(e.target.files)}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Upload;
