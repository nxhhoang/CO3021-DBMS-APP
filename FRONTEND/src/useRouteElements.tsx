import path from './constants/path'
import { useContext, lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from './contexts/app.context'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
import NotFound from './pages/NotFound'


const Home = lazy(() => import('./pages/Home'))

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line react-refresh/only-export-components
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)

  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '',
          element: <RegisterLayout />,
          children: [
            // {
            //   path: path.login,
            //   element: (
            //     <Suspense>
            //       <Login />
            //     </Suspense>
            //   )
            // },
            // {
            //   path: path.register,
            //   element: (
            //     <Suspense>
            //       <Register />
            //     </Suspense>
            //   )
            // }
          ]
        }
      ]
    },
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          index: true,
          path: path.home,
          element: (
            <Suspense fallback={<div>Loading homepage...</div>}>
              <Home />
            </Suspense>
          )
        },
        {
          path: '*',
          element: (
            <Suspense>
              <NotFound />
            </Suspense>
          )
        }
      ]
    }
  ])
  return routeElements
}
