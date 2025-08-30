import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Spinner } from './Spinner';
import { Icon } from './Icon';
import { ProcessingStatus } from '../types';

interface EditorProps {
  originalImage: string;
  processedImage: string | null;
  status: ProcessingStatus;
  error: string | null;
  onProcess: () => void;
  onReset: () => void;
}

const loadingMessages = [
  "Analyzing your portrait...",
  "Styling your apparel with Malaysian colors...",
  "Painting an abstract Merdeka background...",
  "Applying dynamic brushstrokes and textures...",
  "Adding subtle gold leaf accents...",
  "Compositing your portrait onto the canvas...",
];

const Editor: React.FC<EditorProps> = ({
  originalImage,
  processedImage,
  status,
  error,
  onProcess,
  onReset,
}) => {
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (status === ProcessingStatus.PROCESSING) {
      interval = setInterval(() => {
        setCurrentLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          return loadingMessages[(currentIndex + 1) % loadingMessages.length];
        });
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const showInitialState = status === ProcessingStatus.IDLE;
  const showProcessingState = status === ProcessingStatus.PROCESSING;
  const showSuccessState = status === ProcessingStatus.SUCCESS && processedImage;
  const showErrorState = status === ProcessingStatus.ERROR;

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'malaysia-colors-apparel.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">Before</h2>
          <div className="relative w-full max-w-lg aspect-square rounded-xl shadow-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
             <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">After</h2>
           <div className="relative w-full max-w-lg aspect-square rounded-xl shadow-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            {showProcessingState && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white z-10">
                <Spinner className="w-12 h-12 mb-4" />
                <p className="text-lg font-semibold">{currentLoadingMessage}</p>
              </div>
            )}
             {showErrorState && (
              <div className="p-4 text-center text-red-500">
                <Icon name="error" className="w-12 h-12 mx-auto mb-2" />
                <p className="font-semibold">An error occurred.</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {(showSuccessState || showProcessingState) && (
              <img src={processedImage || originalImage} alt="Processed" className={`w-full h-full object-contain ${showProcessingState ? 'blur-sm' : ''}`} />
            )}
            {showInitialState && (
              <div className="p-4 text-center text-gray-500">
                <p>Click the button below to restyle your photo.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        {showInitialState && (
           <Button onClick={onProcess} size="lg" icon={<Icon name="magic"/>}>
            Create Merdeka Magic
          </Button>
        )}
        {showProcessingState && (
            <Button size="lg" isLoading={true}>
            Applying Colors...
           </Button>
        )}
        {showSuccessState && (
          <>
            <Button onClick={downloadImage} size="lg" variant="primary" icon={<Icon name="download"/>}>
              Download Image
            </Button>
            <Button onClick={onReset} size="lg" variant="secondary" icon={<Icon name="reset"/>}>
              Start Over
            </Button>
          </>
        )}
        {showErrorState && (
           <Button onClick={onReset} size="lg" variant="secondary" icon={<Icon name="reset"/>}>
            Try Another Image
          </Button>
        )}
        {/* Fix: Removed redundant status check. The `showInitialState` flag already ensures the status is IDLE. */}
        {showInitialState && (
           <Button onClick={onReset} size="lg" variant="secondary" icon={<Icon name="reset"/>}>
            Upload New Image
          </Button>
        )}
      </div>
    </div>
  );
};

export default Editor;
