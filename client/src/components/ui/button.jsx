
export function Button({ className = '', ...props }) {
  return <button className={`px-3 py-2 rounded-2xl bg-accent text-white hover:opacity-90 transition ${className}`} {...props} />
}
