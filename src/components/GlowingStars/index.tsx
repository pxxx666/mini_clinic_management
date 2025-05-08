import { cn } from '@/utils/classNames';
import React, { useEffect, useRef, useState } from 'react';
import './index.less';

const Star = ({ isGlowing, delay }: { isGlowing: boolean; delay: number }) => {
  return (
    <div
      key={delay}
      className={`glowing-stars-star ${isGlowing ? 'glowing-stars-star-glowing' : ''}`}
      style={{
        transition: `all 2s ease-in-out ${delay}s`,
      }}
    ></div>
  );
};

const Glow = ({ delay }: { delay: number }) => {
  return (
    <div
      className="glowing-stars-glow"
      style={{
        transition: `opacity 2s ease-in-out ${delay}s`,
      }}
    />
  );
};

const Illustration = ({ mouseEnter }: { mouseEnter: boolean }) => {
  const stars = 108;
  const columns = 18;

  const [glowingStars, setGlowingStars] = useState<number[]>([]);

  const highlightedStars = useRef<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      highlightedStars.current = Array.from({ length: 5 }, () => Math.floor(Math.random() * stars));
      setGlowingStars([...highlightedStars.current]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="glowing-stars-illustration"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {[...Array(stars)].map((_, starIdx) => {
        const isGlowing = glowingStars.includes(starIdx);
        const delay = (starIdx % 10) * 0.1;
        const staticDelay = starIdx * 0.01;
        return (
          <div key={`matrix-col-${starIdx}}`} className="glowing-stars-star-container">
            <Star
              isGlowing={mouseEnter ? true : isGlowing}
              delay={mouseEnter ? staticDelay : delay}
            />
            {mouseEnter && <Glow delay={staticDelay} />}
            {isGlowing && <Glow delay={delay} />}
          </div>
        );
      })}
    </div>
  );
};

export const GlowingStarsBackgroundCard = ({
  className,
  children,
  style,
}: {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const [mouseEnter, setMouseEnter] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setMouseEnter(true);
      }}
      onMouseLeave={() => {
        setMouseEnter(false);
      }}
      className={cn('glowing-stars-container', className)}
      style={style}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Illustration mouseEnter={mouseEnter} />
      </div>
      <div className="glowing-stars-content">{children}</div>
    </div>
  );
};

export const GlowingStarsDescription = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return <p className={cn('glowing-stars-description', className)}>{children}</p>;
};

export const GlowingStarsTitle = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return <h2 className={cn('glowing-stars-title', className)}>{children}</h2>;
};
