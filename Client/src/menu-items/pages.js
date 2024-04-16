// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconKey, IconReceipt2, IconBug, IconBellRinging, IconPhoneCall, IconQuestionMark, IconShieldLock, IconHome } from '@tabler/icons';

// constant
const icons = {
    IconKey,
    IconReceipt2,
    IconBug,
    IconBellRinging,
    IconPhoneCall,
    IconQuestionMark,
    IconShieldLock,
    IconHome
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: <FormattedMessage id="pages" />,
    icon: icons.IconKey,
    type: 'group',
    children: [
        {
            id: 'landing',
            title: <FormattedMessage id="landing" />,
            type: 'item',
            icon: icons.IconHome,
            url: '/',
            target: true
        }
    ]
};

export default pages;
