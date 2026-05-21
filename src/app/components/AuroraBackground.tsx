"use client";

import React from "react";

export function AuroraBackground({ className = "fixed inset-0" }: { className?: string }) {
  return (
    <div className={`${className} w-full max-w-full pointer-events-none overflow-hidden`} aria-hidden="true">
      <div 
        className="absolute w-[80vw] h-[80vh] rounded-full mix-blend-screen opacity-[0.12] blur-[100px]"
        style={{
          top: '-20%',
          left: '-10%',
          background: 'color-mix(in srgb, var(--accent) 60%, transparent)',
          animation: 'aurora-drift-1 12s ease-in-out infinite alternate',
        }}
      />
      <div 
        className="absolute w-[70vw] h-[70vh] rounded-full mix-blend-screen opacity-[0.1] blur-[120px]"
        style={{
          bottom: '-20%',
          right: '-10%',
          background: 'color-mix(in srgb, var(--accent) 45%, transparent)',
          animation: 'aurora-drift-2 15s ease-in-out infinite alternate-reverse',
        }}
      />
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes aurora-drift-1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25vw, 15vh) scale(1.15); }
          100% { transform: translate(-10vw, 25vh) scale(0.9); }
        }
        @keyframes aurora-drift-2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25vw, -20vh) scale(1.2); }
          100% { transform: translate(15vw, -30vh) scale(0.95); }
        }
      `}} />
    </div>
  );
}
