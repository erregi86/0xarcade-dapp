"use client";

import React from 'react';
import { useAudio } from '@/hooks/useAudio';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger'; // Puoi estendere a piacere
}

export const CyberButton = ({ children, onClick, className, variant = 'primary', ...props }: CyberButtonProps) => {
  const { click } = useAudio();

  const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    click(); // <--- Fa partire il suono
    if (onClick) onClick(e); // Esegue la tua funzione originale
  };

  // Stili base Cyberpunk (puoi sostituirli con i tuoi di Tailwind)
  const baseStyle = "px-6 py-2 font-bold uppercase tracking-widest transition-all clip-path-polygon";
  const styles = {
    primary: "bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]",
    danger: "bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]"
  };

  return (
    <button 
      onClick={handlePress} 
      className={`${baseStyle} ${styles[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};