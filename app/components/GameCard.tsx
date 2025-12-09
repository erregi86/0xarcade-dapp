import { Play } from 'lucide-react';

interface GameCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export function GameCard({ icon, title, description, onClick }: GameCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-[#050505] border border-[#00ff41] p-6 flex flex-col items-center hover:border-2 transition-all duration-150 group cursor-pointer h-full"
    >
      {/* Pixel Art Icon */}
      <div className="mb-6 text-[#00ff41] opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-[#00ff41] mb-4 text-center tracking-wider text-lg font-bold">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[#00ff41] text-xs text-center mb-6 opacity-70 font-mono leading-relaxed flex-grow">
        {description}
      </p>

      {/* Play Button */}
      <button className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-[#00ff41] bg-transparent text-[#00ff41] group-hover:bg-[#00ff41] group-hover:text-[#050505] font-mono transition-all duration-150">
        <Play size={16} fill="currentColor" />
        <span className="text-xs tracking-wide font-bold">PLAY MODULE</span>
      </button>

      {/* Status Indicator */}
      <div className="mt-4 text-[8px] text-[#00ff41] opacity-50 font-mono">
        {'['} STATUS: ONLINE {']'}
      </div>
    </div>
  );
}