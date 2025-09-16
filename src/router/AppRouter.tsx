import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { Projects } from '../pages/Project/Projects'
import { ProjectDetails } from '../pages/Project/ProjectDetails'
import { Tasks } from '../pages/Project/TasksEnhanced'
import { Boards } from '../pages/Project Boards/Boards'
import { TimeTracking } from '../pages/Time Tracking/TimeTracking'
import { Customers } from '../pages/Customers/Customers'
import { Reports } from '../pages/Reports/Reports'
import { Admin } from '../pages/Admin/Admin'
import { UserProfile } from '../pages/Admin/UserProfile'
import { Auth } from '../pages/Login/Auth'
import { MainLayout } from '../components/layout/MainLayout'

export const createAppRouter = (user: any, onLogin: (userData: any) => void, onLogout: () => void) => {
  return createBrowserRouter([
    {
      path: "/login",
      element: user ? <Navigate to="/" replace /> : <Auth onLogin={onLogin} />
    },
    {
      path: "/",
      element: user ? <MainLayout user={user} onLogout={onLogout} /> : <Navigate to="/login" replace />,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />
        },
        {
          path: "dashboard",
          element: <Dashboard user={user} />
        },
        {
          path: "projects",
          element: <Projects onProjectSelect={() => {}} user={user} />
        },
        {
          path: "projects/:projectId",
          element: <ProjectDetails projectId="" onBack={() => {}} user={user} />
        },
        {
          path: "planning",
          element: <Tasks user={user} />
        },
        {
          path: "boards",
          element: <Boards user={user} />
        },
        {
          path: "timetracking",
          element: <TimeTracking user={user} />
        },
        {
          path: "customers",
          element: <Customers user={user} />
        },
        {
          path: "reports",
          element: <Reports user={user} />
        },
        {
          path: "admin",
          element: <Admin user={user} />
        },
        {
          path: "profile",
          element: <UserProfile user={user} />
        }
      ]
    },
    {
      path: "*",
      element: user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
    }
  ])
}