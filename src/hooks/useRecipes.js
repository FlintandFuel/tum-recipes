import { useState, useEffect } from 'react'
import {
  collection, query, orderBy, onSnapshot, where,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useRecipes(categoryId = null) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const constraints = [orderBy('name')]
    if (categoryId) constraints.unshift(where('categoryId', '==', categoryId))
    const q = query(collection(db, 'recipes'), ...constraints)
    return onSnapshot(q, (snap) => {
      setRecipes(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
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
