import { useState, useEffect } from 'react'
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useRecipes(categoryId = null) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'recipes'), orderBy('name'))
    return onSnapshot(q, (snap) => {
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      if (categoryId) list = list.filter((r) => r.categoryId === categoryId)
      setRecipes(list)
      setLoading(false)
    }, (err) => {
      console.error('useRecipes error:', err)
      setLoading(false)
    })
  }, [categoryId])

  const addRecipe = (data) =>
    addDoc(collection(db, 'recipes'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })

  const updateRecipe = (id, data) =>
    updateDoc(doc(db, 'recipes', id), { ...data, updatedAt: serverTimestamp() })

  const deleteRecipe = (id) =>
    deleteDoc(doc(db, 'recipes', id))

  return { recipes, loading, addRecipe, updateRecipe, deleteRecipe }
}
