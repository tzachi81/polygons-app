import type { IPolygon } from '../types/global.types';

const isProduction = import.meta.env.VITE_ENV === 'production';
const apiUrl = isProduction ? import.meta.env.VITE_API_URL : 'http://localhost:5005';



//TODO: In review session: suggest to add JSDOCS decorators
//TODO: In Review: suggest REST API calls wrapper that takes options, URI and method as parameters
//TODO:(DONE) expand  console.log()s later to add user "toaster" notifications support

export const getPolygons = async (): Promise<IPolygon[]> => {
  console.log('Fetching polygons from the server...');
  const response = await fetch(`${apiUrl}/api/polygons`);
  if (!response.ok) {
    throw new Error('Failed to fetch polygons');
  }
  const data = await response.json();
  console.log('...polygons received.');
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

  const response = await fetch(`${apiUrl}/api/polygons`, createOptions);
  if (!response.ok) {
    throw new Error('Failed to create polygon');
  }
  const data = await response.json();
  console.log('...polygon created on server.');
  return data;
};

export const deletePolygon = async (id: string): Promise<void> => {
  console.log(`Deleting polygon with id: ${id} on server...`);
  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete polygon');
  }
  console.log('...polygon deleted on server.');
};