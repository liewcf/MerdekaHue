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
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);

  const handleImageUpload = useCallback((imageFile: ImageFile) => {
    setOriginalImage(imageFile.base64);
    setOriginalImageFile(imageFile);
    setStatus(ProcessingStatus.IDLE);
    setProcessedImage(null);
    setError(null);
  }, []);

  const processImage = useCallback(async () => {
    const now = Date.now();
    const COOLDOWN_PERIOD = 15000; // 15 seconds

    if (lastRequestTime && now - lastRequestTime < COOLDOWN_PERIOD) {
      const timeLeft = Math.ceil((COOLDOWN_PERIOD - (now - lastRequestTime)) / 1000);
      setError(`Please wait ${timeLeft} more seconds before trying again.`);
      setStatus(ProcessingStatus.ERROR);
      return;
    }

    if (!originalImageFile) {
      setError('No image to process.');
      setStatus(ProcessingStatus.ERROR);
      return;
    }

    setLastRequestTime(Date.now());
    setStatus(ProcessingStatus.PROCESSING);
    setError(null);

    try {
      const result = await recolorImage(originalImageFile);
      setProcessedImage(result);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Processing failed:', err); // Log the full error for debugging
      
      // Provide user-friendly error messages
      if (errorMessage.toLowerCase().includes("safety policy")) {
        setError("Your image couldn't be processed due to safety policies. Please try a different photo.");
      } else {
        setError("Something went wrong during processing. Please try again.");
      }
      
      setStatus(ProcessingStatus.ERROR);
    }
  }, [originalImageFile, lastRequestTime]);

  const reset = useCallback(() => {
    setStatus(ProcessingStatus.IDLE);
    setOriginalImage(null);
    setOriginalImageFile(null);
    setProcessedImage(null);
    setError(null);
    setLastRequestTime(null); // Also reset rate limit timer
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