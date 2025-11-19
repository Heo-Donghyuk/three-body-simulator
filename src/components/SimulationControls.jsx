import React from 'react';
import { Play, Pause, RotateCcw, Shuffle, Infinity as InfinityIcon, Repeat, Gauge, ZoomIn, Camera } from 'lucide-react';
import { cn } from '../lib/utils';

const SimulationControls = ({
    isPlaying,
    setIsPlaying,
    speed,
    handleSpeedChange,
    zoom,
    handleZoomChange,
    isAutoCamera,
    setIsAutoCamera,
    simulationType,
    initializeBodies,
    isAutoReset,
    setIsAutoReset
}) => {
    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 
                bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/50 
                flex flex-col md:flex-row items-center gap-3 md:gap-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-30 
                w-[95%] md:w-auto max-w-md md:max-w-none">

            {/* Top Row on Mobile: Play & Sliders */}
            <div className="flex items-center justify-between w-full md:w-auto md:justify-start space-x-2 md:space-x-3">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={cn(
                        "p-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center shrink-0",
                        isPlaying
                            ? "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50"
                            : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/50"
                    )}
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <div className="h-8 w-px bg-slate-700 mx-1 hidden md:block"></div>

                <div className="flex items-center space-x-2 flex-1 md:flex-none justify-center">
                    <div className="flex flex-col items-center px-1 w-full md:w-24">
                        <div className="flex items-center space-x-1 text-xs text-slate-400 mb-1">
                            <Gauge className="w-3 h-3" />
                            <span>Speed</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={speed}
                            onChange={handleSpeedChange}
                            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-indigo-400 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-indigo-300"
                        />
                    </div>

                    <div className={cn(
                        "flex flex-col items-center px-1 w-full md:w-24 transition-opacity",
                        isAutoCamera ? "opacity-50 pointer-events-none" : "opacity-100"
                    )}>
                        <div className="flex items-center space-x-1 text-xs text-slate-400 mb-1">
                            <ZoomIn className="w-3 h-3" />
                            <span>Zoom</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={zoom}
                            onChange={handleZoomChange}
                            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-blue-300"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-slate-700 md:h-8 md:w-px md:mx-1 shrink-0"></div>

            {/* Bottom Row on Mobile: Action Buttons */}
            <div className="flex items-center justify-between w-full md:w-auto gap-1 md:gap-2">
                <button
                    onClick={() => setIsAutoCamera(!isAutoCamera)}
                    className={cn(
                        "flex flex-col items-center justify-center px-2 md:px-3 py-1.5 rounded-xl transition-colors group flex-1 md:flex-none min-w-[40px]",
                        isAutoCamera ? "bg-pink-500/20 border border-pink-500/50" : "hover:bg-white/5"
                    )}
                    title="Auto-track all bodies"
                >
                    <Camera className={cn("w-4 h-4 mb-0.5 transition-transform", isAutoCamera ? "text-pink-400" : "text-slate-500")} />
                    <span className={cn("text-[9px] font-medium", isAutoCamera ? "text-pink-300" : "text-slate-500")}>Auto</span>
                </button>

                <button
                    onClick={() => { initializeBodies('figure8'); setIsPlaying(false); }}
                    className={cn(
                        "flex flex-col items-center justify-center px-2 md:px-3 py-1.5 rounded-xl transition-colors group flex-1 md:flex-none min-w-[40px]",
                        simulationType === 'figure8' ? "bg-white/10 border border-white/20" : "hover:bg-white/5"
                    )}
                >
                    <InfinityIcon className="w-4 h-4 text-blue-400 mb-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-medium text-slate-300">Fig8</span>
                </button>

                <button
                    onClick={() => { initializeBodies('random'); setIsPlaying(false); }}
                    className={cn(
                        "flex flex-col items-center justify-center px-2 md:px-3 py-1.5 rounded-xl transition-colors group flex-1 md:flex-none min-w-[40px]",
                        simulationType === 'random' ? "bg-white/10 border border-white/20" : "hover:bg-white/5"
                    )}
                >
                    <Shuffle className="w-4 h-4 text-orange-400 mb-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-medium text-slate-300">Rnd</span>
                </button>

                <div className="h-8 w-px bg-slate-700 mx-1 shrink-0 hidden md:block"></div>

                <button
                    onClick={() => setIsAutoReset(!isAutoReset)}
                    className={cn(
                        "flex flex-col items-center justify-center px-2 md:px-3 py-1.5 rounded-xl transition-colors group flex-1 md:flex-none min-w-[40px]",
                        isAutoReset ? "bg-purple-500/20 border border-purple-500/50" : "hover:bg-white/5"
                    )}
                    title="Auto-reset if 2+ bodies leave area"
                >
                    <Repeat className={cn("w-4 h-4 mb-0.5 transition-transform", isAutoReset ? "text-purple-400" : "text-slate-500")} />
                    <span className={cn("text-[9px] font-medium", isAutoReset ? "text-purple-300" : "text-slate-500")}>Loop</span>
                </button>

                <button
                    onClick={() => { initializeBodies(simulationType); setIsPlaying(true); }}
                    className="flex flex-col items-center justify-center px-2 md:px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors group flex-1 md:flex-none min-w-[40px]"
                    title="Reset current mode"
                >
                    <RotateCcw className="w-4 h-4 text-slate-400 mb-0.5 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-[9px] font-medium text-slate-300">Reset</span>
                </button>
            </div>
        </div>
    );
};

export default SimulationControls;
