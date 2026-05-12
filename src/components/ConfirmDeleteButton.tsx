import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmDeleteButtonProps {
  onDelete: () => void;
  className?: string;
}

export default function ConfirmDeleteButton({ onDelete, className = '' }: ConfirmDeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (isConfirming) {
      const timer = setTimeout(() => setIsConfirming(false), 2500); // Reset after 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isConfirming]);

  return (
    <div className={`relative flex items-center justify-end min-w-[70px] ${className}`}>
      <AnimatePresence mode="wait">
        {!isConfirming ? (
          <motion.button
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsConfirming(true);
            }}
            className="text-xs font-bold text-gray-400 hover:text-red-500 px-2 py-1 transition-colors"
          >
            Xóa
          </motion.button>
        ) : (
          <motion.button
            key="confirm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setIsConfirming(false);
            }}
            className="text-xs font-black text-white bg-red-500 px-3 py-1.5 rounded-lg shadow-sm"
          >
            Xác nhận
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
