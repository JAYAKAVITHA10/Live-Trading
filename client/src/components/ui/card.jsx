
export function Card({ className='', ...props }) {
  return <div className={`bg-card rounded-2xl shadow p-4 ${className}`} {...props} />
}
export function CardHeader({ className='', ...props }) {
  return <div className={`mb-2 ${className}`} {...props} />
}
export function CardTitle({ className='', ...props }) {
  return <h3 className={`text-lg font-semibold ${className}`} {...props} />
}
export function CardContent({ className='', ...props }) {
  return <div className={`${className}`} {...props} />
}
