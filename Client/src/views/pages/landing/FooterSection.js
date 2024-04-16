// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Container, IconButton, Link, Stack, Typography } from '@mui/material';

import PublicIcon from '@mui/icons-material/Public';
import TwitterIcon from '@mui/icons-material/Twitter';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';

// =============================|| LANDING - FOOTER SECTION ||============================= //

const FooterSection = () => {
    const theme = useTheme();
    const textColor = theme.palette.mode === 'dark' ? 'text.secondary' : 'text.hint';

    return (
        <>
            <Box sx={{ bgcolor: 'dark.dark', py: { xs: 3, sm: 1.5 } }}>
                <Container>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={{ xs: 1.5, sm: 1, md: 3 }}
                    >
                        <Typography color="text.secondary">
                            © This site is managed by{' '}
                            <Link href="https://linlab.phhp.ufl.edu/team/" target="_blank" underline="hover">
                                Dr. Zhoumeng Lin Lab Team
                            </Link>
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={{ xs: 3, sm: 1.5, md: 2 }}>
                            <IconButton
                                size="small"
                                aria-label="lin laboratory"
                                component={Link}
                                href="https://linlab.phhp.ufl.edu/"
                                target="_blank"
                            >
                                <PublicIcon sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }} />
                            </IconButton>
                            <IconButton
                                size="small"
                                aria-label="Twitter"
                                component={Link}
                                href="fsghjsfgjkfgshkkfhgksfkkgfgdjgfjgfdjkgfdgj"
                                target="_blank"
                            >
                                <TwitterIcon sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }} />
                            </IconButton>
                            <IconButton
                                size="small"
                                aria-label="jnfstjfstdj"
                                component={Link}
                                href="rthdrstjutrskjgfskgsfksfkskgdsjjgjsjjsdgjjgj"
                                target="_blank"
                            >
                                <SportsBasketballIcon sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' } }} />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default FooterSection;
