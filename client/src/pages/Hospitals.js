import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../contexts/DataContext';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
    Checkbox, TablePagination, Card, CardContent, Typography,
    Grid, Paper
} from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';
import { calculateBulbMinutes } from '../services/Calculations';
import theme from '../theme';

const HospitalsPage = () => {
    const { data } = useContext(DataContext);

    // Example: Calculate total hospitals, wards, and beds
    const hospitals = [...new Set(data.map(item => item.Location1))];
    const totalHospitals = hospitals.length;

    const totalWards = [...new Set(data.map(item => item.Location2))].length;
    const totalBeds = [...new Set(data.map(item => item.Location3))].length;

    // Example: Calculate total robot usage and remaining bulb hours
    const totalBulbHours = 1000;
    const usedBulbHours = data.reduce((acc, curr) => {
        const start = new Date(curr.startTime);
        const end = new Date(curr.endTime);
        const operationHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
        return acc + operationHours;
    }, 0);
    const remainingBulbHours = Math.max(totalBulbHours - usedBulbHours, 0);


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

    // Prepare data for Robot Usage by Hospital Bar Chart
    const usageByHospitalData = hospitals.map(hospital => ({
        name: hospital,
        usage: data.filter(item => item.Location1 === hospital).reduce((acc, curr) => {
            const start = new Date(curr.startTime);
            const end = new Date(curr.endTime);
            const operationHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
            return acc + operationHours;
        }, 0).toFixed(2)
    }));

    // Prepare data for Daily Operations Line Chart
    const dailyOperationsData = useMemo(() => {
        const operationsByDate = data.reduce((acc, curr) => {
            const date = curr.startTime.split(' ')[0]; // Extract date from startTime
            if (!acc[date]) {
                acc[date] = { date, operations: 0 };
            }
            acc[date].operations += 1;
            return acc;
        }, {});
    
        return Object.values(operationsByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [data]);

    // Aggregate the code data
  const codeData = useMemo(() => {
    const codeCounts = data.reduce((acc, curr) => {
      const code = curr.Code;
      acc[code] = (acc[code] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(codeCounts).map(key => ({
      code: key,
      count: codeCounts[key]
    }));
  }, [data]);
    

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

    // Hardcoded colors for light theme
    const lightThemeColors = {
        background: '#FFFFFF', // White background
        textPrimary: '#000000', // Black text
        primaryColor: '#8884d8', // Purple color for charts
        secondaryColor: '#82ca9d', // Green color for charts
    };

    return (
        <div style={{ padding: '20px', background: lightThemeColors.background, color: lightThemeColors.textPrimary }}>
            <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>Hospitals</h2>
            <div className="summary-cards" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
                <div className="card" style={{ flex: 1, background: theme.palette.primary.main, color: 'white', padding: '20px', borderRadius: '8px', marginRight: '20px' }}>
                    <h3>Total Hospitals</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: lightThemeColors.textPrimary }}>{totalHospitals}</p>
                </div>
                <div className="card" style={{ flex: 1, background: theme.palette.primary.main, color: 'white', padding: '20px', borderRadius: '8px', marginLeft: '20px' }}>
                    <h3>Total Wards</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: lightThemeColors.textPrimary }}>{totalWards}</p>
                </div>
                <div className="card" style={{ flex: 1, background: theme.palette.primary.main, color: 'white', padding: '20px', borderRadius: '8px', marginLeft: '20px' }}>
                    <h3>Total Beds</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: lightThemeColors.textPrimary }}>{totalBeds}</p>
                </div>
                <div className="card" style={{ flex: 1, background: theme.palette.primary.main, color: 'white', padding: '20px', borderRadius: '8px', marginLeft: '20px' }}>
                    <h3>Total Robot Usage</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: lightThemeColors.textPrimary }}>{calculateBulbMinutes(data).usedBulbHours} hours</p>
                </div>
                <div className="card" style={{ flex: 1, background: theme.palette.primary.main, color: 'white', padding: '20px', borderRadius: '8px', marginLeft: '20px' }}>
                    <h3>Remaining Bulb Hours</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: lightThemeColors.textPrimary }}>{calculateBulbMinutes(data).remainingBulbHours} hr</p>
                </div>
            </div>
            <div className="charts" style={{ marginBottom: '30px' }}>
                <Grid container spacing={2}>
                    <Grid item md={6} sm={12}>
                        <h3>Usage Trends</h3>
                        <div style={{ background: lightThemeColors.background, padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={usageTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="operations" stroke={lightThemeColors.primaryColor} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Grid>

                    <Grid item xs={12} md={6}>
          <Card style={{ background: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" style={{ marginBottom: '10px' }}>Robot Usage by Code</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={codeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="code" tick={{ fill: '#ddd' }} />
                  <YAxis tick={{ fill: '#ddd' }} />
                  <Tooltip contentStyle={{ background: '#555', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="count" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

                    <Grid item md={6} sm={12}>
                        <h3>Diagnostic Distribution</h3>
                        <div style={{ background: lightThemeColors.background, padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={pieChartData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={lightThemeColors.secondaryColor} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Grid>

                    <Grid item md={6} sm={12}>
                        <h3>Robot Usage by Hospital</h3>
                        <div style={{ background: lightThemeColors.background, padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={usageByHospitalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="usage" fill={lightThemeColors.primaryColor} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Grid>

                    <Grid item md={12} sm={12}>
                        <h3>Daily Operations</h3>
                        <div style={{ background: lightThemeColors.background, padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={dailyOperationsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="operations" stroke={lightThemeColors.primaryColor} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default HospitalsPage;
