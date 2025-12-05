import { Pond, ParameterLog, Harvest } from '../types';

const COLLECTIONS = {
  PONDS: 'ponds',
  LOGS: 'logs',
  HARVESTS: 'harvests',
};

// Helper to simulate async behavior and storage
const getFromStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading from localStorage", e);
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
};

// --- PONDS ---

export const getPonds = async (): Promise<Pond[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return getFromStorage<Pond>(COLLECTIONS.PONDS);
};

export const savePond = async (pondData: Omit<Pond, 'id' | 'createdAt'>): Promise<Pond> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const ponds = getFromStorage<Pond>(COLLECTIONS.PONDS);
  
  const newPond: Pond = {
    id: Date.now().toString(),
    ...pondData,
    createdAt: new Date().toISOString()
  };
  
  ponds.push(newPond);
  saveToStorage(COLLECTIONS.PONDS, ponds);
  
  return newPond;
};

export const deletePond = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  let ponds = getFromStorage<Pond>(COLLECTIONS.PONDS);
  ponds = ponds.filter(p => p.id !== id);
  saveToStorage(COLLECTIONS.PONDS, ponds);
};

// --- LOGS ---

export const getLogs = async (): Promise<ParameterLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const logs = getFromStorage<ParameterLog>(COLLECTIONS.LOGS);
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const saveLog = async (logData: Omit<ParameterLog, 'id' | 'timestamp'>): Promise<ParameterLog> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const logs = getFromStorage<ParameterLog>(COLLECTIONS.LOGS);
  
  const newLog: ParameterLog = {
    id: Date.now().toString(),
    ...logData,
    timestamp: new Date().toISOString()
  };
  
  logs.push(newLog);
  saveToStorage(COLLECTIONS.LOGS, logs);
  
  return newLog;
};

// --- HARVESTS ---

export const getHarvests = async (): Promise<Harvest[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const harvests = getFromStorage<Harvest>(COLLECTIONS.HARVESTS);
  return harvests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const saveHarvest = async (harvestData: Omit<Harvest, 'id' | 'timestamp'>): Promise<Harvest> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const harvests = getFromStorage<Harvest>(COLLECTIONS.HARVESTS);
  
  const newHarvest: Harvest = {
    id: Date.now().toString(),
    ...harvestData,
    timestamp: new Date().toISOString()
  };
  
  harvests.push(newHarvest);
  saveToStorage(COLLECTIONS.HARVESTS, harvests);
  
  return newHarvest;
};