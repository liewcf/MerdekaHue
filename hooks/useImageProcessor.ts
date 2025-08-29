import { useState, useCallback } from 'react';
import { ProcessingStatus } from '../types';
import type { ImageFile } from '../types';
import { recolorImage } from '../services/geminiService';

export const useImageProcessor = () => {
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalImageFile, setOriginalImageFile] = useState<ImageFile | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((imageFile: ImageFile) => {
    setOriginalImage(imageFile.base64);
    setOriginalImageFile(imageFile);
    setStatus(ProcessingStatus.IDLE);
    setProcessedImage(null);
    setError(null);
  }, []);

  const processImage = useCallback(async () => {
    if (!originalImageFile) {
      setError('No image to process.');
      setStatus(ProcessingStatus.ERROR);
      return;
    }

    setStatus(ProcessingStatus.PROCESSING);
    setError(null);

    try {
      const result = await recolorImage(originalImageFile);
      setProcessedImage(result);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Processing failed:', errorMessage);
      setError(`Failed to recolor image. ${errorMessage}`);
      setStatus(ProcessingStatus.ERROR);
    }
  }, [originalImageFile]);

  const reset = useCallback(() => {
    setStatus(ProcessingStatus.IDLE);
    setOriginalImage(null);
    setOriginalImageFile(null);
    setProcessedImage(null);
    setError(null);
  }, []);

  return {
    status,
    originalImage,
    processedImage,
    error,
    handleImageUpload,
    processImage,
    reset,
  };
};
