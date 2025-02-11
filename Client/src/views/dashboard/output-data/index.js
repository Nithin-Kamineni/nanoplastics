import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    CardContent,
    Checkbox,
    Fab,
    Grid,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { LineChart } from '@mui/x-charts/LineChart';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import { getProducts } from 'store/slices/customer';
import { fetchAndProcessData } from './drugData';
import { CSVExport } from './TableExports';
import axios from 'axios';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import PrintIcon from '@mui/icons-material/PrintTwoTone';
import FileCopyIcon from '@mui/icons-material/FileCopyTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/AddTwoTone';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { ParametersContext } from '../../../contexts/ParametersContext';

// table sort
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const getComparator = (order, orderBy) =>
    order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// table header options
const headCells = [
    {
        id: 'id',
        numeric: true,
        label: 'Id',
        align: 'center'
    },
    {
        id: 'citationnumber',
        numeric: true,
        label: 'Time',
        align: 'center'
    },
    {
        id: 'spleen',
        numeric: false,
        label: 'Spleen',
        align: 'center'
    },
    {
        id: 'Kidney',
        numeric: false,
        label: 'Kidney',
        align: 'center'
    },
    {
        id: 'liver',
        numeric: false,
        label: 'Liver',
        align: 'center'
    },
    {
        id: 'lung',
        numeric: false,
        label: 'Lung',
        align: 'center'
    },
    {
        id: 'urine',
        numeric: false,
        label: 'Urine',
        align: 'center'
    },
    {
        id: 'blood',
        numeric: false,
        label: 'Blood',
        align: 'center'
    },
    {
        id: 'cgi',
        numeric: false,
        label: 'GI',
        align: 'center'
    }
];

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, theme, selected }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {numSelected <= 0 &&
                    headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell?.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    theme: PropTypes.object,
    selected: PropTypes.array,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

// Dummy data array
const Data = [
    {
        id: 1,
        Time: 233,
        df_simKS: '12345'
    },
    {
        id: 2,
        df_simKS: '12346',
        Time: 0.0007
    }
    // ... (add as many objects as you need for dummy data)
];

function isNearlyInteger(num) {
    return Math.abs(num - Math.round(num)) < 1e-10;
}

const formatDatafunc = (props) => {
    let data = [];
    console.log('data', data);
    let j = 1;
    for (let i = 0; i < props.spleen.Time.length; i++) {
        if (isNearlyInteger(props.spleen.Time[i] / 0.05)) {
            data.push({
                id: j,
                Time: props.spleen.Time[i],
                df_simKS: props.spleen.CSpleen[i],
                df_simKK: props.kidney.CKidney[i],
                df_simKL: props.liver.CLiver[i],
                df_simKLu: props.lung.CLung[i],
                df_simKU: props.urine.AUrine[i],
                df_simKB: props.blood.CBlood[i],
                df_simKGI: props.cgi.CGI[i]
            });
            j += 1;
        }
    }
    console.log('data', data);
    return data;
};

// ==============================|| PRODUCT LIST ||============================== //

const ProductList = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(true);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const [search, setSearch] = React.useState('');
    const [rows, setRows] = React.useState(Data);
    const [originalRows, setOriginalRows] = React.useState([]);
    const useParams = () => React.useContext(ParametersContext);
    let { concentration, setConcentration, BW, setBW, treatment, setTreatment, duration, setDuration, size, setSize, url } = useParams();

    React.useEffect(() => {
        const loadData = async () => {
            try {
                // const requestBody = {"BW":0.02, "scale": 220, "concentration":0.1, "treatment":"single","duration":4};
                // const requestBody = { BW: 0.02, scale: 220, concentration: 0.1, treatment: 'single', duration: 4 };
                const requestBody = { BW, concentration, treatment, duration };

                console.log('requestBody', requestBody);
                setLoading(true); // Start loading

                // setting size
                let sizeTemp = size;
                if (size === 0.02 || size === '0.02') {
                    sizeTemp = 20;
                } else if (size === 0.22 || size === '0.22') {
                    sizeTemp = 220;
                }
                sizeTemp = `${sizeTemp}`;
                console.log('sizeTemp', sizeTemp);

                const response = await axios.post(`${url}${sizeTemp}`, requestBody);

                // let KS = scatterPlot(response.data.data.df_simKS);
                // let KK = scatterPlot(response.data.data.df_simKK);
                // let KL = scatterPlot(response.data.data.df_simKL);
                // let KLu = scatterPlot(response.data.data.df_simKLu);

                // let obsKS = scatterPlot(response.data.data.Obs_KS);
                // let obsKK = scatterPlot(response.data.data.Obs_KK);
                // let obsKL = scatterPlot(response.data.data.Obs_KL);
                // let obsKLu = scatterPlot(response.data.data.Obs_KLu);

                if (response.data !== null) {
                    console.log('response.data.data.df_simKS1', response.data.data.df_simKS);
                    console.log('response.data.data.df_simKK1', response.data.data.df_simKK);
                    console.log('response.data.data.df_simKL1', response.data.data.df_simKL);
                    console.log('response.data.data.df_simKLu1', response.data.data.df_simKLu);

                    let data = formatDatafunc({
                        spleen: response.data.data.df_simKS,
                        kidney: response.data.data.df_simKK,
                        liver: response.data.data.df_simKL,
                        lung: response.data.data.df_simKLu,
                        urine: response.data.data.df_simKU,
                        blood: response.data.data.df_simKB,
                        cgi: response.data.data.df_simKGI
                    });

                    console.log('data', data);

                    setOriginalRows(data);

                    setRows(data); // Update the rows state with the fetched data
                    setLoading(false); // End loading
                }
            } catch (error) {
                console.error('Failed to fetch graph data:', error);
                setLoading(false); // Ensure loading is false if there's an error
            }
            // const data = await fetchAndProcessData();
            // setOriginalRows(data);
            // setRows(data); // Update the rows state with the fetched data
            console.log('rows', rows);
        };

        loadData();
    }, []);

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                let matches = true;

                const properties = ['CitationNumbera', 'Drug', 'Analyte', 'CAS', 'Species', 'LambdaZHl'];
                let containsQuery = false;

                properties.forEach((property) => {
                    if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });

                if (!containsQuery) {
                    matches = false;
                }
                return matches;
            });
            setRows(newRows);
        } else {
            setRows(originalRows);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            if (selected.length > 0) {
                setSelected([]);
            } else {
                const newSelectedId = rows.map((n) => n.name);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <MainCard title="Output Data" content={false}>
            {loading ? <></> : <></>}

            {/* table */}
            {loading ? (
                <>loading...</>
            ) : (
                <>
                    <CardContent>
                        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                    onChange={handleSearch}
                                    placeholder="Search Data"
                                    value={search}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                                <CSVExport data={rows} filename="OutputDataFile.csv" header={headCells} />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <TableContainer>
                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                                theme={theme}
                                selected={selected}
                            />
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        /** Make sure no display bugs if row isn't an OrderData object */
                                        if (typeof row === 'number') return null;
                                        const isItemSelected = isSelected(row.name);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={index}
                                                selected={isItemSelected}
                                            >
                                                {/* <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={(event) => handleClick(event, row.name)}>
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId
                                                }}
                                            />
                                        </TableCell> */}
                                                <TableCell
                                                    align="center"
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    // onClick={(event) => handleClick(event, row.name)}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}
                                                    >
                                                        {' '}
                                                        #{row.id}{' '}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    // onClick={(event) => handleClick(event, row.name)}
                                                    sx={{ cursor: 'pointer' }}
                                                    align="center"
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}
                                                    >
                                                        {' '}
                                                        {row.Time}{' '}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">{row.df_simKS}</TableCell>
                                                <TableCell align="center">{row.df_simKK}</TableCell>
                                                <TableCell align="center">{row.df_simKL}</TableCell>
                                                <TableCell align="center">{row.df_simKLu}</TableCell>
                                                <TableCell align="center">{row.df_simKU}</TableCell>
                                                <TableCell align="center">{row.df_simKB}</TableCell>
                                                <TableCell align="center">{row.df_simKGI}</TableCell>
                                                {/* <TableCell align="center" sx={{ pr: 3 }}>
                                            <IconButton size="large" aria-label="more options">
                                                <MoreHorizOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                                            </IconButton>
                                        </TableCell> */}
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: 53 * emptyRows
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* table pagination */}
                    <TablePagination
                        rowsPerPageOptions={[100, 250, { label: 'All', value: rows.length }]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}
        </MainCard>
    );
};

export default ProductList;
