import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface MarqueeTextProps {
  text: string;
  className?: string;
}

export default function MarqueeText({ text, className = '' }: MarqueeTextProps) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        setIsOverflowing(textRef.current.offsetWidth > containerRef.current.offsetWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  const scrollDistance = isOverflowing && containerRef.current && textRef.current
    ? textRef.current.offsetWidth - containerRef.current.offsetWidth
    : 0;

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden whitespace-nowrap cursor-default group/marquee ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <motion.span
        ref={textRef}
        className="inline-block"
        animate={isHovered && isOverflowing ? { x: -scrollDistance - 20 } : { x: 0 }}
        transition={{ 
          duration: isHovered ? (scrollDistance / 30) + 1 : 0.5, 
          ease: "linear",
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse",
          repeatDelay: 0.5
        }}
      >
        {text}
      </motion.span>
      
      {isOverflowing && !isHovered && (
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none group-hover/marquee:opacity-0 transition-opacity" />
      )}
    </div>
  );
}
