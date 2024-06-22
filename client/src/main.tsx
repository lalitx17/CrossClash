import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DualGame } from './screens/DualGame.tsx'
import { SingleGame } from './screens/SingleGame.tsx'
import './App.css'
import Layout from './Layout.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { TeamGame } from './screens/TeamGame.tsx'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/dualgame',
        element: <DualGame />,
      },
      {
        path: '/singlegame',
        element: <SingleGame />
      }, 
      {
        path: '/teamgame/:gameId', 
        element: <TeamGame />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
