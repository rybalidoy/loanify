import { Cog6ToothIcon, CurrencyDollarIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { BuildingOfficeIcon, PresentationChartLineIcon } from "@heroicons/react/24/solid";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Companies = lazy(() => import('../pages/Company/Companies'));
const Users = lazy(() => import('../pages/User/Users'));
const Loans = lazy(() => import('../pages/Loans'));
// const Settings = lazy(() => import('../pages/Settings'));

const AppRoutes = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace/>,
    exclude: true
  },
  {
    path: 'dashboard',
    label: 'Dashboard',
    element: <Dashboard/>,
    permission: null,
    icon: <PresentationChartLineIcon width={24}/>
  },
  {
    path: 'companies',
    label: 'Companies',
    element: <Companies/>,
    permission: null,
    icon: <BuildingOfficeIcon width={24}/> 
  },
  {
    path: 'users',
    label: 'Users',
    element: <Users/>,
    permission: null,
    icon: <UserGroupIcon width={24}/>
  },
  {
    path: 'loans',
    label: 'Loans',
    element: <Loans/>,
    permission: null,
    icon: <CurrencyDollarIcon width={24}/>
  },
  // {
  //   path: 'settings',
  //   label: 'Settings',
  //   element: <Settings/>,
  //   permission: null,
  //   icon: <Cog6ToothIcon width={24}/>
  // },
];

export default AppRoutes;