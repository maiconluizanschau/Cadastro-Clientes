import { NavLink } from 'react-router-dom';

type Props = { open: boolean; onClose: () => void };

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />
      {/* Drawer */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-[280px] bg-white shadow-xl transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <header className="h-[80px] px-5 flex items-center border-b border-[#eee]">
          <div className="font-extrabold text-lg">teddy<span className="text-[10px] ml-1 text-[#9B9B9B]"> OPEN FINANCE</span></div>
        </header>

        <nav className="px-3 py-4 space-y-1">
          <Item to="/" label="Home" icon="🏠" onClick={onClose} />
          <Item to="/clients" label="Clientes" icon="🧑‍💼" onClick={onClose} />
          <Item to="/selected" label="Clientes selecionados" icon="👤" onClick={onClose} />
        </nav>
      </aside>
    </>
  );
}

function Item({ to, label, icon, onClick }: { to: string; label: string; icon: string; onClick: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        'flex items-center gap-3 rounded px-4 py-3 text-[15px] ' +
        (isActive ? 'bg-[#FFF3EC] text-[#F26D21] font-semibold' : 'hover:bg-[#F6F6F6] text-[#141414]')
      }
    >
      <span className="w-5 text-center">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
