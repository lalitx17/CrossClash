import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Game } from './screens/Game.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  }, 
  {
    path: '/game',
    element: <Game />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
