import { useState, useMemo } from 'react'
import { useAccessLog } from '../hooks/useAccessLog'
import Spinner from '../components/Spinner'
import { Download, AlertTriangle, Filter } from 'lucide-react'

function formatTimestamp(ts) {
  if (!ts) return '—'
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return date.toLocaleString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AccessLog() {
  const { logs, loading } = useAccessLog()
  const [bakerFilter, setBakerFilter] = useState('')
  const [recipeFilter, setRecipeFilter] = useState('')

  const uniqueBakers = useMemo(
    () => [...new Set(logs.map((l) => l.bakerName))].sort(),
    [logs]
  )

  const uniqueRecipes = useMemo(
    () => [...new Set(logs.map((l) => l.recipeName))].sort(),
    [logs]
  )

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (bakerFilter && log.bakerName !== bakerFilter) return false
      if (recipeFilter && log.recipeName !== recipeFilter) return false
      return true
    })
  }, [logs, bakerFilter, recipeFilter])

  const exportCSV = () => {
    const header = 'Baker,Recipe,Opened,Closed,Flagged\n'
    const rows = filtered
      .map((l) =>
        [
          `"${l.bakerName}"`,
          `"${l.recipeName}"`,
          `"${formatTimestamp(l.openedAt)}"`,
          `"${formatTimestamp(l.closedAt)}"`,
          l.closedAt ? 'No' : 'Yes',
        ].join(',')
      )
      .join('\n')

    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `access-log-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold">Access Log ({filtered.length})</h2>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-wheat text-charcoal font-semibold rounded-xl hover:bg-wheat-dark transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <Filter size={14} className="text-stone" />
          <select
            value={bakerFilter}
            onChange={(e) => setBakerFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-stone-light/50 text-sm focus:outline-none focus:ring-2 focus:ring-wheat"
          >
            <option value="">All bakers</option>
            {uniqueBakers.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <select
          value={recipeFilter}
          onChange={(e) => setRecipeFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-stone-light/50 text-sm focus:outline-none focus:ring-2 focus:ring-wheat"
        >
          <option value="">All recipes</option>
          {uniqueRecipes.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-stone text-center py-8">No log entries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-warm-gray text-left">
                <th className="px-3 py-2 font-semibold"></th>
                <th className="px-3 py-2 font-semibold">Baker</th>
                <th className="px-3 py-2 font-semibold">Recipe</th>
                <th className="px-3 py-2 font-semibold">Opened</th>
                <th className="px-3 py-2 font-semibold">Closed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-gray">
              {filtered.map((log) => (
                <tr key={log.id} className={!log.closedAt ? 'bg-amber-50' : ''}>
                  <td className="px-3 py-2">
                    {!log.closedAt && (
                      <AlertTriangle size={14} className="text-amber-500" title="Unresolved session" />
                    )}
                  </td>
                  <td className="px-3 py-2">{log.bakerName}</td>
                  <td className="px-3 py-2">{log.recipeName}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatTimestamp(log.openedAt)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatTimestamp(log.closedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
