"use client";

import { useEffect, useRef } from 'react';

interface Blob {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  dr: number;
  baseR: number;
  phase: number;
}

function makeBlob(x: number, y: number, r: number, phase: number): Blob {
  return {
    x, y, r,
    baseR: r,
    dx: 0.02 + Math.random() * 0.03,
    dy: 0.015 + Math.random() * 0.025,
    dr: 0.2 + Math.random() * 0.3,
    phase,
  };
}

export function MarginBlobs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);
  const rafRef = useRef(0);
  const blobsRef = useRef<{ left: Blob[]; right: Blob[] }>({ left: [], right: [] });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => window.removeEventListener('mousemove', onMouse);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = 0;
    let h = 0;
    let colLeft = 0;
    let colRight = 0;

    const initBlobs = () => {
      const l: Blob[] = [];
      const r: Blob[] = [];
      const marginW = colLeft;

      for (let i = 0; i < 3; i++) {
        const size = 40 + Math.random() * 120;
        l.push(makeBlob(
          -marginW * 0.3 + Math.random() * marginW * 1.6,
          Math.random() * h,
          size,
          i * 2.1,
        ));
        r.push(makeBlob(
          w - marginW * 0.3 + Math.random() * marginW * 1.6 - (w - colRight),
          Math.random() * h,
          size,
          i * 2.1 + 1.05,
        ));
      }
      blobsRef.current = { left: l, right: r };
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const colWidth = Math.min(1120, w - 48);
      const marginW = Math.floor((w - colWidth) / 2);
      colLeft = marginW;
      colRight = w - marginW;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;

      // re-init blobs if needed
      if (blobsRef.current.left.length === 0) initBlobs();
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);

      const t = timeRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const side of ['left', 'right'] as const) {
        const blobs = blobsRef.current[side];
        const sideCenter = side === 'left' ? colLeft / 2 : w - (w - colRight) / 2;

        for (const blob of blobs) {
          const driftX = Math.sin(t * blob.dx + blob.phase) * (blob.baseR * 0.8);
          const driftY = Math.sin(t * blob.dy + blob.phase * 1.7) * (blob.baseR * 0.6);
          const pulseR = blob.baseR + Math.sin(t * blob.dr + blob.phase) * (blob.baseR * 0.15);

          const mxDist = mx * w - sideCenter;
          const myDist = my * h - (blob.y + driftY);
          const mousePullX = mxDist * 0.03;
          const mousePullY = myDist * 0.03;

          const bx = sideCenter + driftX + mousePullX;
          const by = blob.y + driftY + mousePullY;

          ctx!.beginPath();
          ctx!.arc(bx, by, Math.max(pulseR, 4), 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(99, 102, 241, ${0.03 + Math.sin(t * 0.005 + blob.phase) * 0.02 + 0.04})`;
          ctx!.fill();
        }
      }

      timeRef.current += 0.016;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
