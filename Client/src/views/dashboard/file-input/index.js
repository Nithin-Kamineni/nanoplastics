import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    CircularProgress,
    LinearProgress,
    Box,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    IconButton
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'store';
import { predictHalfLife, resetPredictionData } from 'store/slices/fileinputpredictionSlice';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

// ==============================|| SAMPLE PAGE ||============================== //

const FileInputPage = () => {
    const dispatch = useDispatch();

    // Redux selector to access data from the store
    const predictionData = useSelector((state) => state.predictionfile);
    const predictionError = useSelector((state) => state.predictionfile.error);

    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');

    const [timer, setTimer] = useState(null);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (predictionError) {
            setAlertMessage(predictionError);
        }
    }, [predictionError]);

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    // New state to manage loading state
    const [loading, setLoading] = useState(false);

    // Add an effect to monitor changes in predictionData
    useEffect(() => {
        if (predictionData.length > 0) {
            console.log(predictionData);
            setTableData(predictionData);
        }
    }, [predictionData]);

    useEffect(() => {
        if (tableData.length > 0) {
            setLoading(false); // Data received, stop loading
        }
    }, [tableData]);

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileSelection = (file) => {
        if (file.size > MAX_FILE_SIZE) {
            setAlertMessage('File size exceeds the maximum limit of 5MB.');
            return;
        }
        setSelectedFile(file);
        setUploading(false);
        setUploadComplete(false);
        setLoading(false);
        console.log('Selected file:', file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleFileSelection(file);
        // setSelectedFile(file);
        // Handle the dropped file here
        // console.log('Dropped file:', file);
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        handleFileSelection(file);
        // if (file.size > MAX_FILE_SIZE) {
        //     alert('File size exceeds the maximum limit of 5MB.');
        //     return;
        // }
        // setSelectedFile(file);
        // console.log('Selected file:', file);
    };

    const handleUpload = () => {
        if (selectedFile) {
            setLoading(true);
            setUploading(true);

            const reader = new FileReader();
            reader.onload = (event) => {
                const csvText = event.target.result;
                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    complete: (results) => {
                        // Normalize fields to lowercase for flexible comparison
                        const normalizedFields = results.meta.fields.map((field) => field.toLowerCase());
                        // const hasRequiredColumns = normalizedFields.includes('cas') && normalizedFields.includes('species');
                        const hasRequiredColumns = results.meta.fields.includes('CAS') && results.meta.fields.includes('Species');
                        if (!hasRequiredColumns) {
                            setAlertMessage('Invalid file format. Please ensure the file contains "CAS" and "Species" as column names.');
                            setUploading(false);
                            setUploadComplete(false);
                            setLoading(false);
                            return;
                        }

                        // Start the countdown after file parsing
                        const estimatedSeconds = results.data.length * 1; // Example: 1 second per row
                        setCountdown(estimatedSeconds);
                        setTimer(
                            setInterval(() => {
                                setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
                            }, 1000)
                        );

                        dispatch(predictHalfLife(results.data));
                        setUploading(false); // Set uploading to false after parsing is done
                        setUploadComplete(true);
                    },
                    error: () => {
                        setAlertMessage('Error parsing the file. Please check the file format.');
                        setLoading(false);
                        setUploading(false); // Set uploading to false in case of error
                        setUploadComplete(false);
                    }
                });
            };

            reader.onerror = () => {
                setAlertMessage('Error reading the file.');
                setLoading(false);
                setUploading(false); // Set uploading to false in case of FileReader error
                setUploadComplete(false);
            };

            reader.readAsText(selectedFile);
        }
    };

    useEffect(() => {
        // Stop and reset the timer when the table is loaded or an error occurs
        if ((!uploading && uploadComplete) || predictionError) {
            clearInterval(timer);
            setCountdown(0);
        }
    }, [uploading, uploadComplete, predictionError, timer]);

    const handleReset = () => {
        // Resetting all relevant states
        setSelectedFile(null);
        setUploading(false);
        setUploadComplete(false);
        setLoading(false);
        setParsedData(null);
        setTableData([]);
        setAlertMessage('');
        setCountdown(0);

        // Clearing any running timers
        if (timer) {
            clearInterval(timer);
            setTimer(null);
        }

        // Reset the redux store prediction data (if necessary)
        dispatch(resetPredictionData());
    };

    return (
        <MainCard title="Model Prediction">
            <Collapse in={!!alertMessage}>
                <Alert
                    severity="error"
                    sx={{ mb: 2, mt: 2 }}
                    action={
                        <IconButton aria-label="close" color="inherit" size="small" onClick={() => setAlertMessage('')}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {alertMessage}
                </Alert>
            </Collapse>
            <div
                style={{
                    border: isDragging ? '2px dashed #007bff' : '2px dashed #ccc',
                    padding: '40px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    minHeight: '200px'
                }}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <Typography variant="h4" sx={{ mb: 2 }}>
                    <strong>File Input</strong>
                </Typography>
                <Typography variant="body2">Drag and drop files here or click to upload</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Please upload a CSV file containing columns: &apos;<strong>CAS</strong>&apos; and &apos;<strong>Species</strong>&apos;.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Maximum Limit on Number of rows: <strong>35</strong>
                </Typography>

                {/* Choose Files button */}
                <Box marginTop="16px">
                    <Button variant="contained" component="label">
                        Choose Files
                        <input
                            type="file"
                            accept=".csv" // Specify the .csv file extension
                            style={{ display: 'none' }}
                            onChange={handleFileInputChange}
                        />
                    </Button>
                </Box>

                {selectedFile && !uploading && !uploadComplete && (
                    <Box marginTop="16px">
                        <Typography variant="subtitle1">Selected File: {selectedFile.name}</Typography>
                        <Button variant="contained" color="primary" onClick={handleUpload}>
                            Upload
                        </Button>
                    </Box>
                )}

                {/* Reset Button - Visible once a file is selected */}
                {selectedFile && (
                    <Box mt={2}>
                        <Button variant="outlined" color="secondary" onClick={handleReset}>
                            Reset
                        </Button>
                    </Box>
                )}

                {uploading && (
                    <Box marginTop="16px">
                        <CircularProgress size={24} color="primary" />
                        <Typography variant="subtitle1" sx={{ marginLeft: 2 }}>
                            Uploading...
                        </Typography>
                    </Box>
                )}

                {uploadComplete && !loading && parsedData && (
                    <Box marginTop="16px">
                        <CheckCircleOutlineIcon sx={{ color: 'green', marginRight: 1 }} />
                        <Typography variant="subtitle1">Upload Complete</Typography>
                    </Box>
                )}

                {/* Display the countdown timer */}
                {countdown > 0 && (
                    <Box mt={2}>
                        <Typography variant="body2"> Estimated processing time: {countdown} seconds </Typography>
                    </Box>
                )}

                {loading && (
                    <Box marginTop="16px">
                        <CircularProgress size={24} color="primary" />
                        <Typography variant="subtitle1" sx={{ marginLeft: 2 }}>
                            Loading...
                        </Typography>
                    </Box>
                )}

                {!loading && tableData.length > 0 && (
                    <Box marginTop="16px">
                        <Typography variant="h6">Predicted Data:</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>CAS</TableCell>
                                        <TableCell>Species</TableCell>
                                        <TableCell>Half-Life Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.map((subArray, index) =>
                                        subArray.map((data, subIndex) => (
                                            <TableRow key={subIndex}>
                                                <TableCell>{data.CAS}</TableCell>
                                                <TableCell>{data.Species}</TableCell>
                                                <TableCell>{data.LambdaZHl}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* {parsedData && (
                    <Box marginTop="16px">
                        <Typography variant="h6">Parsed Data:</Typography>
                        <pre>{JSON.stringify(parsedData, null, 2)}</pre>
                    </Box>
                )} */}
            </div>
        </MainCard>
    );
};

export default FileInputPage;
