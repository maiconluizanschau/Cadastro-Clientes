import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold mr-auto">Teddy — Painel de Clientes</h1>
        <nav className="flex gap-3 text-blue-600">
          <Link to="/" className="hover:underline">Início</Link>
          <Link to="/clients" className="hover:underline">Clientes</Link>
        </nav>
      </header>
      <main className="mt-6">
        <Outlet />
      </main>
    </div>
  )
}
