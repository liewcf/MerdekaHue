import React from 'react';
import Header from './components/Header';
import Upload from './components/Upload';
import Editor from './components/Editor';
import { useImageProcessor } from './hooks/useImageProcessor';

function App() {
  const {
    status,
    originalImage,
    processedImage,
    error,
    handleImageUpload,
    processImage,
    reset,
  } = useImageProcessor();

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-6xl">
        <Header />
        <main className="mt-8">
          {!originalImage ? (
            <Upload onImageUpload={handleImageUpload} />
          ) : (
            <Editor
              originalImage={originalImage}
              processedImage={processedImage}
              status={status}
              error={error}
              onProcess={processImage}
              onReset={reset}
            />
          )}
        </main>
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
          <p>Powered by Gemini. Built with React & Tailwind CSS.</p>
          <p className="mt-1">
            Your photos are processed securely and are not stored after you leave.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;