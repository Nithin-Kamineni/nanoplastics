// predictionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios';

// const initialState = {
//     CAS: '',
//     Species: '',
//     LambdaZHl: null
// };

const initialState = [];

const predictionfileSlice = createSlice({
    name: 'predictionfile',
    initialState,
    reducers: {
        addPredictionData: (state, action) => {
            state.push(action.payload);
        },

        resetPredictionData: (state) => {
            state.length = 0; // Clearing the array
        }
    }
});

export const { addPredictionData, resetPredictionData } = predictionfileSlice.actions;

export default predictionfileSlice.reducer;

//---------------------------------------------------

// Define an asynchronous thunk action for making the API call
export const predictHalfLife = createAsyncThunk('predictHalfLife', async (formData, { dispatch, rejectWithValue }) => {
    try {
        console.log(formData);
        // Make the API call here using formData
        const response = await axios.post(`${process.env.REACT_APP_API_URL}file-input`, formData);
        console.log(response.data);
        // dispatch(setPredictedValue(response.data[0].LambdaZHl));
        dispatch(addPredictionData(response.data));
        // return response.data[0].LambdaZHl;
        return response.data;
    } catch (error) {
        // Handle API call errors here
        // Check if the error response has a data property with a message
        const errorMessage = error.response && error.response.data && error.response.data.error ? error.response.data.error : error.message;
        return rejectWithValue(errorMessage);
    }
});
