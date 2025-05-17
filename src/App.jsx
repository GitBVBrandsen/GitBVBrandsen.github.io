import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ShieldCheck, AlertTriangle as TriangleAlert, Flame, ThermometerSun } from 'lucide-react';

const App = () => {
  const [riskLevel, setRiskLevel] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const { toast } = useToast();
  
  const riskLevels = [
    { name: "Bueno", color: "#4ade80", range: [0, 20], icon: <ShieldCheck className="h-6 w-6 text-green-400" /> },
    { name: "Moderado", color: "#facc15", range: [21, 40], icon: <TriangleAlert className="h-6 w-6 text-yellow-400" /> },
    { name: "Alto", color: "#f97316", range: [41, 60], icon: <Flame className="h-6 w-6 text-orange-400" /> },
    { name: "Muy Alto", color: "#ef4444", range: [61, 80], icon: <Flame className="h-6 w-6 text-red-500" /> },
    { name: "Extremo", color: "#b91c1c", range: [81, 100], icon: <ThermometerSun className="h-6 w-6 text-red-700" /> },
  ];

  const getCurrentRiskLevelDetails = () => {
    return riskLevels.find(
      (level) => riskLevel >= level.range[0] && riskLevel <= level.range[1]
    ) || riskLevels[0];
  };

  const currentRiskDetails = getCurrentRiskLevelDetails();

  useEffect(() => {
    const currentRisk = getCurrentRiskLevelDetails();
    if (currentRisk) {
      toast({
        title: `Nivel de riesgo: ${currentRisk.name}`,
        description: `El nivel de riesgo de incendio es ${currentRisk.name.toLowerCase()} (${riskLevel}%)`,
        duration: 2000,
        className: 'bg-slate-800 border-slate-700 text-white',
      });
    }
  }, [riskLevel, toast]);

  const handleSliderChange = (value) => {
    setRiskLevel(value[0]);
  };

  const setRandomRiskLevel = () => {
    const randomLevel = Math.floor(Math.random() * 101);
    setRiskLevel(randomLevel);
  };

  const needleRotation = -90 + (riskLevel / 100) * 180;

  const gaugeGradient = "conic-gradient(from -90deg at 50% 100%, #4ade80 0deg 36deg, #facc15 36deg 72deg, #f97316 72deg 108deg, #ef4444 108deg 144deg, #b91c1c 144deg 180deg)";
  
  const gaugeTicks = Array.from({ length: 6 }).map((_, i) => {
    const value = i * 20;
    const angleDeg = -90 + (value / 100) * 180;
    return { value, angleDeg };
  });

  const segmentArcLength = 180 / riskLevels.length; // Each segment is 36 degrees for a 180 degree arc

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 selection:bg-red-500 selection:text-white">
      <div className="max-w-lg w-full mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-red-500 to-red-700 mb-2">
            Velocímetro de Riesgo de Incendio
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Visualizador interactivo del nivel de riesgo de incendio.
          </p>
        </div>

        <div className="bg-neutral-900/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-800 mb-8">
          <div className="relative w-full max-w-xs sm:max-w-sm mx-auto aspect-[2/1] mb-6"> {/* Aspect ratio 2:1 for semi-circle */}
            {/* Arco de la Dona (Gauge) y Segmentos Hover */}
            <div className="absolute w-full h-full top-0 left-0">
              <div 
                className="w-full h-full rounded-t-full overflow-hidden relative"
                style={{
                  maskImage: 'radial-gradient(circle at 50% 100%, transparent 55%, black 56%)',
                  WebkitMaskImage: 'radial-gradient(circle at 50% 100%, transparent 55%, black 56%)',
                }}
              >
                <div 
                  className="w-full h-full"
                  style={{ background: gaugeGradient }}
                />
                {/* Segmentos para hover effect */}
                {riskLevels.map((level, index) => {
                  const startAngle = -90 + index * segmentArcLength;
                  const endAngle = startAngle + segmentArcLength;
                  return (
                    <motion.div
                      key={level.name}
                      className="absolute w-full h-full top-0 left-0 origin-bottom-center"
                      style={{
                        clipPath: `path('M ${50 + 45 * Math.cos(startAngle * Math.PI / 180)} ${100 + 45 * Math.sin(startAngle * Math.PI / 180)} A 45 45 0 0 1 ${50 + 45 * Math.cos(endAngle * Math.PI / 180)} ${100 + 45 * Math.sin(endAngle * Math.PI / 180)} L ${50 + 25 * Math.cos(endAngle * Math.PI / 180)} ${100 + 25 * Math.sin(endAngle * Math.PI / 180)} A 25 25 0 0 0 ${50 + 25 * Math.cos(startAngle * Math.PI / 180)} ${100 + 25 * Math.sin(startAngle * Math.PI / 180)} Z')`,
                        transformOrigin: '50% 100%', // Center bottom
                        pointerEvents: 'auto',
                      }}
                      onHoverStart={() => setHoveredSegment(level.name)}
                      onHoverEnd={() => setHoveredSegment(null)}
                    >
                      <AnimatePresence>
                        {hoveredSegment === level.name && (
                          <motion.div
                            className="absolute inset-0"
                            style={{ backgroundColor: `${level.color}66` }} // Semi-transparent highlight
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Marcas de Graduación y Números */}
            <div className="absolute w-full h-full top-0 left-0">
              <div className="w-full h-full relative">
                {gaugeTicks.map(({ value, angleDeg }) => (
                  <div
                    key={`mark-${value}`}
                    className="absolute left-1/2 bottom-0 origin-bottom"
                    style={{
                      height: 'calc(100% + 10px)', 
                      transform: `translateX(-50%) rotate(${angleDeg}deg)`,
                    }}
                  >
                    <div
                      className="absolute left-1/2 top-0 transform -translate-x-1/2 bg-neutral-400"
                      style={{
                        width: '2px',
                        height: '10px',
                      }}
                    />
                    {value % 20 === 0 && (
                       <div
                        className="absolute left-1/2 text-xs sm:text-sm font-medium text-neutral-300"
                        style={{
                          top: '-18px', 
                          transform: `translateX(-50%) rotate(${-angleDeg}deg)`,
                        }}
                      >
                        {value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Aguja */}
            <motion.div 
              className="absolute left-1/2 bottom-[10px] origin-bottom" // Pivot from bottom center of the gauge area
              initial={{ rotate: -90 }}
              animate={{ rotate: needleRotation }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
              style={{ width: '10px', height: 'calc(50% - 20px)' }} // Adjusted height for semi-circle
            >
              <div className="w-full h-full relative">
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-white"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', 
                    transformOrigin: 'bottom center',
                  }}
                />
                <div className="w-5 h-5 rounded-full bg-white absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 shadow-md border-2 border-neutral-800"></div>
              </div>
            </motion.div>

            {/* Valor numérico central */}
            <div className="absolute left-1/2 top-[calc(100% - 30px)] transform -translate-x-1/2 -translate-y-1/2 text-center"> {/* Adjusted top for semi-circle */}
              <motion.div 
                className="text-4xl sm:text-5xl font-bold text-white"
                key={riskLevel}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {riskLevel}
                <span className="text-2xl sm:text-3xl opacity-70">%</span>
              </motion.div>
            </div>
          </div>

          {/* Indicador de nivel actual */}
          <motion.div 
            className="flex items-center justify-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl mb-6 mt-8" // Added mt-8
            style={{ backgroundColor: `${currentRiskDetails.color}33` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={currentRiskDetails.name}
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            >
              {currentRiskDetails.icon}
            </motion.div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold" style={{ color: currentRiskDetails.color }}>
                {currentRiskDetails.name}
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm">
                {riskLevel <= 20 ? "Condiciones óptimas, riesgo mínimo." : 
                 riskLevel <= 40 ? "Precaución, vigilar condiciones." :
                 riskLevel <= 60 ? "Alerta, condiciones propicias para ignición." :
                 riskLevel <= 80 ? "Peligro alto, evitar actividades de riesgo." :
                 "¡Peligro extremo! Máxima alerta y precaución."}
              </p>
            </div>
          </motion.div>

          {/* Control deslizante */}
          <div className="mb-6 px-2 sm:px-0">
            <label htmlFor="riskSlider" className="block text-sm font-medium text-neutral-300 mb-2">
              Ajustar Nivel de Riesgo:
            </label>
            <Slider
              id="riskSlider"
              value={[riskLevel]}
              max={100}
              step={1}
              onValueChange={handleSliderChange}
              className="py-4"
            />
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={setRandomRiskLevel}
              className="bg-gradient-to-r from-amber-500 via-red-600 to-red-700 hover:from-amber-600 hover:via-red-700 hover:to-red-800 text-white font-semibold px-8 py-3 text-base rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              size="lg"
            >
              Nivel Aleatorio
            </Button>
          </div>
        </div>

        <footer className="text-center text-xs sm:text-sm text-neutral-500 mt-10">
          <p>Este velocímetro es una herramienta de visualización. No reemplaza las alertas oficiales.</p>
          <p>&copy; {new Date().getFullYear()} Monitor de Riesgo de Incendio. Todos los derechos reservados.</p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default App;