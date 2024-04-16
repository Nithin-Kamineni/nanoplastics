// predictionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios';

const initialState = {
    CAS: '',
    Species: '',
    LambdaZHl: null
};

const predictionSlice = createSlice({
    name: 'prediction',
    initialState,
    reducers: {
        setCasNumber: (state, action) => {
            state.casNumber = action.payload;
        },

        setSelectedSpecies: (state, action) => {
            state.Species = action.payload;
        },

        setPredictedValue: (state, action) => {
            state.LambdaZHl = action.payload;
        },

        resetPredictionData: (state) => {
            state.CAS = initialState.CAS;
            state.Species = initialState.Species;
            state.LambdaZHl = initialState.LambdaZHl;
        }
    }
});

export const { setCasNumber, setSelectedSpecies, setPredictedValue, resetPredictionData } = predictionSlice.actions;

export const selectCasNumber = (state) => state.prediction.CAS;
export const selectSelectedSpecies = (state) => state.prediction.Species;

export default predictionSlice.reducer;

//---------------------------------------------------

// Define an asynchronous thunk action for making the API call
export const predictHalfLife = createAsyncThunk('predictHalfLife', async (formData, { dispatch, rejectWithValue }) => {
    try {
        console.log(formData);
        // Make the API call here using formData
        const response = await axios.post(`${process.env.REACT_APP_API_URL}single-input`, formData);
        console.log(response.data);
        dispatch(setPredictedValue(response.data));
        return response.data;
    } catch (error) {
        // Handle API call errors here
        return rejectWithValue(error.message);
    }
});
