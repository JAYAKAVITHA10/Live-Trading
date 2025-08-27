
export function Input({ className='', ...props }) {
  return <input className={`px-3 py-2 rounded-xl bg-muted text-foreground outline-none focus:ring-2 ring-accent ${className}`} {...props} />
}
