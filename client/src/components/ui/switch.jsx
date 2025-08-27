
export function Switch({ checked, onChange }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700
         peer-checked:after:translate-x-full after:content-[''] after:absolute after:h-5 after:w-5 after:bg-white after:rounded-full after:transition
         relative"></div>
    </label>
  )
}
