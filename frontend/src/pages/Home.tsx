import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    sessionStorage.setItem('username', name.trim())
    navigate('/clients')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
      <form onSubmit={onSubmit} className="w-[521px] flex flex-col items-stretch gap-4" aria-label="Formulário de login">
        <h1 className="text-[36px] leading-[1] font-normal text-center text-[#141414] mb-2">
          Olá, seja bem-vindo!
        </h1>
        <label className="sr-only" htmlFor="nome">Digite o seu nome:</label>
        <input
          id="nome"
          className="h-[60px] w-[521px] rounded-sm border border-[#D9D9D9] bg-white px-4 placeholder:text-[#9B9B9B] text-[#141414] outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Digite o seu nome:"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit" className="h-[60px] w-[521px] rounded-sm bg-brand-500 text-white font-semibold tracking-[0.2px] hover:bg-brand-600 transition-colors">
          Entrar
        </button>
      </form>
    </div>
  )
}
