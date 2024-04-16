// material-ui
import { useTheme, styled } from '@mui/material/styles';

// project imports
import Customization from 'layout/Customization';
import AppBar from 'ui-component/extended/AppBar';
import FeatureSection from './FeatureSection';
import FooterSection from './FooterSection';
import CustomizeSection from './CustomizeSection';
import StartupProjectSection from './StartupProjectSection';
import RtlInfoSection from './RtlInfoSection';

// custom stlye
const HeaderWrapper = styled('div')(({ theme }) => ({
    overflowX: 'hidden',
    overflowY: 'clip',
    background:
        theme.palette.mode === 'dark'
            ? theme.palette.background.default
            : `linear-gradient(360deg, ${theme.palette.grey[100]} 1.09%, ${theme.palette.background.paper} 100%)`,
    [theme.breakpoints.down('md')]: {}
}));

const SectionWrapper = styled('div')({
    paddingTop: 100,
    paddingBottom: 100
});

// =============================|| LANDING MAIN ||============================= //

const Landing = () => {
    const theme = useTheme();

    return (
        <>
            {/* 1. header and hero section */}
            <HeaderWrapper id="home">
                
                <AppBar />
                {/* <HeaderSection /> */}
            </HeaderWrapper>

            {/* 4. Developer Experience section */}
            <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.100' }}>
                <CustomizeSection />
            </SectionWrapper>

            {/* 3. about section */}
            {/* <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>
                <FeatureSection />
            </SectionWrapper> */}

            {/* 6. startup section */}
            {/* <SectionWrapper sx={{ py: 0 }}>
                <StartupProjectSection />
            </SectionWrapper> */}

            {/* multi-language section */}
            {/* <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>
                <RtlInfoSection />
            </SectionWrapper> */}

            {/* footer section */}
            <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'dark.900', pb: 0, py: 0 }}>
                <FooterSection />
            </SectionWrapper>
            <Customization />
        </>
    );
};

export default Landing;
