import React, { useEffect, useState } from 'react';
import Topbar from '../components/Topbar';
import { Trash } from '../components/Icons';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function SelectedClients() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [clients, setClients] = useState<any[]>([]);

  async function load() {
    const selectedRaw = localStorage.getItem('selected_clients');
    const selected: string[] = selectedRaw ? JSON.parse(selectedRaw) : [];
    if (selected.length === 0) return setClients([]);

    try {
      const res = await fetch(`${base}/clients`);
      const data = await res.json();
      const extras = JSON.parse(localStorage.getItem('client_extras') || '{}');
      const filtered = data
        .filter((c: any) => selected.includes(String(c.id)))
        .map((c: any) => ({
          ...c,
          salary: extras[c.id]?.salary ?? 0,
          company: extras[c.id]?.company ?? 0,
        }));
      setClients(filtered);
    } catch (err) {
      console.error('Erro ao carregar clientes selecionados:', err);
      setClients([]);
    }
  }

  useEffect(() => {
    load();
    window.addEventListener('focus', load);
    const onStorage = (e: StorageEvent) => { if (e.key === 'selected_clients') load(); };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('focus', load);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const removeClient = (id: string) => {
    const selected: string[] = (JSON.parse(localStorage.getItem('selected_clients') || '[]') as any[]).map(String).filter((c: string) => c !== String(id));
    localStorage.setItem('selected_clients', JSON.stringify(selected));
    setClients(clients.filter(c => String(c.id) !== String(id)));
  };

  const clearAll = () => {
    localStorage.removeItem('selected_clients');
    setClients([]);
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <Topbar />
      <main className="max-w-[1100px] mx-auto px-4 py-6">
        <h2 className="text-[16px] font-semibold mb-4">Clientes selecionados:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {clients.map(c => (
            <article key={c.id} className="bg-white rounded-[8px] border border-[#EFEFEF] shadow-sm p-16 pt-6 pb-4 relative">
              <header className="text-center">
                <h3 className="text-[16px] font-semibold mb-1">{c.name}</h3>
                <p className="text-[12px] text-[#555]">Salário: {BRL.format(c.salary || 0)}</p>
                <p className="text-[12px] text-[#555]">Empresa: {BRL.format(c.company || 0)}</p>
              </header>
              <footer className="mt-4 flex items-center justify-center">
                <button title="Remover" className="p-1 rounded text-[#F26D21] hover:bg-[#FFF3EC]" onClick={() => removeClient(c.id)}><Trash /></button>
              </footer>
            </article>
          ))}
        </div>

        {clients.length > 0 && (
          <div className="mt-6">
            <button onClick={clearAll} className="w-full h-[40px] rounded border border-[#F26D21] text-[14px] text-[#F26D21] hover:bg-[#FFF3EC] transition">
              Limpar clientes selecionados
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
