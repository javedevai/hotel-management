import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

// Neon Card
export interface NeonCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'green';
}

export const NeonCard: React.FC<NeonCardProps> = ({ children, className = '', glowColor = 'cyan' }) => {
  const shadowClass = 
    glowColor === 'cyan' ? 'hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] border-cyan-500/20' :
    glowColor === 'purple' ? 'hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] border-indigo-500/20' :
    'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-500/20';

  return (
    <div className={`
      relative bg-neon-surface/80 backdrop-blur-xl border 
      rounded-xl transition-all duration-300 ease-out
      hover:-translate-y-1 ${shadowClass} ${className}
    `}>
      {children}
    </div>
  );
};

// Neon Button
export interface NeonButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ children, variant = 'primary', icon, className, ...props }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]",
    secondary: "bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white",
    danger: "bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className || ''}`} {...props}>
      {icon}
      {children}
    </button>
  );
};

// Input Field
export interface NeonInputProps extends React.ComponentProps<'input'> {
  label?: string;
}

export const NeonInput: React.FC<NeonInputProps> = ({ label, className, ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{label}</label>}
    <input 
      className={`bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all placeholder-slate-600 ${className || ''}`}
      {...props}
    />
  </div>
);

// Badge
export interface NeonBadgeProps {
  children: ReactNode;
  color?: 'cyan' | 'green' | 'amber' | 'red';
}

export const NeonBadge: React.FC<NeonBadgeProps> = ({ children, color = 'cyan' }) => {
  const colors = {
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

// Modal
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
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <NeonCard className="w-full max-w-md p-6 z-10 animate-fade-in-up border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                {children}
            </NeonCard>
        </div>
    )
}
