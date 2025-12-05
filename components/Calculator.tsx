import React, { useState } from 'react';
import { Calculator as CalcIcon, Droplet, Info, FlaskConical, Scale, RefreshCw, AlertTriangle } from 'lucide-react';

interface Nutrient {
  name: string;
  dosePerLiter: number;
  unit: string;
  func: string;
  category: 'base' | 'macro' | 'micro';
}

interface HarvestNutrient {
  name: string;
  dosePerGram: number; // Dose per 1g of wet paste
  unit: string;
  note?: string;
}

const NUTRIENTS: Nutrient[] = [
  { name: 'Bicarbonato de Sodio', dosePerLiter: 10, unit: 'g', func: 'Mantiene el pH y Carbono', category: 'base' },
  { name: 'Sal Marina', dosePerLiter: 5, unit: 'g', func: 'Base salobre y oligoelementos', category: 'base' },
  { name: 'Nitrato de Potasio', dosePerLiter: 2.5, unit: 'g', func: 'Nitrógeno base para arranque', category: 'macro' },
  { name: 'Fosfato Monopotásico', dosePerLiter: 0.2, unit: 'g', func: 'Energía y Fósforo', category: 'macro' },
  { name: 'Sulfato de Potasio', dosePerLiter: 0.1, unit: 'g', func: 'Potasio extra', category: 'macro' },
  { name: 'Sulfato de Magnesio', dosePerLiter: 0.2, unit: 'g', func: 'Núcleo de la clorofila', category: 'micro' },
  { name: 'Hierro (Tu mezcla)', dosePerLiter: 1, unit: 'ml', func: 'Color verde', category: 'micro' },
];

const HARVEST_NUTRIENTS: HarvestNutrient[] = [
  { name: 'Bicarbonato de Sodio', dosePerGram: 0.1, unit: 'g', note: 'Solo agregar si pH < 10' },
  { name: 'Nitrato de Potasio', dosePerGram: 0.2, unit: 'g' },
  { name: 'Fosfato Monopotásico', dosePerGram: 0.02, unit: 'g' },
  { name: 'Sulfato de Potasio', dosePerGram: 0.01, unit: 'g' },
  { name: 'Sulfato de Magnesio', dosePerGram: 0.01, unit: 'g' },
  { name: 'Hierro (Tu mezcla)', dosePerGram: 0.1, unit: 'ml' },
];

export const Calculator: React.FC = () => {
  const [mode, setMode] = useState<'water' | 'harvest'>('water');
  const [volume, setVolume] = useState<number | ''>(10);
  const [harvestWeight, setHarvestWeight] = useState<number | ''>(100);

  const handleVolumeChange = (val: string) => {
    const num = parseFloat(val);
    setVolume(isNaN(num) ? '' : num);
  };

  const handleHarvestChange = (val: string) => {
    const num = parseFloat(val);
    setHarvestWeight(isNaN(num) ? '' : num);
  };

  const getAmountWater = (dose: number) => {
    if (typeof volume !== 'number') return 0;
    return dose * volume;
  };

  const getAmountHarvest = (dose: number) => {
    if (typeof harvestWeight !== 'number') return 0;
    return dose * harvestWeight;
  };

  const formatValue = (val: number, unit: string) => {
    if (unit === 'g' && val >= 1000) {
      return `${(val / 1000).toFixed(2)} kg`;
    }
    // Remove trailing zeros if integer, otherwise max 2 decimals
    return `${parseFloat(val.toFixed(2))} ${unit}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-emerald-600 p-5 rounded-3xl text-white shadow-lg shadow-emerald-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-xl">
            <CalcIcon size={24} />
          </div>
          <h2 className="text-xl font-bold">Calculadora de Dosis</h2>
        </div>
        <p className="text-emerald-100 text-sm">
          {mode === 'water' 
            ? 'Calcula nutrientes para preparar agua nueva.' 
            : 'Calcula nutrientes para reponer después de cosechar.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-200 rounded-2xl">
        <button
          onClick={() => setMode('water')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            mode === 'water' 
              ? 'bg-white text-emerald-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Droplet size={18} />
          Nuevo Medio
        </button>
        <button
          onClick={() => setMode('harvest')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            mode === 'harvest' 
              ? 'bg-white text-emerald-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Scale size={18} />
          Reposición
        </button>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          {mode === 'water' ? 'Volumen de Agua (Litros)' : 'Pasta Húmeda Cosechada (Gramos)'}
        </label>
        <div className="relative">
          <input 
            type="number" 
            min="0"
            value={mode === 'water' ? volume : harvestWeight}
            onChange={(e) => mode === 'water' ? handleVolumeChange(e.target.value) : handleHarvestChange(e.target.value)}
            className="w-full p-4 pl-12 rounded-xl border border-slate-200 text-lg font-bold text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
            placeholder="0"
          />
          {mode === 'water' ? (
            <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={24} />
          ) : (
            <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={24} />
          )}
        </div>
        
        {/* Quick Presets */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          {mode === 'water' ? (
            [1, 10, 20, 100, 500, 1000].map(v => (
              <button
                key={v}
                onClick={() => setVolume(v)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                  volume === v 
                    ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {v} L
              </button>
            ))
          ) : (
            [50, 100, 250, 500, 1000].map(v => (
              <button
                key={v}
                onClick={() => setHarvestWeight(v)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                  harvestWeight === v 
                    ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {v} g
              </button>
            ))
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
          <FlaskConical size={16} />
          {mode === 'water' ? 'Receta de Medio (Zarrouk Mod.)' : 'Nutrientes de Reposición'}
        </h3>
        
        {mode === 'water' ? (
          NUTRIENTS.map((nutrient, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${
                    nutrient.category === 'base' ? 'bg-blue-400' : 
                    nutrient.category === 'macro' ? 'bg-purple-400' : 'bg-orange-400'
                  }`}></span>
                  <span className="font-bold text-slate-800">{nutrient.name}</span>
                </div>
                <div className="flex items-start gap-1 text-xs text-slate-500">
                  <Info size={12} className="mt-0.5 flex-shrink-0" />
                  <span>{nutrient.func}</span>
                </div>
              </div>
              <div className="text-right pl-4">
                <div className="text-xl font-bold text-emerald-600">
                  {formatValue(getAmountWater(nutrient.dosePerLiter), nutrient.unit)}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Dosis: {nutrient.dosePerLiter}{nutrient.unit}/L
                </div>
              </div>
            </div>
          ))
        ) : (
          HARVEST_NUTRIENTS.map((nutrient, idx) => (
            <div key={idx} className={`bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between ${nutrient.note ? 'border-orange-200 bg-orange-50/30' : 'border-slate-100'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${nutrient.note ? 'bg-orange-400' : 'bg-emerald-400'}`}></span>
                  <span className="font-bold text-slate-800">{nutrient.name}</span>
                </div>
                <div className="flex items-start gap-1 text-xs text-slate-500">
                  {nutrient.note ? (
                      <>
                        <AlertTriangle size={12} className="mt-0.5 flex-shrink-0 text-orange-500" />
                        <span className="font-medium text-orange-600">{nutrient.note}</span>
                      </>
                  ) : (
                      <>
                        <RefreshCw size={12} className="mt-0.5 flex-shrink-0" />
                        <span>Reponer nutriente consumido</span>
                      </>
                  )}
                </div>
              </div>
              <div className="text-right pl-4">
                <div className="text-xl font-bold text-emerald-600">
                  {formatValue(getAmountHarvest(nutrient.dosePerGram), nutrient.unit)}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Ratio: {nutrient.dosePerGram}{nutrient.unit} por 1g pasta
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-sm text-blue-800">
        <Info className="flex-shrink-0 mt-0.5" size={18} />
        {mode === 'water' ? (
          <p>
            Recuerda disolver los macronutrientes por separado antes de agregarlos al tanque principal para evitar precipitaciones.
          </p>
        ) : (
          <p>
            Estas dosis compensan los minerales extraídos en la biomasa. Agrégalas después de cosechar para mantener la densidad del cultivo estable.
          </p>
        )}
      </div>
    </div>
  );
};