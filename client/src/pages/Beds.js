import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../contexts/DataContext';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  Checkbox, TablePagination,
  Grid, Paper, Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';
import { calculateBulbMinutes, calculateTotalBulbHours } from '../services/Calculations';

const Beds = () => {
  const { data } = useContext(DataContext);
  const theme = useTheme(); // Access the current theme

  // Aggregate usage data per bed
  const usageByBedData = useMemo(() => {
    const usageByBed = data.reduce((acc, curr) => {
      const key = `${curr.Location1} - ${curr.Location2} - Bed ${curr.Location3}`;
      const start = new Date(curr.startTime);
      const end = new Date(curr.endTime);
      const operationHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
      if (!acc[key]) {
        acc[key] = { name: key, usage: 0 };
      }
      acc[key].usage += operationHours;
      return acc;
    }, {});
    return Object.values(usageByBed);
  }, [data]);

  // Calculate totalBubusage in minutes
  const totalBubusage = calculateTotalBulbHours(data) * 60; // Convert hours to minutes

  // Calculate remaining bulb minutes
  const remainingBulbMinutes = parseFloat(calculateBulbMinutes(data).usedBulbMinutes); // Parse to float

  // Prepare data for Pie Chart
  const pieChartData = [
    { name: 'Total Bulb Usage', value: totalBubusage },
    { name: 'Remaining Bulb Minutes', value: remainingBulbMinutes }
  ];

  const COLORS = ['#0088FE', '#FFBB28']; // Define colors for the pie chart segments

  // Table state for sorting and pagination
  const [orderBy, setOrderBy] = useState('name');
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
    <div style={{ padding: '20px', background: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Typography variant="h4" style={{ marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>Beds</Typography>
      <div className="summary-cards" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
        <div className="card" style={{ flex: 1, background: theme.palette.primary.main, color:'white',padding: '20px', borderRadius: '8px', marginRight: '20px' }}>
          <Typography variant="h5">Total Robot Usage</Typography>
          <Typography variant="h6" style={{ fontSize: '24px', fontWeight: 'bold', color: theme.palette.text.primary }}>{calculateTotalBulbHours(data).toFixed(2)} hours</Typography>
        </div>
        <div className="card" style={{ flex: 1, background: theme.palette.primary.main, color:'white', padding: '20px', borderRadius: '8px', marginLeft: '20px' }}>
          <Typography variant="h6">Remaining Bulb Hours</Typography>
          <Typography variant="h6" style={{ fontSize: '24px', fontWeight: 'bold', color: theme.palette.text.primary }}>{calculateBulbMinutes(data).usedBulbHours} hr</Typography>
        </div>
      </div>
      <div className="charts" style={{ marginBottom: '30px' }}>
        <Grid container spacing={2}>
          <Grid item md={6} sm={12}>
            <Typography variant="h4">Usage by Bed</Typography>
            <div style={{ background: theme.palette.background.paper, padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageByBedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usage" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Grid>
          <Grid item md={6} sm={12}>
            <Typography variant="h4">Total Bulb Usage vs Remaining Bulb Minutes</Typography>
            <div style={{ background: theme.palette.background.paper, padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Grid>
        </Grid>
      </div>

      <TableContainer style={{
        background: theme.palette.primary.main, color:'white',
      }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                style={{
                   color:'white',
                }}
                  indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                  checked={data.length > 0 && selectedRows.length === data.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                 style={{
                  color:'white',
               }}
                  active={orderBy === 'startTime'}
                  direction={orderBy === 'startTime' ? order : 'asc'}
                  onClick={() => handleRequestSort('startTime')}
                >
                  Start Time
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                 style={{
                  color:'white',
               }}
                  active={orderBy === 'endTime'}
                  direction={orderBy === 'endTime' ? order : 'asc'}
                  onClick={() => handleRequestSort('endTime')}
                >
                  End Time
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                 style={{
                  color:'white',
               }}
                  active={orderBy === 'Location1'}
                  direction={orderBy === 'Location1' ? order : 'asc'}
                  onClick={() => handleRequestSort('Location1')}
                >
                  Hospital
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                 style={{
                  color:'white',
               }}
                  active={orderBy === 'Location2'}
                  direction={orderBy === 'Location2' ? order : 'asc'}
                  onClick={() => handleRequestSort('Location2')}
                >
                  Ward
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                 style={{
                  color:'white',
               }}
                  active={orderBy === 'Location3'}
                  direction={orderBy === 'Location3' ? order : 'asc'}
                  onClick={() => handleRequestSort('Location3')}
                >
                  Bed
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                 style={{
                  color:'white',
               }}
                  active={orderBy === 'Diagnostic'}
                  direction={orderBy === 'Diagnostic' ? order : 'asc'}
                  onClick={() => handleRequestSort('Diagnostic')}
                >
                  Diagnostic
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              const isItemSelected = isSelected(row.id);
              return (
                <TableRow
                
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                     style={{
                      color:'white',
                   }}
                      checked={isItemSelected}
                    />
                  </TableCell>
                  <TableCell  style={{
                   color:'white',
                }}>{new Date(row.startTime).toLocaleString()}</TableCell>
                  <TableCell  style={{
                   color:'white',
                }}>{new Date(row.endTime).toLocaleString()}</TableCell>
                  <TableCell  style={{
                   color:'white',
                }}>{row.Location1}</TableCell>
                  <TableCell  style={{
                   color:'white',
                }}>{row.Location2}</TableCell>
                  <TableCell  style={{
                   color:'white',
                }}>{row.Location3}</TableCell>
                  <TableCell style={{
                   color:'white',
                }}>{row.Diagnostic}</TableCell>
                {console.log(row)}
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </TableContainer>
    </div>
  );
};

export default Beds;
