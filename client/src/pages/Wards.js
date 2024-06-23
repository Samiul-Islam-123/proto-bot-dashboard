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

const Wards = () => {
  const { data } = useContext(DataContext);
  const theme = useTheme(); // Access the current theme

  // Example: Calculate total wards, total beds, and other metrics
  const wards = [...new Set(data.map(item => item.Location2))];
  const totalWards = wards.length;
  const totalBeds = [...new Set(data.map(item => item.Location3))].length;

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
  const diagnosticData = useMemo(() => {
    const diagnosticCount = data.reduce((acc, curr) => {
      acc[curr.Diagnostic] = (acc[curr.Diagnostic] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(diagnosticCount).map(diagnostic => ({
      name: diagnostic,
      value: diagnosticCount[diagnostic],
    }));
  }, [data]);

  // Prepare data for Robot Usage by Ward Bar Chart
  const usageByWardData = useMemo(() => {
    return wards.map(ward => ({
      name: ward,
      usage: data.filter(item => item.Location2 === ward).reduce((acc, curr) => {
        const start = new Date(curr.startTime);
        const end = new Date(curr.endTime);
        const operationHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
        return acc + operationHours;
      }, 0)
    }));
  }, [data, wards]);

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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF']; // Define your own set of colors

  return (
    <div style={{ padding: '20px', background: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Typography variant="h4" gutterBottom>Wards</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper style={{ background: theme.palette.primary.main, color: theme.palette.primary.contrastText, padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h6" gutterBottom>Total Wards</Typography>
            <Typography variant="h4" style={{ fontWeight: 'bold' }}>{totalWards}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper style={{ background: theme.palette.primary.main, color: theme.palette.primary.contrastText, padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h6" gutterBottom>Total Beds</Typography>
            <Typography variant="h4" style={{ fontWeight: 'bold' }}>{totalBeds}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper style={{ background: theme.palette.primary.main, color: theme.palette.primary.contrastText, padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h6" gutterBottom>Total Robot Usage</Typography>
            <Typography variant="h4" style={{ fontWeight: 'bold' }}>{calculateTotalBulbHours(data).toFixed(2)} hours</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper style={{ background: theme.palette.primary.main, color: theme.palette.primary.contrastText, padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h6" gutterBottom>Remaining Bulb Hours</Typography>
            <Typography variant="h4" style={{ fontWeight: 'bold' }}>{calculateBulbMinutes(data).usedBulbMinutes} minutes</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: '30px' }}>
        <Grid item xs={12} md={6}>
          <Paper style={{ background: theme.palette.background.paper, padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" gutterBottom>Usage Trends</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="operations" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper style={{ background: theme.palette.background.paper, padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" gutterBottom>Diagnostic Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diagnosticData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {diagnosticData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: '30px' }}>
        <Grid item xs={12}>
          <Paper style={{ background: theme.palette.background.paper, padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" gutterBottom>Robot Usage by Ward</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageByWardData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: '30px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                  checked={data.length > 0 && selectedRows.length === data.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'startTime'}
                  direction={orderBy === 'startTime' ? order : 'asc'}
                  onClick={() => handleRequestSort('startTime')}
                >
                  Start Time
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'endTime'}
                  direction={orderBy === 'endTime' ? order : 'asc'}
                  onClick={() => handleRequestSort('endTime')}
                >
                  End Time
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'Location2'}
                  direction={orderBy === 'Location2' ? order : 'asc'}
                  onClick={() => handleRequestSort('Location2')}
                >
                  Ward
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'Location3'}
                  direction={orderBy === 'Location3' ? order : 'asc'}
                  onClick={() => handleRequestSort('Location3')}
                >
                  Bed
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
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
                      checked={isItemSelected}
                    />
                  </TableCell>
                  <TableCell>{new Date(row.startTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(row.endTime).toLocaleString()}</TableCell>
                  <TableCell>{row.Location2}</TableCell>
                  <TableCell>{row.Location3}</TableCell>
                  <TableCell>{row.Diagnostic}</TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
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

export default Wards;
