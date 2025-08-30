import React from 'react';

const SampleResult: React.FC = () => {
  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h2 className="text-center text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
        Here's an Example
      </h2>
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-4">
        {/* IMPORTANT: Please add the sample image you provided to the `public` folder and name it `sample-result.png` */}
        <img 
          src="https://i.imgur.com/aY3C8BW.png"
          alt="Sample result showing a before and after comparison of an image processed by MerdekaHue" 
          className="rounded-xl w-full h-auto"
        />
      </div>
    </div>
  );
};

export default SampleResult;
