import React, { useState } from 'react';
import { Pond, Harvest } from '../types';
import { Sprout, Scale, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface HarvestManagerProps {
  ponds: Pond[];
  harvests: Harvest[];
  onAddHarvest: (harvest: Omit<Harvest, 'id' | 'timestamp'>) => void;
}

export const HarvestManager: React.FC<HarvestManagerProps> = ({ ponds, harvests, onAddHarvest }) => {
  const [showModal, setShowModal] = useState(false);
  const [newHarvest, setNewHarvest] = useState({ pondId: '', wetWeight: '', dryWeight: '', notes: '' });
  const [visibleCount, setVisibleCount] = useState(5);

  const sortedHarvests = [...harvests].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const visibleHarvests = sortedHarvests.slice(0, visibleCount);
  
  const totalWetWeight = harvests.reduce((acc, h) => acc + h.wetWeight, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddHarvest({
      pondId: newHarvest.pondId,
      wetWeight: Number(newHarvest.wetWeight),
      dryWeight: newHarvest.dryWeight ? Number(newHarvest.dryWeight) : undefined,
      notes: newHarvest.notes
    });
    setNewHarvest({ pondId: '', wetWeight: '', dryWeight: '', notes: '' });
    setShowModal(false);
    setVisibleCount(5); // Reset view to see the new entry at top
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const handleShowLess = () => {
    setVisibleCount(5);
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200">
        <h2 className="text-emerald-100 font-medium text-sm uppercase tracking-wide">Cosecha Total (Peso Húmedo)</h2>
        <div className="text-4xl font-bold mt-1 flex items-baseline gap-2">
            {(totalWetWeight / 1000).toFixed(2)} <span className="text-lg font-normal text-emerald-100">kg</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-800">Registros de Cosecha</h3>
        <button 
            onClick={() => setShowModal(true)}
            className="text-emerald-600 font-medium text-sm bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
        >
            + Nueva Cosecha
        </button>
      </div>

      <div className="space-y-3">
        {sortedHarvests.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <Sprout className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No hay cosechas registradas.</p>
            </div>
        ) : (
            <>
                {visibleHarvests.map(harvest => {
                    const pond = ponds.find(p => p.id === harvest.pondId);
                    return (
                        <div key={harvest.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in duration-300">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                                        <Scale size={18} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">{harvest.wetWeight}g <span className="text-xs font-normal text-slate-500">(húmedo)</span></div>
                                        <div className="text-xs text-slate-500">{pond?.name || 'Estanque desconocido'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <Calendar size={12} />
                                    {new Date(harvest.timestamp).toLocaleDateString()}
                                </div>
                            </div>
                            {harvest.notes && (
                                <div className="bg-slate-50 p-2 rounded-lg text-xs text-slate-500 mt-2">
                                    {harvest.notes}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Pagination Controls */}
                {sortedHarvests.length > 5 && (
                    <div className="pt-2 flex justify-center">
                        {visibleCount < sortedHarvests.length ? (
                            <button 
                                onClick={handleLoadMore}
                                className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-full transition-colors"
                            >
                                <ChevronDown size={16} />
                                Cargar más anteriores ({sortedHarvests.length - visibleCount} restantes)
                            </button>
                        ) : (
                            <button 
                                onClick={handleShowLess}
                                className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-emerald-600 px-4 py-2 rounded-full transition-colors"
                            >
                                <ChevronUp size={16} />
                                Ver menos
                            </button>
                        )}
                    </div>
                )}
            </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Registrar Cosecha</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Origen</label>
                <select 
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-none"
                    value={newHarvest.pondId}
                    onChange={e => setNewHarvest({...newHarvest, pondId: e.target.value})}
                >
                    <option value="">Selecciona un estanque</option>
                    {ponds.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Peso Húmedo (g)</label>
                    <input 
                      type="number" required
                      className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                      placeholder="Ej. 500"
                      value={newHarvest.wetWeight}
                      onChange={e => setNewHarvest({...newHarvest, wetWeight: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Peso Seco (g)</label>
                    <input 
                      type="number" 
                      className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                      placeholder="Opcional"
                      value={newHarvest.dryWeight}
                      onChange={e => setNewHarvest({...newHarvest, dryWeight: e.target.value})}
                    />
                  </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                <textarea 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none resize-none h-20"
                  placeholder="Calidad de la biomasa, método de secado..."
                  value={newHarvest.notes}
                  onChange={e => setNewHarvest({...newHarvest, notes: e.target.value})}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-medium text-slate-600 active:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 font-medium text-white shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};