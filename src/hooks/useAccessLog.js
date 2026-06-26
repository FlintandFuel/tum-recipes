import { useState, useEffect } from 'react'
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useAccessLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'accessLog'), orderBy('openedAt', 'desc'))
    return onSnapshot(q, (snap) => {
      setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [])

  return { logs, loading }
}

export function logRecipeOpen(bakerId, bakerName, recipeId, recipeName) {
  return addDoc(collection(db, 'accessLog'), {
    bakerId,
    bakerName,
    recipeId,
    recipeName,
    openedAt: serverTimestamp(),
    closedAt: null,
    flagged: false,
  })
}

export function logRecipeClose(logId) {
  return updateDoc(doc(db, 'accessLog', logId), { closedAt: serverTimestamp() })
}
