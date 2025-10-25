import { ReactNode, useEffect, MouseEvent } from 'react'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  submitLabel: string
  onSubmit: () => void
  disabled?: boolean
}

export default function Modal({ open, title, onClose, children, submitLabel, onSubmit, disabled }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const stop = (e: MouseEvent) => e.stopPropagation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" aria-hidden="true"></div>
      <div className="relative w-[420px] rounded-lg bg-white shadow-xl" onClick={stop}>
        <header className="flex items-center justify-between px-4 py-3 border-b border-[#EEE]">
          <h3 className="text-[14px] font-semibold">{title}</h3>
          <button aria-label="Fechar" onClick={onClose} className="p-1 rounded hover:bg-[#F6F6F6]" type="button">×</button>
        </header>
        <div className="p-4">
          {children}
          <button
            className="mt-3 w-full h-[36px] rounded bg-brand-500 text-white text-[13px] font-semibold hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={onSubmit}
            disabled={disabled}
            type="button"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
