import { useEffect, useState } from 'react';
import { toastify, unToastify } from '../components/appToaster/appToaster';
import type { Id } from 'react-toastify';

const isProduction = import.meta.env.VITE_ENV === 'production';
console.log(`###Environment production?: ${isProduction}`);

const serverUrl = isProduction ? import.meta.env.VITE_SERVER_URL : 'http://localhost:5005/api';

console.log(`###Serving via ${serverUrl}`);

const useServerReady = (retries = 5, interval = 1000) => {
  const [isServerReady, setIsServerReady] = useState(false);
  const [awaitingServer, setaWaitingServer] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      let attempts = 0;
      let toastId: Id = '';

      while (attempts < retries) {
        try {
          const response = await fetch(`${serverUrl}/health`);
          if (response.ok) {
            setIsServerReady(true);
            toastId = toastify('Server is up.', 'success');
            break;
          }
        } catch (error) {
          console.error('Error checking server:', error);
          toastId = toastify(`Server is down or unresponsive. Retrying (${attempts + 1}/${retries})`, 'error')
        } finally{
          setTimeout(() => unToastify(toastId), 1200);
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, interval));
      }

      setaWaitingServer(false);
    };

    checkServer();
  }, [retries, interval, toastify]);

  return { isServerReady, awaitingServer };
};

export default useServerReady;