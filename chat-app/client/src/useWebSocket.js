import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

const useWebSocket = (url) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connection opened'); // Логирование для проверки соединения
    };

    ws.onmessage = (event) => {
      const { type, message } = JSON.parse(event.data);
      console.log('Received:', type, message); // Логирование для проверки данных

      queryClient.setQueryData('messages', (old = []) => {
        if (!Array.isArray(old)) old = []; // Убедитесь, что old является массивом

        if (type === 'added') {
          return [...old, message];
        } else if (type === 'removed') {
          return old.filter((msg) => msg !== message);
        }
        return old;
      });
    };

    return () => {
      ws.close();
    };
  }, [url, queryClient]);
};

export default useWebSocket;
