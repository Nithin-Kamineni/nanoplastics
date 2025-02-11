/* eslint-disable padded-blocks */
import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import './styles.css';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import IconButton from '@mui/material/IconButton';

// ==============================|| SAMPLE PAGE ||============================== //

const FileInputPage = () => {
    const centeredImageStyle = {
        display: 'block',
        margin: '0 auto'
    };
    return (
        <MainCard title="Model Prediction">
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '50vh',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h3" component="h1" gutterBottom>
                        Zhoumeng Lin, BMed, PhD, DABT
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        linzhoumeng@ufl.edu
                    </Typography>
                    <Typography variant="body2" sx={{ my: 2 }}>
                        Microplastics and nanoplastics exhibit various physiological characteristics. Explore the features in the
                        established physiologically based toxicokinetic (PBTK) model. The user-friendly environment gives you the
                        flexibility to build it all with sufficient exposure information. This interface aims to offer a reliable, powerful,
                        and easy-to-understand simulation tool for predicting the time-varying profiles for MPs/NPs in reticuloendothelial
                        (RES) organs of mice following oral administration.
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                        The project is supported by the the grant xxx
                        {/* National Institute of Biomedical Imaging and Bioengineering of National Institutes
                        of Health (Grant #: R03EB026045). */}
                    </Typography>
                    <Box sx={{ '& > :not(style)': { m: 1 } }}>
                        <IconButton aria-label="email" color="primary">
                            <EmailIcon />
                        </IconButton>
                        <IconButton aria-label="twitter" color="primary">
                            <TwitterIcon />
                        </IconButton>
                        <IconButton aria-label="google" color="primary">
                            <GoogleIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Container>
        </MainCard>
    );
};

export default FileInputPage;
