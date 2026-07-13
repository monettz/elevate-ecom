import React from 'react';

export function Logo({ className = '', variant = 'horizontal' }) {
  const isHorizontal = variant === 'horizontal';

  return (
    <div className={`flex items-center justify-center ${isHorizontal ? 'flex-row gap-2 md:gap-3' : 'flex-col gap-2'} ${className}`}>
      {isHorizontal ? null : <div className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase leading-none">ELEVATE</div>}
      
      <svg 
        viewBox="0 0 100 50" 
        className={`${isHorizontal ? 'h-5 w-auto md:h-7' : 'h-8 w-auto md:h-12'} text-current flex-shrink-0`}
        aria-hidden="true"
      >
        <defs>
          <clipPath id="centerMask">
            {/* Everything inside this path will be VISIBLE, everything outside hidden.
                We want the opposite. So we draw a huge rectangle, and subtract the center hole by drawing it in the opposite direction. */}
            <path d="M -10 -10 L 110 -10 L 110 60 L -10 60 Z M 50 15 L 65 25 L 50 35 L 35 25 Z" />
          </clipPath>
        </defs>

        <g clipPath="url(#centerMask)">
          {/* X Lines */}
          <line x1="15" y1="5" x2="85" y2="45" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="15" y1="45" x2="85" y2="5" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
          
          {/* Diamond Outline */}
          <polygon points="50,5 90,25 50,45 10,25" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinejoin="round" />
        </g>
        
        {/* Center Solid Diamond */}
        <polygon points="50,19 59,25 50,31 41,25" fill="currentColor" />
      </svg>

      {isHorizontal ? <div className="text-lg md:text-xl font-black tracking-[0.2em] uppercase leading-none mt-1">ELEVATE</div> : null}
    </div>
  );
}
