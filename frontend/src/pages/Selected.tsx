import Topbar from '../components/Topbar'

export default function Selected() {
  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <Topbar />
      <main className="max-w-[1100px] mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-4">Clientes selecionados</h1>
        <p className="text-[#555]">Tela placeholder para os clientes selecionados.</p>
      </main>
    </div>
  )
}
