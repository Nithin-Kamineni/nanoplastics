// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
    IconDashboard,
    IconDeviceAnalytics,
    IconFolder,
    IconTimeline,
    IconDatabase,
    IconAddressBook,
    IconCode,
    IconReportSearch,
    IconSchema,
    IconStackPush,
    IconQuestionCircle
} from '@tabler/icons';

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
            url: '/dashboard/simulation',
            icon: icons.IconTimeline,
            breadcrumbs: false
        },
        // {
        //     id: 'modelparameters',
        //     title: <FormattedMessage id="modelparameters" />,
        //     type: 'item',
        //     url: '/dashboard/model-parameters',
        //     icon: IconStackPush,
        //     breadcrumbs: false
        // },
        {
            id: 'outputtable',
            title: <FormattedMessage id="outputtable" />,
            type: 'item',
            url: '/dashboard/output-table',
            icon: IconReportSearch,
            breadcrumbs: false
        },
        // {
        //     id: 'modelstructure',
        //     title: <FormattedMessage id="modelstructure" />,
        //     type: 'item',
        //     url: '/dashboard/model',
        //     icon: IconSchema,
        //     breadcrumbs: false
        // },
        {
            id: 'code',
            title: <FormattedMessage id="code" />,
            type: 'item',
            url: '/dashboard/code',
            icon: IconCode,
            breadcrumbs: false
        },
        {
            id: 'contact',
            title: <FormattedMessage id="contact" />,
            type: 'item',
            url: '/dashboard/contact',
            icon: IconAddressBook,
            breadcrumbs: false
        },
        {
            id: 'Tutorial',
            title: <FormattedMessage id="Tutorial" />,
            type: 'item',
            url: 'https://drive.google.com/file/d/1y7NIatIh7YsZWxMJtbcfRBFUwZcJh9fO/view?usp=sharing',
            icon: IconQuestionCircle,
            breadcrumbs: false
        }
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
