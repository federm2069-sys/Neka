import React, { useState } from 'react';
import { Pond, PondStatus } from '../types';
import { Plus, Droplets, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  ponds: Pond[];
  onAddPond: (pond: Omit<Pond, 'id' | 'createdAt'>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ ponds, onAddPond }) => {
  const [showModal, setShowModal] = useState(false);
  const [newPond, setNewPond] = useState({ name: '', volume: '', strain: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPond({
      name: newPond.name,
      volume: Number(newPond.volume),
      strain: newPond.strain || 'Platensis',
      status: PondStatus.ACTIVE
    });
    setNewPond({ name: '', volume: '', strain: '' });
    setShowModal(false);
  };

  const totalVolume = ponds.reduce((acc, curr) => acc + curr.volume, 0);
  const activePonds = ponds.filter(p => p.status === PondStatus.ACTIVE).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Volumen Total</div>
          <div className="text-2xl font-bold text-emerald-600">{totalVolume.toLocaleString()} <span className="text-sm text-slate-400">L</span></div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Estanques Activos</div>
          <div className="text-2xl font-bold text-emerald-600">{activePonds} <span className="text-sm text-slate-400">/ {ponds.length}</span></div>
        </div>
      </div>

      {/* Ponds List Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Mis Estanques</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 shadow-md transition-all active:scale-95"
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {/* Ponds Grid */}
      <div className="grid gap-4">
        {ponds.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <Droplets className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No hay estanques registrados</p>
            <p className="text-slate-400 text-sm mb-4">Añade tu primer cultivo para comenzar</p>
            <button 
              onClick={() => setShowModal(true)}
              className="text-emerald-600 font-medium underline"
            >
              Registrar estanque
            </button>
          </div>
        ) : (
          ponds.map(pond => (
            <Link 
              key={pond.id} 
              to={`/pond/${pond.id}`}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  pond.status === PondStatus.ACTIVE ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Droplets size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{pond.name}</h3>
                  <div className="flex gap-3 text-xs text-slate-500 mt-1">
                    <span>{pond.volume} L</span>
                    <span>•</span>
                    <span className={pond.status === PondStatus.ACTIVE ? 'text-emerald-600' : 'text-slate-500'}>
                      {pond.status}
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </Link>
          ))
        )}
      </div>

      {/* Add Pond Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-10 fade-in duration-300">
            <h3 className="text-xl font-bold mb-4">Nuevo Estanque</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre / Identificador</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Ej. Tanque A-1"
                  value={newPond.name}
                  onChange={e => setNewPond({...newPond, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Volumen (Litros)</label>
                <input 
                  type="number" 
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Ej. 1000"
                  value={newPond.volume}
                  onChange={e => setNewPond({...newPond, volume: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cepa (Opcional)</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Ej. Paracas"
                  value={newPond.strain}
                  onChange={e => setNewPond({...newPond, strain: e.target.value})}
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