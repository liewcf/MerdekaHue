import React from 'react';

interface IconProps {
  name: 'upload' | 'magic' | 'download' | 'reset' | 'error';
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  const icons = {
    upload: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    ),
    magic: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2.6l1.3 2.6 2.6 1.3-2.6 1.3-1.3 2.6-1.3-2.6L5.6 6.5l2.6-1.3L9.5 2.6zM18.5 10.6l1.3 2.6 2.6 1.3-2.6 1.3-1.3 2.6-1.3-2.6-2.6-1.3 2.6-1.3 1.3-2.6zM2 13.5l2.6-1.3 1.3-2.6 1.3 2.6L9.8 13.5l-2.6 1.3-1.3 2.6-1.3-2.6L2 13.5z" />
    ),
    download: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    ),
    reset: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h5M20 20v-5h-5M4 4l16 16"
      />
    ),
    error: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    )
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {icons[name]}
    </svg>
  );
};
