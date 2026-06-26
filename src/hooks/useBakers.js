import { useState, useEffect } from 'react'
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useBakers(activeOnly = false) {
  const [bakers, setBakers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'bakers'), orderBy('name'))
    return onSnapshot(q, (snap) => {
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      if (activeOnly) list = list.filter((b) => b.active)
      setBakers(list)
      setLoading(false)
    })
  }, [activeOnly])

  const addBaker = (name) =>
    addDoc(collection(db, 'bakers'), { name, active: true, createdAt: serverTimestamp() })

  const updateBaker = (id, data) =>
    updateDoc(doc(db, 'bakers', id), data)

  return { bakers, loading, addBaker, updateBaker }
}
