import React from 'react';
import { Sparkles } from 'lucide-react';
import { useThreeBodySimulation } from '../hooks/useThreeBodySimulation';
import SimulationCanvas from './SimulationCanvas';
import SimulationControls from './SimulationControls';

const ThreeBodySimulation = () => {
    const {
        bodies,
        trails,
        isPlaying,
        setIsPlaying,
        simulationType,
        isAutoReset,
        setIsAutoReset,
        isAutoCamera,
        setIsAutoCamera,
        speed,
        handleSpeedChange,
        zoom,
        handleZoomChange,
        initializeBodies
    } = useThreeBodySimulation();

    return (
        <div className="flex flex-col h-screen bg-black text-slate-100 font-sans overflow-hidden">
            <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <div className="flex items-center space-x-2 pointer-events-auto">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text text-white">
                        Three-Body Simulator
                    </h1>
                </div>
            </header>

            <SimulationCanvas
                bodies={bodies}
                trails={trails}
                zoom={zoom}
                isAutoCamera={isAutoCamera}
            />

            <SimulationControls
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                speed={speed}
                handleSpeedChange={handleSpeedChange}
                zoom={zoom}
                handleZoomChange={handleZoomChange}
                isAutoCamera={isAutoCamera}
                setIsAutoCamera={setIsAutoCamera}
                simulationType={simulationType}
                initializeBodies={initializeBodies}
                isAutoReset={isAutoReset}
                setIsAutoReset={setIsAutoReset}
            />
        </div>
    );
};

export default ThreeBodySimulation;
