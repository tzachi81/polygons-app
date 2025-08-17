import { toastify, unToastify } from '../components/appToaster/appToaster';
import type { IPolygon } from '../types/global.types';

const isProduction = import.meta.env.VITE_ENV === 'production';
const apiUrl = isProduction ? import.meta.env.VITE_API_URL : 'http://localhost:5005/api';

export const getPolygons = async (): Promise<IPolygon[]> => {
  let toastId = toastify('Updating shapes...', 'info');
  const response = await fetch(`${apiUrl}/polygons`);

  if (!response.ok) {
    throw new Error('Failed to fetch polygons');
  }
  
  unToastify(toastId);
  
  const data = await response.json();
  return data;
};

export const createPolygon = async (name: string, points: [number, number][]): Promise<IPolygon> => {
  const createOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, points }),
  };

  const response = await fetch(`${apiUrl}/polygons`, createOptions);
  if (!response.ok) {
    throw new Error('Failed to create polygon');
  }
  const data = await response.json();
  return data;
};

export const deletePolygon = async (id: string): Promise<void> => {

  const response = await fetch(`${apiUrl}/polygons/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete polygon');
  }
};