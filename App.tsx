import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PondDetails } from './components/PondDetails';
import { HarvestManager } from './components/HarvestManager';
import { AIAssistant } from './components/AIAssistant';
import { Calculator } from './components/Calculator';
import { Pond, ParameterLog, Harvest } from './types';
import * as StorageService from './services/storageService';

const AppContent: React.FC = () => {
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [logs, setLogs] = useState<ParameterLog[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial Data Load
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedPonds, loadedLogs, loadedHarvests] = await Promise.all([
          StorageService.getPonds(),
          StorageService.getLogs(),
          StorageService.getHarvests()
        ]);
        
        setPonds(loadedPonds);
        setLogs(loadedLogs);
        setHarvests(loadedHarvests);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Error de conexión con la base de datos. Verifica tu configuración.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // CRUD Operations passed down to components
  const addPond = async (pond: Omit<Pond, 'id' | 'createdAt'>) => {
    try {
      const newPond = await StorageService.savePond(pond);
      setPonds(prev => [...prev, newPond]);
    } catch (err) {
      alert("Error al guardar estanque. Verifica tu conexión.");
    }
  };

  const addLog = async (log: Omit<ParameterLog, 'id' | 'timestamp'>) => {
    try {
      const newLog = await StorageService.saveLog(log);
      setLogs(prev => [newLog, ...prev]); // Prepend since we sort descending usually
    } catch (err) {
      alert("Error al guardar registro.");
    }
  };

  const addHarvest = async (harvest: Omit<Harvest, 'id' | 'timestamp'>) => {
    try {
      const newHarvest = await StorageService.saveHarvest(harvest);
      setHarvests(prev => [newHarvest, ...prev]);
    } catch (err) {
      alert("Error al guardar cosecha.");
    }
  };

  const deletePond = async (id: string) => {
    try {
      await StorageService.deletePond(id);
      setPonds(prev => prev.filter(p => p.id !== id));
      // Clean up related logs/harvests ideally, but kept simple for now
    } catch (err) {
      alert("Error al eliminar estanque.");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-emerald-600 animate-pulse">Conectando a Neka Cloud...</div>;

  if (error) return (
    <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
      <div className="text-red-500 font-bold mb-2">Error de Configuración</div>
      <p className="text-slate-600 mb-4">{error}</p>
      <div className="text-xs text-slate-400 bg-slate-100 p-4 rounded text-left overflow-auto max-w-full">
        <p className="font-bold">Instrucciones:</p>
        <p>1. Abre el archivo <code>services/firebase.ts</code></p>
        <p>2. Reemplaza los valores de <code>firebaseConfig</code> con los de tu proyecto en Firebase Console.</p>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route 
          path="dashboard" 
          element={<Dashboard ponds={ponds} onAddPond={addPond} />} 
        />
        <Route 
          path="pond/:pondId" 
          element={<PondDetails ponds={ponds} logs={logs} onAddLog={addLog} onDeletePond={deletePond} />} 
        />
        <Route 
          path="harvests" 
          element={<HarvestManager ponds={ponds} harvests={harvests} onAddHarvest={addHarvest} />} 
        />
        <Route 
          path="calculator" 
          element={<Calculator />} 
        />
        <Route 
          path="assistant" 
          element={<AIAssistant ponds={ponds} logs={logs} />} 
        />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;