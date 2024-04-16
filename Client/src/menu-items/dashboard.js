// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics, IconFolder, IconTimeline, IconDatabase } from '@tabler/icons';

const icons = {
    IconDashboard,
    IconDeviceAnalytics,
    IconFolder,
    IconTimeline,
    IconDatabase
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'dashboard',
    title: <FormattedMessage id="dashboard" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'singleinput',
            title: <FormattedMessage id="singleinput" />,
            type: 'item',
            url: '/dashboard/single-input',
            icon: icons.IconTimeline,
            breadcrumbs: false
        },
        // {
        //     id: 'fileinput',
        //     title: <FormattedMessage id="fileinput" />,
        //     type: 'item',
        //     url: '/dashboard/file-input',
        //     icon: icons.IconFolder,
        //     breadcrumbs: false
        // },
        // {
        //     id: 'originaldata',
        //     title: <FormattedMessage id="originaldata" />,
        //     type: 'item',
        //     url: '/dashboard/original-data',
        //     icon: icons.IconDatabase,
        //     breadcrumbs: false
        // }
    ]
};

export default dashboard;
