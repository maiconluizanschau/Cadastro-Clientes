import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash } from '../components/Icons';

type Client = { id: string; name: string; email: string; phone?: string };
type Enhanced = Client & { salary?: number; company?: number };

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const EXTRAS_KEY = 'client_extras';
const SELECTED_KEY = 'selected_clients';

const readExtras = (): Record<string, {salary?: number; company?: number}> => {
  try { return JSON.parse(localStorage.getItem(EXTRAS_KEY) || '{}'); } catch { return {}; }
};
const writeExtras = (obj: Record<string, {salary?: number; company?: number}>) =>
  localStorage.setItem(EXTRAS_KEY, JSON.stringify(obj));

const readSelected = (): string[] => {
  try { return (JSON.parse(localStorage.getItem(SELECTED_KEY) || '[]') as any[]).map(String); } catch { return []; }
};
const writeSelected = (arr: string[]) => localStorage.setItem(SELECTED_KEY, JSON.stringify(arr));

export default function Clients() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [clients, setClients] = useState<Enhanced[]>([]);
  const [selected, setSelected] = useState<string[]>(readSelected());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(() => {
    const saved = Number(localStorage.getItem('per_page') || '16');
    return [8,12,16,20,24].includes(saved) ? saved : 16;
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<Enhanced | null>(null);
  const [openDelete, setOpenDelete] = useState<Enhanced | null>(null);
  const [form, setForm] = useState({ name: '', salary: '', company: '' });

  // refs de foco (um por modal/campo)
  const createNameRef = useRef<HTMLInputElement>(null);
  const createSalaryRef = useRef<HTMLInputElement>(null);
  const createCompanyRef = useRef<HTMLInputElement>(null);
  const editNameRef = useRef<HTMLInputElement>(null);
  const editSalaryRef = useRef<HTMLInputElement>(null);
  const editCompanyRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  // Foca somente na abertura de cada modal (useLayoutEffect + setTimeout evita disputa)
  useLayoutEffect(() => {
    if (openCreate) {
      const t = setTimeout(() => createNameRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [openCreate]);
  useLayoutEffect(() => {
    if (openEdit) {
      const t = setTimeout(() => editNameRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [openEdit]);

  // persistir selecionados e sincronizar entre abas
  useEffect(() => { writeSelected(selected); }, [selected]);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SELECTED_KEY) setSelected(readSelected());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // clamp da paginação e persistência do perPage
  useEffect(() => {
    const max = Math.max(1, Math.ceil(clients.length / perPage));
    if (page > max) setPage(max);
    localStorage.setItem('per_page', String(perPage));
  }, [clients.length, perPage, page]);

  async function load() {
    const res = await fetch(`${base}/clients`);
    const data: Client[] = await res.json();
    const extras = readExtras();
    const merged: Enhanced[] = data.map(c => ({
      ...c,
      salary: extras[c.id]?.salary ?? 3500,
      company: extras[c.id]?.company ?? 120000,
    }));
    setClients(merged);
  }

  const toggleSelect = (id: string) => {
    const sid = String(id);
    setSelected(sel => sel.includes(sid) ? sel.filter(s => s !== sid) : [...sel, sid]);
  };

  const pages = Math.max(1, Math.ceil(clients.length / perPage));
  const pageItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return clients.slice(start, start + perPage);
  }, [clients, page, perPage]);

  // Helpers de validação
  const moneyToNumber = (v: string) => {
    const norm = v.replace(/\./g, '').replace(',', '.').trim();
    const n = Number(norm);
    return isFinite(n) ? n : NaN;
  };
  const isValidName = form.name.trim().length >= 2;
  const isValidSalary = !isNaN(moneyToNumber(form.salary)) && moneyToNumber(form.salary) > 0;
  const isValidCompany = !isNaN(moneyToNumber(form.company)) && moneyToNumber(form.company) > 0;
  const isCreateValid = isValidName && isValidSalary && isValidCompany;

  // Ações CRUD
  function openCreateModal() {
    setForm({ name: '', salary: '', company: '' });
    setOpenCreate(true);
  }

  async function confirmCreate() {
    if (!isCreateValid) return;
    const name = form.name.trim();
    const email = `${name.toLowerCase().replace(/\s+/g,'')}@exemplo.com`;
    const res = await fetch(`${base}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    const created: Client = await res.json();
    const extras = readExtras(); extras[created.id] = { salary: moneyToNumber(form.salary), company: moneyToNumber(form.company) };
    writeExtras(extras);
    setOpenCreate(false);
    setForm({ name: '', salary: '', company: '' });
    await load();
  }

  function openEditModal(c: Enhanced) {
    setOpenEdit(c);
    setForm({ name: c.name, salary: String(c.salary ?? ''), company: String(c.company ?? '') });
  }

  async function confirmEdit() {
    if (!openEdit) return;
    const name = form.name.trim() || openEdit.name;
    await fetch(`${base}/clients/${openEdit.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const extras = readExtras(); extras[openEdit.id] = { salary: moneyToNumber(form.salary), company: moneyToNumber(form.company) };
    writeExtras(extras);
    setOpenEdit(null);
    await load();
  }

  async function confirmDelete() {
    if (!openDelete) return;
    await fetch(`${base}/clients/${openDelete.id}`, { method: 'DELETE' });
    const extras = readExtras(); delete extras[openDelete.id]; writeExtras(extras);
    setOpenDelete(null);
    await load();
  }

  // Componente Input comum
  const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
    <input
      ref={ref}
      {...props}
      className={
        "h-[36px] w-full rounded-sm border border-[#D9D9D9] bg-white px-3 text-[13px] placeholder:text-[#9B9B9B] outline-none focus:ring-2 focus:ring-brand-500 " +
        (props.className || "")
      }
    />
  ));
  Input.displayName = 'Input';

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <Topbar />

      <main className="max-w-[1100px] mx-auto px-4 py-6">
        {/* header row */}
        <div className="flex items-center">
          <div className="flex-1 text-[16px]">
            <span className="font-semibold">{clients.length}</span> clientes encontrados:
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>Clientes por página:</span>
            <select
              className="h-8 w-16 border border-[#E0E0E0] rounded bg-white px-2 text-sm"
              value={perPage}
              onChange={(e) => { setPerPage(parseInt(e.target.value, 10)); setPage(1); }}
            >
              {[8,12,16,20,24].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {pageItems.map(c => {
            const isSel = selected.includes(String(c.id));
            return (
              <article key={c.id} className="bg-white rounded-[8px] border border-[#EFEFEF] shadow-sm p-16 pt-6 pb-4 relative">
                <header className="text-center">
                  <h3 className="text-[16px] font-semibold mb-1">{c.name}</h3>
                  <p className="text-[12px] text-[#555]">Salário: {BRL.format(c.salary || 0)}</p>
                  <p className="text-[12px] text-[#555]">Empresa: {BRL.format(c.company || 0)}</p>
                </header>
                <footer className="mt-4 flex items-center justify-between px-2 text-[#141414]">
                  <button
                    title={isSel ? "Remover da seleção" : "Selecionar"}
                    className={"p-1 rounded " + (isSel ? 'bg-[#FFF3EC] text-[#F26D21] font-semibold' : 'hover:bg-[#F6F6F6]')}
                    onClick={() => toggleSelect(String(c.id))}
                  >
                    {isSel ? '−' : <Plus />}
                  </button>
                  <button title="Editar" className="p-1 rounded hover:bg-[#F6F6F6]" onClick={() => openEditModal(c)}><Pencil /></button>
                  <button title="Excluir" className="p-1 rounded text-[#F26D21] hover:bg-[#FFF3EC]" onClick={() => setOpenDelete(c)}><Trash /></button>
                </footer>
              </article>
            );
          })}
        </div>

        {/* criar */}
        <div className="mt-6">
          <button
            onClick={openCreateModal}
            className="w-full h-[40px] rounded border border-[#F26D21] text-[14px] text-[#F26D21] hover:bg-[#FFF3EC] transition"
          >
            Criar cliente
          </button>
        </div>

        {/* paginação */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: pages }).map((_, i) => {
            const n = i + 1;
            const active = n === page;
            return (
              <button
                key={n}
                className={"min-w-8 h-8 px-2 rounded " + (active ? "bg-[#F26D21] text-white" : "hover:bg-[#EEE]")}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            );
          })}
        </div>
      </main>

      {/* Modal Criar - campos obrigatórios e foco estável */}
      <Modal
        open={openCreate}
        title="Criar cliente:"
        onClose={() => setOpenCreate(false)}
        submitLabel="Criar cliente"
        onSubmit={confirmCreate}
        disabled={!isCreateValid}
      >
        <div className="grid gap-2">
          <Input
            ref={createNameRef}
            placeholder="Digite o nome:"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.currentTarget.value })}
            required
            aria-invalid={!isValidName}
          />
          <Input
            ref={createSalaryRef}
            placeholder="Digite o salário:"
            inputMode="decimal"
            value={form.salary}
            onChange={e => setForm({ ...form, salary: e.currentTarget.value })}
            required
            aria-invalid={!isValidSalary}
          />
          <Input
            ref={createCompanyRef}
            placeholder="Digite o valor da empresa:"
            inputMode="decimal"
            value={form.company}
            onChange={e => setForm({ ...form, company: e.currentTarget.value })}
            required
            aria-invalid={!isValidCompany}
          />
          {!isCreateValid && (
            <p className="text-xs text-red-600 mt-1">
              Preencha todos os campos: nome (mín. 2 letras), salário e empresa.
            </p>
          )}
        </div>
      </Modal>

      {/* Modal Editar - foco estável e validação básica do nome */}
      <Modal
        open={!!openEdit}
        title="Editar cliente:"
        onClose={() => setOpenEdit(null)}
        submitLabel="Editar cliente"
        onSubmit={confirmEdit}
        disabled={!form.name.trim()}
      >
        <div className="grid gap-2">
          <Input
            ref={editNameRef}
            placeholder="Nome"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.currentTarget.value })}
            required
            aria-invalid={!form.name.trim()}
          />
          <Input
            ref={editSalaryRef}
            placeholder="R$ 3.500,00"
            inputMode="decimal"
            value={form.salary}
            onChange={e => setForm({ ...form, salary: e.currentTarget.value })}
          />
          <Input
            ref={editCompanyRef}
            placeholder="R$ 120.000,00"
            inputMode="decimal"
            value={form.company}
            onChange={e => setForm({ ...form, company: e.currentTarget.value })}
          />
        </div>
      </Modal>

      {/* Modal Excluir */}
      <Modal
        open={!!openDelete}
        title="Excluir cliente:"
        onClose={() => setOpenDelete(null)}
        submitLabel="Excluir cliente"
        onSubmit={confirmDelete}
      >
        <p className="text-[13px] text-[#141414]">
          Você está prestes a excluir o cliente: <span className="font-semibold">{openDelete?.name}</span>
        </p>
      </Modal>
    </div>
  );
}
