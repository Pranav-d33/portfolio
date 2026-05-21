"use client";

import { useEffect, useRef } from 'react';
import { useScroll } from 'framer-motion';

export function MarginWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseYRef = useRef(0);
  const scrollVelRef = useRef(0);
  const timeRef = useRef(0);
  const rafRef = useRef(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseYRef.current = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    let prev = scrollY.get();
    const unsub = scrollY.on('change', (v) => {
      scrollVelRef.current = Math.abs(v - prev);
      prev = v;
    });
    return () => unsub();
  }, [scrollY]);

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
    let marginW = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const colWidth = Math.min(1120, w - 48);
      marginW = Math.floor((w - colWidth) / 2);
      colLeft = marginW;
      colRight = w - marginW;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    let prevScroll = 0;
    const draw = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.scale(dpr, dpr);

      const speed = scrollVelRef.current > 3
        ? timeRef.current * 2
        : timeRef.current * 0.4;
      const amp = 14 + Math.sin(timeRef.current * 0.003) * 4;

      const waveOpts = [
        { offset: 0, ampMul: 1, freqMul: 1, speedMul: 1, alpha: 0.12, lw: 1.5 },
        { offset: 2, ampMul: 0.6, freqMul: 1.3, speedMul: 1.5, alpha: 0.06, lw: 1 },
      ];

      for (const side of ['left', 'right'] as const) {
        const baseX = side === 'left' ? colLeft - 8 : colRight + 8;

        for (const opt of waveOpts) {
          ctx!.beginPath();
          ctx!.strokeStyle = `rgba(99, 102, 241, ${opt.alpha})`;
          ctx!.lineWidth = opt.lw;

          for (let y = 0; y < h; y += 1) {
            const mouseDist = Math.abs(y - mouseYRef.current);
            const mouseInf = Math.max(0, 1 - mouseDist / 250);
            const scrollOff = scrollY.get() * 0.008;
            const wave = Math.sin(y * 0.008 * opt.freqMul + speed * 0.05 * opt.speedMul + scrollOff + opt.offset)
              * (amp * opt.ampMul + mouseInf * 10);
            const x = baseX + (side === 'left' ? -Math.abs(wave) : Math.abs(wave));
            if (y === 0) ctx!.moveTo(x, y);
            else ctx!.lineTo(x, y);
          }
          ctx!.stroke();
        }

        // Glow dot near mouse Y
        if (mouseYRef.current > 0) {
          const dotX = side === 'left' ? colLeft - 6 : colRight + 6;
          ctx!.beginPath();
          ctx!.arc(dotX, mouseYRef.current, 2, 0, Math.PI * 2);
          ctx!.fillStyle = 'rgba(99, 102, 241, 0.35)';
          ctx!.fill();
          ctx!.beginPath();
          ctx!.arc(dotX, mouseYRef.current, 8, 0, Math.PI * 2);
          ctx!.fillStyle = 'rgba(99, 102, 241, 0.1)';
          ctx!.fill();
        }
      }

      timeRef.current += 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [scrollY]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
