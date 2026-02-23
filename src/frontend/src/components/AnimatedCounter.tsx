import { useEffect, useState } from 'react';
import { useCountUp } from '../hooks/useCountUp';

interface AnimatedCounterProps {
  target: number;
  duration: number;
}

export default function AnimatedCounter({ target, duration }: AnimatedCounterProps) {
  const count = useCountUp(target, duration);

  return (
    <div className="text-6xl font-bold text-primary animate-count-up">
      {Math.round(count)}
    </div>
  );
}
