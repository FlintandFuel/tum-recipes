export default function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-wheat border-t-transparent" />
    </div>
  )
}
