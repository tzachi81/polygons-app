import { useState, useEffect, useCallback } from 'react';
import { getPolygons, createPolygon, deletePolygon } from '../services/api';
import type { IPolygon } from '../types/global.types';
import { toastify, unToastify } from '../components/appToaster/appToaster';
import type { Id } from 'react-toastify';

export const usePolygons = () => {
  const [polygons, setPolygons] = useState<IPolygon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);



  const fetchImage = useCallback(async (retries: number = 3) => {
    let toastId: Id = '';
    setLoading(true);
    try {
      toastId = toastify('Getting canvas background...', 'info');
      const response = await fetch('https://picsum.photos/1920/1080');

      if (!response.ok) {
        throw new Error('The API did not return any image. Try again.');
      }
      unToastify(toastId);
      setImageUrl(response.url);

    } catch (err) {
      unToastify(toastId);
      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts left`);
        toastId = toastify(`Retrying canvas background(${retries} attempts left)`, 'warning');
        setTimeout(() => fetchImage(retries - 1), 1000);
      } else {
        unToastify(toastId);
        toastify(
          `Failed to get Canvas background image, ${err}`,
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPolygons = useCallback(async () => {
    setLoading(true);
    let toastId: Id = '';
    try {
      toastId = toastify('Preparing canvas...', 'info');
      const data = await getPolygons();
      setPolygons(data);

    } catch (err) {

      setError(String(err));
      unToastify(toastId);
      toastId = toastify(String(err), 'error')
    } finally {
      unToastify(toastId);
      setLoading(false);
    }
  }, []);



  useEffect(() => {
    if (!imageUrl) {
      fetchImage();
    }
  }, [imageUrl]);

  // !I moved this effect to App.tsx to implement serverReady dependency
  // useEffect(() => {
  //   if (imageUrl && imageUrl !== '') {
  //     fetchPolygons();
  //   };
  // }, []);


  const addPolygon = useCallback(async (name: string, points: [number, number][]) => {
    let toastId: Id = '';
    setLoading(true);
    try {
      toastId = toastify('Saving your new shape', 'info');
      await createPolygon(name, points);
      await fetchPolygons();
    } catch (err) {
      setError('Failed to create polygon');
      unToastify(toastId);
      toastify('Failed to save your new shape', 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchPolygons]);


  const removePolygon = useCallback(async (id: string) => {
    setLoading(true);
    let toastId: Id = '';
    try {
      toastId = toastify('deleting polygon, please wait...', "info");
      await deletePolygon(id);
      await fetchPolygons();
    } catch (err) {
      unToastify(toastId);
      setError('Failed to delete polygon');
    } finally {
      setLoading(false);
    }
  }, [fetchPolygons]);

  return { polygons, loading, error, addPolygon, removePolygon, fetchPolygons, imageUrl };
};