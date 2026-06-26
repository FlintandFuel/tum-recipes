import { useState, useEffect } from 'react'
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('order'))
    return onSnapshot(q, (snap) => {
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [])

  const addCategory = (data) =>
    addDoc(collection(db, 'categories'), { ...data, createdAt: serverTimestamp() })

  const updateCategory = (id, data) =>
    updateDoc(doc(db, 'categories', id), data)

  const deleteCategory = (id) =>
    deleteDoc(doc(db, 'categories', id))

  return { categories, loading, addCategory, updateCategory, deleteCategory }
}
