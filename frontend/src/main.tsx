import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Clients from './pages/Clients'
import Selected from './pages/Selected'
import RequireAuth from './auth/RequireAuth'
import './styles/index.css'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/clients', element: <RequireAuth><Clients /></RequireAuth> },
  { path: '/selected', element: <RequireAuth><Selected /></RequireAuth> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
