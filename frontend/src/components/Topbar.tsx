import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

export default function Topbar() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username') || 'Usuário';
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  function logout() {
    sessionStorage.removeItem('username');
    navigate('/', { replace: true });
  }

  const link = (to: string, label: string) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        'px-3 py-2 text-sm ' +
        (isActive ? 'text-[#F26D21] font-semibold underline underline-offset-4' : 'text-[#141414] hover:text-[#F26D21]')
      }
    >
      {label}
    </NavLink>
  );

  return (
    <header className="w-full h-[72px] bg-white border-b border-[#E9E9E9] flex items-center">
      <div className="max-w-[1100px] w-full mx-auto px-4 flex items-center gap-6">
        <button aria-label="Abrir menu" className="p-2 rounded hover:bg-[#F2F2F2]" onClick={() => setDrawerOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="#141414" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="font-extrabold text-lg">teddy<span className="text-[10px] ml-1 text-[#9B9B9B]"> OPEN FINANCE</span></div>
        <nav className="ml-6 flex-1 flex items-center gap-2">
          {link('/clients', 'Clientes')}
          {link('/selected', 'Clientes selecionados')}
          <button onClick={logout} className="px-3 py-2 text-sm text-[#141414] hover:text-[#F26D21]">Sair</button>
        </nav>
        <div className="text-sm">Olá, <span className="font-semibold">{username}</span>!</div>
      </div>

      {/* Drawer lateral */}
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
