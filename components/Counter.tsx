'use client';

import { useRef, useEffect } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

export default function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 20 });
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(0);
      spring.set(value);
    } else {
      spring.set(0);
    }
  }, [isInView, value, motionValue, spring]);

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString() + suffix;
      }
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}
