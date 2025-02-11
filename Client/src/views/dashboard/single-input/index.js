import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import GraphComponent2 from 'ui-component/GraphComponent2';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import { ChakraProvider, NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select } from '@chakra-ui/react';
import { Typography, Button, Box, FormControl, InputLabel, MenuItem, Slider } from '@mui/material';
import { ParametersContext } from '../../../contexts/ParametersContext';

const treatmentData = [
    { id: 'single', name: 'Single' },
    { id: 'multiple', name: 'Repeated' }
];

function scatterPlot(data) {
    let cords = [];
    if (data !== undefined) {
        const keys = Object.keys(data);
        for (let i = 0; i < data[keys[0]].length; i++) {
            cords.push({ x: data[keys[0]][i], y: data[keys[1]][i] });
        }
    }
    return cords;
}

const marks = [
    {
        value: 0.015,
        label: '0.015'
    },
    {
        value: 0.035,
        label: '0.035'
    }
];

function valuetext(value) {
    return `${value}°C`;
}

const sizes = [0.02, 0.22, 1, 6];

// const url = "http://nano-tumor.phhp.ufl.edu/api/model";

const SamplePage = () => {
    // const useConfig = () => useContext(ConfigContext);
    const useParams = () => React.useContext(ParametersContext);

    let { concentration, setConcentration, BW, setBW, treatment, setTreatment, duration, setDuration, size, setSize, url } = useParams();

    // const [concentration, setConcentration] = useState(0.1);
    // const [BW, setBW] = useState(0.02);
    // const [treatment, setTreatment] = useState('single');
    // const [duration, setDuration] = useState(4);
    // const [size, setSize] = useState(0.22);

    const [graphData, setGraphData] = useState(null);
    const [predict, setPredict] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isNano, setIsNano] = useState(false);

    const defaultValues = () => {
        setConcentration(5);
        setBW(0.02);
        setTreatment('single');
        setDuration(4);
        setSize(0.22);
    };

    const handelConcentration = (event, newValue) => {
        setConcentration(newValue);
    };
    const handelBW = (event, newValue) => {
        if (newValue <= 0.035 && newValue >= 0.015) setBW(newValue);
    };
    const handelDuration = (event, newValue) => {
        setDuration(newValue);
    };
    const handleTreatment = (event) => {
        setTreatment(event.target.value);
    };
    const handelSize = (event) => {
        setSize(event.target.value);
    };

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                // const requestBody = {"BW":0.02, "scale": 220, "concentration":0.1, "treatment":"single","duration":4};
                const requestBody = { BW, concentration, treatment, duration };

                console.log('requestBody', requestBody);
                setLoading(true); // Start loading

                // setting size
                let sizeTemp = size;
                setIsNano(false);
                if (size === 0.02) {
                    sizeTemp = 20;
                    setIsNano(true);
                } else if (size === 0.22) {
                    sizeTemp = 220;
                    setIsNano(true);
                }
                sizeTemp = `${sizeTemp}`;

                const response = await axios.post(`${url}${sizeTemp}`, requestBody);

                let KS = scatterPlot(response.data.data.df_simKS);
                let KK = scatterPlot(response.data.data.df_simKK);
                let KL = scatterPlot(response.data.data.df_simKL);
                let KLu = scatterPlot(response.data.data.df_simKLu);

                let obsKS = scatterPlot(response.data.data.Obs_KS);
                let obsKK = scatterPlot(response.data.data.Obs_KK);
                let obsKL = scatterPlot(response.data.data.Obs_KL);
                let obsKLu = scatterPlot(response.data.data.Obs_KLu);

                if (response.data !== null) {
                    setGraphData({ ks: KS, kk: KK, kl: KL, klu: KLu, obsks: obsKS, obskk: obsKK, obskl: obsKL, obsklu: obsKLu });
                    // console.log("data.data",graphData);
                    setLoading(false); // End loading
                }
            } catch (error) {
                console.error('Failed to fetch graph data:', error);
                setLoading(false); // Ensure loading is false if there's an error
            }
        };
        // http request http://127.0.0.1:9000/model220
        fetchGraphData();
    }, [predict]);

    return (
        <ChakraProvider>
            <MainCard title="Model Prediction">
                <Box display="flex" flexDirection="column" alignItems="flex-start" marginBottom="16px">
                    {loading ? (
                        <>
                            <Box sx={{ width: '80%' }} margin="150px">
                                <LinearProgress />
                            </Box>
                        </>
                    ) : (
                        <>
                            {/* First row of graphs */}
                            <Box display="flex" justifyContent="space-around" width="100%" marginBottom="30px">
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography variant="h4" gutterBottom>
                                        Liver
                                    </Typography>
                                    <GraphComponent2
                                        isNano={isNano}
                                        LinePoints={graphData.kl}
                                        ScatterPoints={graphData.obskl}
                                        YaxisLabel="Y axis test"
                                    />
                                    {/* <GraphComponent Time={graphData.df_simKL.Time} LinePoints={graphData.df_simKL.CLiver} ScatterPoints={graphData.obskl} YaxisLabel='Y axis test'/> */}
                                </Box>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography variant="h4" gutterBottom>
                                        Lung
                                    </Typography>
                                    <GraphComponent2
                                        isNano={isNano}
                                        LinePoints={graphData.klu}
                                        ScatterPoints={graphData.obsklu}
                                        YaxisLabel="Y axis test"
                                    />
                                    {/* <GraphComponent Time={graphData.df_simKLu.Time} LinePoints={graphData.df_simKLu.CLung} ScatterPoints={graphData.obsklu}  YaxisLabel='Y axis test'/> */}
                                </Box>
                            </Box>
                            {/* Second row of graphs */}
                            <Box display="flex" justifyContent="space-around" width="100%" marginBottom="30px">
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography variant="h4" gutterBottom>
                                        Spleen
                                    </Typography>
                                    <GraphComponent2
                                        isNano={isNano}
                                        LinePoints={graphData.ks}
                                        ScatterPoints={graphData.obsks}
                                        YaxisLabel="Y axis test"
                                    />
                                    {/* <GraphComponent Time={graphData.df_simKS.Time} LinePoints={graphData.df_simKS.CSpleen} ScatterPoints={graphData.obsks} YaxisLabel='Y axis test'/> */}
                                </Box>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography variant="h4" gutterBottom>
                                        Kidney
                                    </Typography>
                                    <GraphComponent2
                                        isNano={isNano}
                                        LinePoints={graphData.kk}
                                        ScatterPoints={graphData.obskk}
                                        YaxisLabel="Y axis test"
                                    />
                                    {/* <GraphComponent Time={graphData.df_simKK.Time} LinePoints={graphData.df_simKK.CKidney} ScatterPoints={graphData.obskk} YaxisLabel='Y axis test'/> */}
                                </Box>
                            </Box>
                        </>
                    )}

                    <Box display="flex" justifyContent="center" width="100%">
                        {/* <Button variant="contained" color="secondary" onClick={setGraphData} style={{ alignSelf: 'flex-start', marginRight:10 }}>
                        Apply
                    </Button> */}
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={defaultValues}
                            style={{ alignSelf: 'flex-start', marginLeft: 10 }}
                        >
                            Reset
                        </Button>
                    </Box>

                    <Typography variant="h3" style={{ marginTop: '16px' }}>
                        <strong>Parameters for exposure scenario:</strong>
                    </Typography>

                    <Box id="align column wise" display="flex" flexDirection="row" justifyContent="space-around" width="100%">
                        <Box id="align row wise" display="flex" flexDirection="column" alignItems="flex-start" marginBottom="16px">
                            <FormControl variant="outlined" style={{ minWidth: 400, marginTop: '16px' }}>
                                <Typography variant="h4">
                                    <strong>Species:</strong>
                                </Typography>
                                <FormControl variant="outlined" style={{ minWidth: 200, marginTop: '16px' }}>
                                    <Select value="mice">
                                        <option value="mice">Mouse</option>
                                    </Select>
                                </FormControl>
                            </FormControl>
                            <FormControl variant="outlined" style={{ minWidth: 400, marginTop: '16px' }}>
                                <Typography variant="h4">
                                    <strong>Body weight (kg)</strong>
                                </Typography>
                                <FormControl variant="outlined" style={{ minWidth: 200, marginTop: '16px' }}>
                                    <Box sx={{ width: 300 }}>
                                        <NumberInput value={BW} precision={4} min={0.015} max={0.035} step={0.001} onChange={handelBW}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        <Slider
                                            sx={{ marginTop: '25px' }}
                                            aria-label="Custom marks"
                                            value={BW}
                                            getAriaValueText={valuetext}
                                            step={0.001}
                                            valueLabelDisplay="auto"
                                            onChange={handelBW}
                                            marks={marks}
                                            min={0.015}
                                            max={0.035}
                                        />
                                    </Box>
                                </FormControl>
                            </FormControl>
                        </Box>
                        <Box id="align row wise" display="flex" flexDirection="column" alignItems="flex-start" marginBottom="16px">
                            <FormControl variant="outlined" style={{ minWidth: 400, marginTop: '16px' }}>
                                <Typography variant="h4">
                                    <strong>Polymer type</strong>
                                </Typography>
                                <FormControl variant="outlined" style={{ minWidth: 200, marginTop: '16px' }}>
                                    <Select value="option1">
                                        <option value="option1">Polystyrene</option>
                                    </Select>
                                </FormControl>
                            </FormControl>
                            <FormControl variant="outlined" style={{ minWidth: 400, marginTop: '16px' }}>
                                <Typography variant="h4">
                                    <strong>Size scale (µm)</strong>
                                </Typography>
                                <FormControl variant="outlined" style={{ minWidth: 200, marginTop: '16px' }}>
                                    <Select value={size} onChange={handelSize}>
                                        {sizes.map((size) => (
                                            <option value={size}>{size}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </FormControl>
                        </Box>
                        <Box id="align row wise" display="flex" flexDirection="column" alignItems="flex-start" marginBottom="16px">
                            <FormControl variant="outlined" style={{ minWidth: 400, marginTop: '16px' }}>
                                <Typography variant="h4">
                                    <strong>Exposure concentration (mg/kg)</strong>
                                </Typography>
                                <FormControl variant="outlined" style={{ minWidth: 200, marginTop: '16px' }}>
                                    {/* <InputLabel id="select-species-label">Select Exposure</InputLabel> */}
                                    <NumberInput
                                        value={concentration}
                                        precision={4}
                                        min={0.25}
                                        max={250}
                                        step={0.01}
                                        onChange={handelConcentration}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <Slider
                                        sx={{ marginTop: '10px' }}
                                        aria-label="Custom marks"
                                        value={concentration}
                                        getAriaValueText={valuetext}
                                        step={0.001}
                                        valueLabelDisplay="auto"
                                        onChange={handelConcentration}
                                        marks={[
                                            {
                                                value: 0.25,
                                                label: '0.25'
                                            },
                                            {
                                                value: 255,
                                                label: '250'
                                            }
                                        ]}
                                        min={0.25}
                                        max={255}
                                    />
                                </FormControl>
                            </FormControl>
                            <FormControl variant="outlined" style={{ minWidth: 400, marginTop: '16px' }}>
                                <Typography variant="h4">
                                    <strong>Exposure Regimens</strong>
                                </Typography>
                                <FormControl variant="outlined" style={{ minWidth: 200, marginTop: '16px' }}>
                                    <Select value={treatment} onChange={handleTreatment}>
                                        {treatmentData.map((treatment) => (
                                            <option value={treatment.id}>{treatment.name}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </FormControl>
                            <FormControl variant="outlined" style={{ minWidth: 400, marginTop: '16px' }}>
                                <Typography variant="h4">
                                    <strong>Exposure duration (day)</strong>
                                </Typography>
                                <FormControl variant="outlined" style={{ minWidth: 200, marginTop: '16px' }}>
                                    <InputLabel id="select-species-label">Select Duration</InputLabel>
                                    <Slider
                                        aria-label="Custom marks"
                                        value={duration}
                                        getAriaValueText={valuetext}
                                        step={4}
                                        valueLabelDisplay="auto"
                                        onChange={handelDuration}
                                        marks={[
                                            {
                                                value: 0,
                                                label: '0'
                                            },
                                            {
                                                value: 120,
                                                label: '120'
                                            }
                                        ]}
                                        min={0}
                                        max={120}
                                    />
                                </FormControl>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>

                <Box display="flex" justifyContent="center" marginTop={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setPredict(!predict);
                        }}
                    >
                        Run Simulation
                    </Button>
                </Box>
            </MainCard>
        </ChakraProvider>
    );
};

export default SamplePage;
