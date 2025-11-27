import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

// Luxury Card
export interface NeonCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'gold' | 'white' | 'blue';
}

export const NeonCard: React.FC<NeonCardProps> = ({ children, className = '', glowColor = 'gold' }) => {
  const shadowClass = 
    glowColor === 'gold' ? 'hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] border-luxury-gold/20' :
    glowColor === 'white' ? 'hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] border-white/10' :
    'hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] border-blue-500/20';

  return (
    <div className={`
      relative glass-card backdrop-blur-xl border 
      rounded-2xl transition-all duration-500 ease-out
      hover:-translate-y-2 ${shadowClass} ${className}
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Luxury Button
export interface NeonButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ children, variant = 'primary', icon, className, ...props }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold text-luxury-navy border-2 border-luxury-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105",
    secondary: "bg-white/5 text-white border-2 border-white/20 hover:bg-white/10 hover:border-white/40",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white border-2 border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className || ''}`} {...props}>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
      {icon}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// Luxury Input Field
export interface NeonInputProps extends React.ComponentProps<'input'> {
  label?: string;
}

export const NeonInput: React.FC<NeonInputProps> = ({ label, className, ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-sm font-medium text-luxury-gold-light tracking-wide">{label}</label>}
    <input 
      className={`glass-card border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-luxury-gold focus:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 placeholder-gray-500 ${className || ''}`}
      {...props}
    />
  </div>
);

// Luxury Badge
export interface NeonBadgeProps {
  children: ReactNode;
  color?: 'gold' | 'green' | 'blue' | 'red';
}

export const NeonBadge: React.FC<NeonBadgeProps> = ({ children, color = 'gold' }) => {
  const colors = {
    gold: 'bg-luxury-gold/20 text-luxury-gold border-luxury-gold/40',
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    red: 'bg-red-500/20 text-red-300 border-red-500/40',
  };
  return (
    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border backdrop-blur-sm ${colors[color]}`}>
      {children}
    </span>
  );
};

// Luxury Modal
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
            <NeonCard className="w-full max-w-md p-8 z-10 fade-in-up gold-border shadow-[0_0_60px_rgba(212,175,55,0.3)]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold luxury-heading gradient-gold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-luxury-gold transition-colors duration-300 hover:rotate-90 transform">
                        <X size={28} />
                    </button>
                </div>
                {children}
            </NeonCard>
        </div>
    )
}
