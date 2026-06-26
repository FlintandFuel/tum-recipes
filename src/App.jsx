import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'

import BakerSelect from './baker/BakerSelect'
import BakerLayout from './components/BakerLayout'
import CategoryGrid from './baker/CategoryGrid'
import RecipeList from './baker/RecipeList'
import RecipeDetail from './baker/RecipeDetail'

import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import ManageRecipes from './admin/ManageRecipes'
import ManageCategories from './admin/ManageCategories'
import ManageBakers from './admin/ManageBakers'
import AccessLog from './admin/AccessLog'

export default function App() {
  const [baker, setBaker] = useState(null)

  const handleChangeBaker = () => setBaker(null)

  if (!baker) {
    return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route element={<AdminLayout />}>
                      <Route path="recipes" element={<ManageRecipes />} />
                      <Route path="categories" element={<ManageCategories />} />
                      <Route path="bakers" element={<ManageBakers />} />
                      <Route path="access-log" element={<AccessLog />} />
                      <Route path="*" element={<Navigate to="recipes" replace />} />
                    </Route>
                  </Routes>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<BakerSelect onSelect={setBaker} />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route element={<AdminLayout />}>
                    <Route path="recipes" element={<ManageRecipes />} />
                    <Route path="categories" element={<ManageCategories />} />
                    <Route path="bakers" element={<ManageBakers />} />
                    <Route path="access-log" element={<AccessLog />} />
                    <Route path="*" element={<Navigate to="recipes" replace />} />
                  </Route>
                </Routes>
              </ProtectedRoute>
            }
          />
          <Route element={<BakerLayout baker={baker} onChangeBaker={handleChangeBaker} />}>
            <Route path="/" element={<CategoryGrid />} />
            <Route path="/recipes/:categoryId" element={<RecipeList />} />
            <Route path="/recipe/:recipeId" element={<RecipeDetail baker={baker} />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
