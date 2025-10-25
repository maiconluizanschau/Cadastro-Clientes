type Props = {
  initial?: { name: string; email: string; phone?: string }
  onSubmit: (data: { name: string; email: string; phone?: string }) => void
}
export default function ClientForm({ initial, onSubmit }: Props) {
  return null // Mantido inline na página para simplicidade; deixe este placeholder se desejar extrair o componente.
}
