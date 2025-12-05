import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pond, ParameterLog, PondStatus } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PlusCircle, Trash2, History, AlertTriangle, FlaskConical } from 'lucide-react';

interface PondDetailsProps {
  ponds: Pond[];
  logs: ParameterLog[];
  onAddLog: (log: Omit<ParameterLog, 'id' | 'timestamp'>) => void;
  onDeletePond: (id: string) => void;
}

export const PondDetails: React.FC<PondDetailsProps> = ({ ponds, logs, onAddLog, onDeletePond }) => {
  const { pondId } = useParams();
  const navigate = useNavigate();
  const pond = ponds.find(p => p.id === pondId);
  
  const [showLogModal, setShowLogModal] = useState(false);
  const [newLog, setNewLog] = useState({ ph: '', temp: '', od: '', salinity: '', addedMedium: '', notes: '' });

  // Filter logs for this pond and sort by date (oldest first for charts)
  const pondLogs = useMemo(() => {
    return logs.filter(l => l.pondId === pondId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [logs, pondId]);

  // Reverse for list view (newest first)
  const recentLogs = [...pondLogs].reverse();

  if (!pond) return <div className="p-4 text-center">Estanque no encontrado</div>;

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLog({
      pondId: pond.id,
      ph: Number(newLog.ph),
      temperature: Number(newLog.temp),
      opticalDensity: Number(newLog.od),
      salinity: newLog.salinity ? Number(newLog.salinity) : 0,
      addedMedium: newLog.addedMedium ? Number(newLog.addedMedium) : 0,
      notes: newLog.notes
    });
    setNewLog({ ph: '', temp: '', od: '', salinity: '', addedMedium: '', notes: '' });
    setShowLogModal(false);
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar este estanque? Se perderá el historial.')) {
      onDeletePond(pond.id);
      navigate('/dashboard');
    }
  };

  // Get latest stats
  const latest = recentLogs[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Info */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <History size={100} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-800">{pond.name}</h2>
          <div className="flex gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
              💧 {pond.volume}L
            </span>
            <span className={`flex items-center gap-1 px-2 py-1 rounded-lg ${pond.status === PondStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
              ● {pond.status}
            </span>
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
              🧬 {pond.strain}
            </span>
          </div>
        </div>
      </div>

      {/* Latest Parameters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs text-slate-500 uppercase font-bold">pH</div>
          <div className={`text-xl font-bold ${latest?.ph > 10.5 || latest?.ph < 9 ? 'text-red-500' : 'text-slate-800'}`}>
            {latest?.ph ?? '-'}
          </div>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs text-slate-500 uppercase font-bold">Temp (°C)</div>
          <div className="text-xl font-bold text-slate-800">{latest?.temperature ?? '-'}°</div>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs text-slate-500 uppercase font-bold">DO (OD)</div>
          <div className="text-xl font-bold text-slate-800">{latest?.opticalDensity ?? '-'}</div>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs text-slate-500 uppercase font-bold">Sal (ppt)</div>
          <div className="text-xl font-bold text-slate-800">{latest?.salinity || '-'}</div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={() => setShowLogModal(true)}
        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        <PlusCircle /> Registrar Parámetros
      </button>

      {/* Chart Section */}
      {pondLogs.length > 1 && (
        <div className="space-y-4">
          {/* DO Chart */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-4 ml-1">Tendencia de Crecimiento (DO)</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pondLogs}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {day: '2-digit', month:'2-digit'})} 
                      tick={{fontSize: 10, fill: '#94a3b8'}}
                      axisLine={false}
                      tickLine={false}
                  />
                  <YAxis 
                      domain={['dataMin - 0.1', 'dataMax + 0.1']} 
                      tick={{fontSize: 10, fill: '#94a3b8'}}
                      axisLine={false}
                      tickLine={false}
                  />
                  <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      labelStyle={{color: '#64748b', fontSize: '12px'}}
                  />
                  <Line type="monotone" dataKey="opticalDensity" stroke="#059669" strokeWidth={3} dot={{r: 4, fill: '#059669', strokeWidth: 0}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* pH Chart */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-4 ml-1">Historial de pH</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pondLogs}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {day: '2-digit', month:'2-digit'})} 
                      tick={{fontSize: 10, fill: '#94a3b8'}}
                      axisLine={false}
                      tickLine={false}
                  />
                  <YAxis 
                      domain={['dataMin - 0.5', 'dataMax + 0.5']} 
                      tick={{fontSize: 10, fill: '#94a3b8'}}
                      axisLine={false}
                      tickLine={false}
                  />
                  <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      labelStyle={{color: '#64748b', fontSize: '12px'}}
                  />
                  <Line type="monotone" dataKey="ph" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 0}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-2 ml-1">Historial Reciente</h3>
        <div className="space-y-3">
            {recentLogs.length === 0 ? (
                <div className="text-center text-slate-400 py-4 text-sm">Sin registros aún</div>
            ) : (
                recentLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="bg-white p-3 rounded-xl border border-slate-100 text-sm">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-slate-800">{new Date(log.timestamp).toLocaleDateString()} <span className="text-slate-400 text-xs">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></span>
                            {log.addedMedium ? (
                                <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                    <FlaskConical size={10} /> +{log.addedMedium}L Medio
                                </span>
                            ) : null}
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>pH: <span className="font-medium text-slate-700">{log.ph}</span></span>
                            <span>Temp: <span className="font-medium text-slate-700">{log.temperature}°</span></span>
                            <span>DO: <span className="font-medium text-slate-700">{log.opticalDensity}</span></span>
                        </div>
                        {log.notes && (
                           <div className="mt-2 pt-2 border-t border-slate-50 text-xs text-slate-400 italic">"{log.notes}"</div> 
                        )}
                    </div>
                ))
            )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button 
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 w-full text-red-500 py-2 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
        >
            <Trash2 size={16} /> Eliminar Estanque
        </button>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Registro Diario</h3>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">pH</label>
                    <input 
                    type="number" step="0.1" required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    value={newLog.ph}
                    onChange={e => setNewLog({...newLog, ph: e.target.value})}
                    placeholder="9.5"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Temp (°C)</label>
                    <input 
                    type="number" step="0.1" required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    value={newLog.temp}
                    onChange={e => setNewLog({...newLog, temp: e.target.value})}
                    placeholder="30"
                    />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Densidad Óptica</label>
                    <input 
                    type="number" step="0.01" required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    value={newLog.od}
                    onChange={e => setNewLog({...newLog, od: e.target.value})}
                    placeholder="0.5"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Salinidad (ppt)</label>
                    <input 
                    type="number" step="0.1"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    value={newLog.salinity}
                    onChange={e => setNewLog({...newLog, salinity: e.target.value})}
                    placeholder="Opcional"
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Medio Adicionado (L)</label>
                <div className="relative">
                    <input 
                        type="number" step="0.1"
                        className="w-full p-3 pl-10 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                        value={newLog.addedMedium}
                        onChange={e => setNewLog({...newLog, addedMedium: e.target.value})}
                        placeholder="0"
                    />
                    <FlaskConical size={18} className="absolute left-3 top-3.5 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 ml-1">Regístralo si rellenaste el estanque hoy.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                <textarea 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none resize-none h-20"
                  placeholder="Color, olor, espuma..."
                  value={newLog.notes}
                  onChange={e => setNewLog({...newLog, notes: e.target.value})}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowLogModal(false)}
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