import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const getMessages = async () => {
  const response = await api.get('/messages');
  return response.data;
};

export const createMessage = async (message) => {
  await api.post('/messages', { message });
};
