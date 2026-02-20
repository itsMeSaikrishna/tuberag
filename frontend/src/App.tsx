import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import IndexPage from '@/pages/IndexPage';
import ChatPage from '@/pages/ChatPage';
import { ChatProvider } from '@/context/ChatContext';

export default function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
}
