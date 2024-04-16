import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// dashboard routing
const DashboardSamplePage = Loadable(lazy(() => import('views/dashboard/original-data')));
const DashboardFileInputPage = Loadable(lazy(() => import('views/dashboard/file-input')));
const DashboardSingleInputPage = Loadable(lazy(() => import('views/dashboard/single-input')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        // <AuthGuard>
        <MainLayout />
        // </AuthGuard>
    ),
    children: [
        {
            path: '/dashboard/original-data',
            element: <DashboardSamplePage />
        },
        {
            path: '/dashboard/single-input',
            element: <DashboardSingleInputPage />
        },
        {
            path: '/dashboard/file-input',
            element: <DashboardFileInputPage />
        }
    ]
};

export default MainRoutes;
