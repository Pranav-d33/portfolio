"use client";

import React from "react";

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 w-full max-w-full pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 
        Aurora Gradients:
        Deep teal and cyan, moving smoothly to create a thermal drift effect.
      */}
      <div 
        className="absolute w-[80vw] h-[80vh] rounded-full mix-blend-screen opacity-[0.15] blur-[100px]"
        style={{
          top: '-20%',
          left: '-10%',
          background: 'color-mix(in srgb, var(--accent) 70%, var(--text-primary))',
          animation: 'aurora-drift-1 12s ease-in-out infinite alternate',
        }}
      />
      <div 
        className="absolute w-[70vw] h-[70vh] rounded-full mix-blend-screen opacity-[0.12] blur-[120px]"
        style={{
          bottom: '-20%',
          right: '-10%',
          background: 'color-mix(in srgb, var(--accent) 55%, var(--text-secondary))',
          animation: 'aurora-drift-2 15s ease-in-out infinite alternate-reverse',
        }}
      />
      <div 
        className="absolute w-[60vw] h-[60vh] rounded-full mix-blend-screen opacity-[0.18] blur-[90px]"
        style={{
          top: '20%',
          left: '30%',
          background: 'color-mix(in srgb, var(--accent) 40%, var(--text-tertiary))',
          animation: 'aurora-drift-3 18s ease-in-out infinite alternate',
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
        @keyframes aurora-drift-3 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15vw, 25vh) scale(1.25); }
          100% { transform: translate(25vw, -15vh) scale(0.85); }
        }
      `}} />
    </div>
  );
}
