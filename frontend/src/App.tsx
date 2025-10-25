import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Clients from './pages/Clients';
import SelectedClients from './pages/SelectedClients';
import Login from './pages/Login'; // assume que já existe

export default function App() {
  const username = sessionStorage.getItem('username');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={username ? <Navigate to="/clients" replace /> : <Login />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/selected" element={<SelectedClients />} />
      </Routes>
    </BrowserRouter>
  );
}