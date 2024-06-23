import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../contexts/DataContext';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
    Checkbox, TablePagination,
    Grid
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { calculateBulbMinutes } from '../services/Calculations';
import theme from '../theme';

const UsageOverview = () => {
    const { data } = useContext(DataContext);

    // Example: Calculate total operations
    const totalOperations = data.length;

    // Example: Calculate remaining bulb hours
    const totalBulbHours = 1000;
    const usedBulbHours = data.reduce((acc, curr) => {
        const start = new Date(curr.startTime);
        const end = new Date(curr.endTime);
        const operationHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
        return acc + operationHours;
    }, 0);
    const remainingBulbHours = totalBulbHours - usedBulbHours;

    // Aggregate usage data by date for Usage Trends Line Chart
    const usageTrendsData = useMemo(() => {
        const usageByDate = data.reduce((acc, curr) => {
            const date = new Date(curr.startTime).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = { date, operations: 0 };
            }
            acc[date].operations += 1;
            return acc;
        }, {});

        return Object.values(usageByDate);
    }, [data]);

    // Example: Prepare data for Diagnostic Distribution Pie Chart
    const diagnosticData = {};

    data.forEach(item => {
        const diagnostic = item.Diagnostic;
        if (diagnosticData[diagnostic]) {
            diagnosticData[diagnostic]++;
        } else {
            diagnosticData[diagnostic] = 1;
        }
    });

    const pieChartData = Object.keys(diagnosticData).map(diagnostic => ({
        name: diagnostic,
        value: diagnosticData[diagnostic],
    }));

    // Table state for sorting and pagination
    const [orderBy, setOrderBy] = useState('startTime');
    const [order, setOrder] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Adjust as per your requirement
    const [selectedRows, setSelectedRows] = useState([]); // State for selected rows

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrderBy(property);
        setOrder(isAsc ? 'desc' : 'asc');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when changing rows per page
    };

    const handleClick = (event, id) => {
        const selectedIndex = selectedRows.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedRows, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelected = newSelected.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedRows.slice(0, selectedIndex),
                selectedRows.slice(selectedIndex + 1),
            );
        }

        setSelectedRows(newSelected);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = data.map((item) => item.id);
            setSelectedRows(newSelecteds);
            return;
        }
        setSelectedRows([]);
    };

    const isSelected = (id) => selectedRows.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const sortedData = [...data].sort((a, b) => {
        if (order === 'asc') {
            return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
            return a[orderBy] < b[orderBy] ? 1 : -1;
        }
    });

    return (
        <div style={{ padding: '20px', background: '#fff', color: '#000' }}>
            <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>Usage Overview</h2>
            <div className="summary-cards" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
                <div className="card" style={{ flex: 1,background: theme.palette.primary.main, color:'white', padding: '20px', borderRadius: '8px', marginRight: '20px' }}>
                    <h3>Total Operations</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalOperations}</p>
                </div>
                <div className="card" style={{ flex: 1, background: theme.palette.primary.main, color:'white', padding: '20px', borderRadius: '8px', marginLeft: '20px' }}>
                    <h3>Remaining Bulb Hours</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{calculateBulbMinutes(data).usedBulbMinutes} minutes</p>
                </div>
            </div>
            <div className="charts" style={{ marginBottom: '30px' }}>
                <Grid container spacing={2}>
                    <Grid item md={6} sm={12}>
                        <h3>Usage Trends</h3>
                        <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={usageTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                    <XAxis dataKey="date" tick={{ fill: '#000' }} />
                                    <YAxis tick={{ fill: '#000' }} />
                                    <Tooltip contentStyle={{ background: '#f0f0f0', border: 'none', borderRadius: '8px', color: '#000' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="operations" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Grid>

                    <Grid item md={6} sm={12}>
                        <h3>Diagnostic Distribution</h3>
                        <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={pieChartData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#f0f0f0', border: 'none', borderRadius: '8px', color: '#000' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Grid>
                </Grid>
            </div>
            <div className="usage-data" style={{ marginBottom: '30px' }}>
                <h3>Detailed Usage Data</h3>
                <Paper elevation={3} style={{ background: theme.palette.primary.main, color:'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                        style={{ color: 'white' }}
                                            indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                                            checked={selectedRows.length === data.length}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                        style={{ color: 'white' }}
                                            active={orderBy === 'serial'}
                                            direction={orderBy === 'serial' ? order : 'asc'}
                                            onClick={() => handleRequestSort('serial')}
                                        >
                                            Serial
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                        style={{ color: 'white' }}
                                            active={orderBy === 'Location1'}
                                            direction={orderBy === 'Location1' ? order : 'asc'}
                                            onClick={() => handleRequestSort('Location1')}
                                        >
                                            Location1
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                        style={{ color: 'white' }}
                                            active={orderBy === 'Location2'}
                                            direction={orderBy === 'Location2' ? order : 'asc'}
                                            onClick={() => handleRequestSort('Location2')}
                                        >
                                            Location2
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                        style={{ color: 'white' }}
                                            active={orderBy === 'Location3'}
                                            direction={orderBy === 'Location3' ? order : 'asc'}
                                            onClick={() => handleRequestSort('Location3')}
                                        >
                                            Location3
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                        style={{ color: 'white' }}
                                            active={orderBy === 'startTime'}
                                            direction={orderBy === 'startTime' ? order : 'asc'}
                                            onClick={() => handleRequestSort('startTime')}
                                        >
                                            Start Time
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                        style={{ color: 'white' }}
                                            active={orderBy === 'endTime'}
                                            direction={orderBy === 'endTime' ? order : 'asc'}
                                            onClick={() => handleRequestSort('endTime')}
                                        >
                                            End Time
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                        style={{ color: 'white' }}
                                            active={orderBy === 'Diagnostic'}
                                            direction={orderBy === 'Diagnostic' ? order : 'asc'}
                                            onClick={() => handleRequestSort('Diagnostic')}
                                        >
                                            Diagnostic
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                        style={{ color: 'white' }}
                                            active={orderBy === 'Code'}
                                            direction={orderBy === 'Code' ? order : 'asc'}
                                            onClick={() => handleRequestSort('Code')}
                                        >
                                            Code
                                        </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                                    const isItemSelected = isSelected(item.id);
                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, item.id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={item.id}
                                            selected={isItemSelected}
                                            style={{ backgroundColor: isItemSelected ? '#f0f0f0' : '#fff' }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                style={{ color: '#000' }}
                                                    checked={isItemSelected}
                                                />
                                            </TableCell>
                                            <TableCell style={{ color: '#000' }}>{item.serial}</TableCell>
                                            <TableCell style={{ color: '#000' }}>{item.Location1}</TableCell>
                                            <TableCell style={{ color: '#000' }}>{item.Location2}</TableCell>
                                            <TableCell style={{ color: '#000' }}>{item.Location3}</TableCell>
                                            <TableCell style={{ color: '#000' }}>{new Date(item.startTime).toLocaleString()}</TableCell>
                                            <TableCell style={{ color: '#000' }}>{new Date(item.endTime).toLocaleString()}</TableCell>
                                            <TableCell style={{ color: '#000' }}>{item.Diagnostic}</TableCell>
                                            <TableCell style={{ color: '#000' }}>{item.Code}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={10} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]} // Adjust as per your requirement
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        </div>
    );
};

export default UsageOverview;
