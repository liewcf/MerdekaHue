import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        MerdekaHue 🇲🇾
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Upload a portrait and we'll magically restyle your apparel with Malaysian colors and place you against a beautiful, abstract-painted Merdeka background.
      </p>
    </header>
  );
};

export default Header;