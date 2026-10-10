"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { researchInterests } from "@/lib/portfolioData";

/** %/s the strip drifts at when the page is still. */
const BASE = -2.2;

function Strip() {
  return (
    <div className="interest-band__copy">
      {researchInterests.map((interest, i) => (
        <span key={interest} className="interest-band__item">
          <span className="interest-band__ref">[{String(i + 1).padStart(2, "0")}]</span>
          {interest}
        </span>
      ))}
    </div>
  );
}

/** Research interests as a strip whose speed and direction follow the reader's scrolling. */
export function InterestBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "100px 0px" });
  const x = useMotionValue(0);
  const dir = useRef(1);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const tx = useTransform(x, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    let move = dir.current * BASE * (delta / 1000);
    move += move * Math.abs(f);
    // Two copies sit side by side, so wrapping at -50% is seamless.
    let next = x.get() + move;
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    x.set(next);
  });

  return (
    <section ref={ref} className="interest-band-wrap" aria-label="Research interests">
      <div className="interest-band">
        <motion.div className="interest-band__track" style={reduce ? undefined : { x: tx }}>
          <Strip />
          <div aria-hidden="true">
            <Strip />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
