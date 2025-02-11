import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

// project import
import defaultConfig from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// initial state
const initialState = {
    test: 1
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ParametersContext = createContext(initialState);

function ParamProvider({ children }) {
    let a = 1;
    const b = () => {
        console.log('b function');
    };

    const [concentration, setConcentration] = useState(5);
    const [BW, setBW] = useState(0.02);
    const [treatment, setTreatment] = useState('single');
    const [duration, setDuration] = useState(4);
    const [size, setSize] = useState(0.22);
    // const url = 'http://localhost:9005/model'; // react backend api url
    // const url = 'http://nano-tumor.phhp.ufl.edu/api/model';
    const url = 'https://micro.nanoplastics.pbtk.phhp.ufl.edu/api/model';
    // const url = 'https://micro.nanoplastics.pbtk.phhp.ufl.edu/api/model';

    return (
        <ParametersContext.Provider
            value={{
                a,
                b,
                concentration,
                setConcentration,
                BW,
                setBW,
                treatment,
                setTreatment,
                duration,
                setDuration,
                size,
                setSize,
                url
            }}
        >
            {children}
        </ParametersContext.Provider>
    );
}

export { ParamProvider, ParametersContext };
