'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function VantaBackground() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect) {
      // @ts-ignore
      import('vanta/dist/vanta.net.min').then((VANTA) => {
        setVantaEffect(
          VANTA.default({
            el: vantaRef.current,
            THREE: THREE,
            color: 0x6c63ff,
            backgroundColor: 0xfafafa,
            points: 10.0,
            maxDistance: 20.0,
            spacing: 15.0,
          })
        );
      });
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="absolute top-0 left-0 w-full h-full -z-10"
    />
  );
}
