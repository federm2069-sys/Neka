export enum PondStatus {
  ACTIVE = 'Activo',
  MAINTENANCE = 'Mantenimiento',
  INACTIVE = 'Inactivo'
}

export interface Pond {
  id: string;
  name: string;
  volume: number; // in Liters
  status: PondStatus;
  strain: string; // Cepa
  createdAt: string; // ISO date
}

export interface ParameterLog {
  id: string;
  pondId: string;
  ph: number;
  temperature: number; // Celsius
  opticalDensity: number; // Secchi or Spectrophotometer
  salinity: number; // ppt
  addedMedium?: number; // Liters of culture medium added
  notes: string;
  timestamp: string; // ISO date
}

export interface Harvest {
  id: string;
  pondId: string;
  wetWeight: number; // grams or kg
  dryWeight?: number; // optional, grams or kg
  batchId?: string;
  notes: string;
  timestamp: string; // ISO date
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}