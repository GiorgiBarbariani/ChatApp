import React, { useState } from 'react';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from 'react-query';
import { getMessages, createMessage } from './api';
import useWebSocket from './useWebSocket';
import './App.css';

const queryClient = new QueryClient();

const Messages = () => {
  const { data: messages = [] } = useQuery('messages', getMessages);

  console.log('Messages:', messages); // Логирование для проверки данных

  return (
    <ul className="message-list">
      {messages.map((msg, index) => (
        <li key={index}>{msg}</li>
      ))}
    </ul>
  );
};

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const mutation = useMutation(createMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries('messages');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      mutation.mutate(message);
      setMessage('');
    } else {
      alert("Message cannot be empty");
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

const App = () => {
  useWebSocket('ws://localhost:3002');

  return (
    <div className="chat-app">
      <h1>Chat App</h1>
      <MessageInput />
      <Messages />
    </div>
  );
};

export default function Wrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
