import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// dashboard routing
const DashboardSamplePage = Loadable(lazy(() => import('views/dashboard/original-data')));
const DashboardOutputPage = Loadable(lazy(() => import('views/dashboard/output-data')));
const DashboardFileInputPage = Loadable(lazy(() => import('views/dashboard/file-input')));
const DashboardContactPage = Loadable(lazy(() => import('views/dashboard/contact')));
const DashboardCodePage = Loadable(lazy(() => import('views/dashboard/code')));
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
            path: '/dashboard/model',
            element: <DashboardSamplePage />
        },
        {
            path: '/dashboard/model-parameters',
            element: <DashboardSamplePage />
        },
        {
            path: '/dashboard/output-table',
            element: <DashboardOutputPage />
        },
        {
            path: '/dashboard/code',
            element: <DashboardCodePage />
        },
        {
            path: '/dashboard/simulation',
            element: <DashboardSingleInputPage />
        },
        {
            path: '/dashboard/contact',
            element: <DashboardContactPage />
        }
    ]
};

export default MainRoutes;
