import React, { useContext, useMemo } from 'react';
import { DataContext } from '../contexts/DataContext';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, Paper, Typography, Card, CardContent, Divider, TablePagination
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { calculateBulbMinutes, calculateTotalBulbHours } from '../services/Calculations';

const RobotDetails = () => {
  const { data } = useContext(DataContext);
  const theme = useTheme();

  const usageByDateData = useMemo(() => {
    const usageByDate = data.reduce((acc, curr) => {
      const date = new Date(curr.startTime).toLocaleDateString();
      const start = new Date(curr.startTime);
      const end = new Date(curr.endTime);
      const operationHours = (end - start) / (1000 * 60 * 60);
      if (!acc[date]) {
        acc[date] = { date, usage: 0 };
      }
      acc[date].usage += operationHours;
      return acc;
    }, {});
    return Object.values(usageByDate);
  }, [data]);

  // Prepare data for Robot Usage by Ward Bar Chart
const usageByWardData = useMemo(() => {
  const usageByWard = data.reduce((acc, curr) => {
    const ward = curr.Location2;
    const start = new Date(curr.startTime);
    const end = new Date(curr.endTime);
    const operationHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
    if (!acc[ward]) {
      acc[ward] = { ward, usage: 0 };
    }
    acc[ward].usage += operationHours;
    return acc;
  }, {});

  // Convert usage values to 2 decimal places
  Object.values(usageByWard).forEach(ward => {
    ward.usage = parseFloat(ward.usage.toFixed(2));
  });

  return Object.values(usageByWard);
}, [data]);

  const diagnosticData = useMemo(() => {
    const diagnostics = data.reduce((acc, curr) => {
      const diagnostic = curr.Diagnostic;
      acc[diagnostic] = (acc[diagnostic] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(diagnostics).map(diagnostic => ({
      name: diagnostic,
      value: diagnostics[diagnostic]
    }));
  }, [data]);

  const usageByBedData = useMemo(() => {
    const usageByBed = data.reduce((acc, curr) => {
      const bed = curr.Location3;
      const start = new Date(curr.startTime);
      const end = new Date(curr.endTime);
      const operationHours = (end - start) / (1000 * 60 * 60);
      if (!acc[bed]) {
        acc[bed] = { bed, usage: 0 };
      }
      acc[bed].usage += operationHours;
      return acc;
    }, {});
    return Object.values(usageByBed);
  }, [data]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Prepare data for Robot Usage by Location Chart
  const robotUsageData = data.reduce((acc, curr) => {
    const key = `${curr.Location1}-${curr.Location2}-${curr.Location3}`;
    if (!acc[key]) {
      acc[key] = { name: key, count: 0 };
    }
    acc[key].count++;
    return acc;
  }, {});

  const robotUsageChartData = Object.keys(robotUsageData).map(key => robotUsageData[key]);

  // Table Pagination and Sorting
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ padding: '20px', background: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Typography variant="h4" style={{ marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>Robot Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Card style={{  padding: '20px', background: theme.palette.primary.main, color:'white' }}>
 
            <CardContent>
              <Typography variant="h6" style={{ marginBottom: '10px'   }}>Robot Statistics</Typography>
              
              <Typography variant="h5" style={{ color: theme.palette.text.secondary }}>Total Robot Usage</Typography>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>{calculateBulbMinutes(data).usedBulbHours} hours</Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="h5" style={{ color: theme.palette.text.secondary }}>Remaining Bulb Hours</Typography>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>{calculateBulbMinutes(data).remainingBulbHours} hr</Typography>
            </CardContent>
          </Card>
        </Grid>
        
      </Grid>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>

      <Grid item xs={12} md={6}>
          <Card style={{ background: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" style={{ marginBottom: '10px' }}>Diagnostic Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={diagnosticData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                    dataKey="value"
                  >
                    {diagnosticData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card style={{ background: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" style={{ marginBottom: '10px' }}>Usage by Date</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageByDateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="usage" stroke={theme.palette.primary.main} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ background: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" style={{ marginBottom: '10px' }}>Usage by Ward</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageByWardData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis dataKey="ward" tick={{ fill: '#ddd' }} />
                  <YAxis tick={{ fill: '#ddd' }} />
                  <Tooltip contentStyle={{ background: '#555', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="usage" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ background: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" style={{ marginBottom: '10px' }}>Usage by Bed</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageByBedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bed" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="usage" stroke={theme.palette.primary.main} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={12}>

        <div className="charts">
                <h3>Robot Usage by Location</h3>
                <div style={{  padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)' }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={robotUsageChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                            <XAxis dataKey="name" tick={{ fill: '#ddd' }} />
                            <YAxis tick={{ fill: '#ddd' }} />
                            <Tooltip contentStyle={{ background: '#555', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        
        <Grid item xs={12}>
          <Card style={{ background: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" style={{ marginBottom: '10px' }}>Operation Details</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell>Hospital</TableCell>
                      <TableCell>Ward</TableCell>
                      <TableCell>Bed</TableCell>
                      <TableCell>Diagnostic</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{new Date(row.startTime).toLocaleString()}</TableCell>
                        <TableCell>{new Date(row.endTime).toLocaleString()}</TableCell>
                        <TableCell>{row.Location1}</TableCell>
                        <TableCell>{row.Location2}</TableCell>
                        <TableCell>{row.Location3}</TableCell>
                        <TableCell>{row.Diagnostic}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default RobotDetails;
