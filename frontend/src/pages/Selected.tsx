import React, { useEffect, useState } from 'react';
import Topbar from '../components/Topbar';

type Client = { id: string | number; name: string; email: string };

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function readSelected(): string[] {
  try {
    const raw = localStorage.getItem('selected_clients');
    return raw ? (JSON.parse(raw) as any[]).map(String) : [];
  } catch {
    return [];
  }
}

export default function Selected() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const ids = readSelected();
    if (ids.length === 0) {
      setClients([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${base}/clients`);
      const data: Client[] = await res.json();
      const extras = JSON.parse(localStorage.getItem('client_extras') || '{}');
      const filtered = data
        .filter((c) => ids.includes(String(c.id)))
        .map((c: any) => ({
          ...c,
          salary: extras[String(c.id)]?.salary ?? 0,
          company: extras[String(c.id)]?.company ?? 0,
        }));
      setClients(filtered);
    } catch (e) {
      console.error('Erro ao carregar selecionados', e);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const onFocus = () => load();
    const onStorage = (e: StorageEvent) => { if (e.key === 'selected_clients') load(); };
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const removeOne = (id: string | number) => {
    const next = readSelected().filter((x) => x !== String(id));
    localStorage.setItem('selected_clients', JSON.stringify(next));
    setClients((prev) => prev.filter((c) => String(c.id) !== String(id)));
  };

  const clearAll = () => {
    localStorage.setItem('selected_clients', JSON.stringify([]));
    setClients([]);
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <Topbar />
      <main className="max-w-[1100px] mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-4">Clientes selecionados</h1>

        {loading && <p className="text-[#555]">Carregando…</p>}

        {!loading && clients.length === 0 && (
          <p className="text-[#555]">Nenhum cliente selecionado ainda. Volte na listagem e selecione alguns.</p>
        )}

        {!loading && clients.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {clients.map((c) => (
                <article key={String(c.id)} className="bg-white rounded-[8px] border border-[#EFEFEF] shadow-sm p-16 pt-6 pb-4 relative">
                  <header className="text-center">
                    <h3 className="text-[16px] font-semibold mb-1">{c.name}</h3>
                    <p className="text-[12px] text-[#555]">Salário: {BRL.format(c.salary || 0)}</p>
                    <p className="text-[12px] text-[#555]">Empresa: {BRL.format(c.company || 0)}</p>
                  </header>
                  <footer className="mt-4 flex items-center justify-center">
                    <button
                      onClick={() => removeOne(c.id)}
                      className="px-3 py-1 rounded border border-[#F26D21] text-[#F26D21] hover:bg-[#FFF3EC] text-sm"
                    >
                      Remover
                    </button>
                  </footer>
                </article>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={clearAll}
                className="w-full h-[40px] rounded border border-[#F26D21] text-[14px] text-[#F26D21] hover:bg-[#FFF3EC] transition"
              >
                Limpar clientes selecionados
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}