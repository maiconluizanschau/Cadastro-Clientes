import { useEffect, useRef } from 'react';

type Props = { when: boolean };

export default function FocusOnce({ when }: Props) {
  const done = useRef(false);
  useEffect(() => {
    if (when && !done.current) {
      // tenta focar o primeiro [data-autofocus] do modal
      const el = document.querySelector('[data-modal-root] [data-autofocus]') as HTMLElement | null;
      if (el) el.focus();
      done.current = true;
      // reseta quando o modal fecha
      return () => { done.current = false; };
    }
  }, [when]);
  return null;
}