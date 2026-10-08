import React from 'react';

export const VineBorder: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 right-0 h-14 sm:h-20 pointer-events-none overflow-hidden z-20 opacity-85 select-none">
      <svg
        viewBox="0 0 1200 90"
        preserveAspectRatio="none"
        className="w-full h-full animate-sway origin-top"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vine Main Stem */}
        <path
          d="M0,8 Q150,22 300,10 T600,18 T900,12 T1200,16"
          stroke="#2D5A27"
          strokeWidth="3.5"
          fill="none"
        />
        <path
          d="M0,4 Q200,18 400,6 T800,20 T1200,8"
          stroke="#1F3F1B"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Hanging Leaf Clusters */}
        {/* Repeating stylized leaves with lush green gradients */}
        <defs>
          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#68B04D" />
            <stop offset="100%" stopColor="#2E6920" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8AD36A" />
            <stop offset="100%" stopColor="#3B7D2A" />
          </linearGradient>
        </defs>

        {/* Clustered leaves */}
        {[
          { x: 30, y: 12, r: 15, s: 0.9 },
          { x: 75, y: 18, r: -25, s: 1.1 },
          { x: 130, y: 15, r: 20, s: 0.8 },
          { x: 190, y: 22, r: -10, s: 1.2 },
          { x: 260, y: 14, r: 35, s: 1.0 },
          { x: 330, y: 20, r: -20, s: 1.15 },
          { x: 410, y: 16, r: 15, s: 0.85 },
          { x: 480, y: 25, r: -30, s: 1.3 },
          { x: 550, y: 18, r: 25, s: 0.95 },
          { x: 620, y: 24, r: -15, s: 1.1 },
          { x: 700, y: 15, r: 30, s: 0.9 },
          { x: 780, y: 26, r: -25, s: 1.25 },
          { x: 860, y: 19, r: 15, s: 0.95 },
          { x: 930, y: 24, r: -35, s: 1.15 },
          { x: 1010, y: 16, r: 20, s: 0.85 },
          { x: 1090, y: 22, r: -20, s: 1.2 },
          { x: 1160, y: 17, r: 10, s: 0.9 },
        ].map((leaf, idx) => (
          <g
            key={idx}
            transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}
          >
            {/* Hanging Stem */}
            <line x1="0" y1="0" x2="0" y2="16" stroke="#2D5A27" strokeWidth="1.5" />
            {/* Left Leaf */}
            <path
              d="M0,10 C-14,14 -12,28 0,38 C12,28 14,14 0,10 Z"
              fill={idx % 2 === 0 ? "url(#leafGrad1)" : "url(#leafGrad2)"}
              className="drop-shadow-sm"
            />
            {/* Small accent leaf */}
            <path
              d="M-2,6 C-10,8 -8,18 -2,22 C4,18 6,8 -2,6 Z"
              fill="#8AD36A"
              opacity="0.7"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};
