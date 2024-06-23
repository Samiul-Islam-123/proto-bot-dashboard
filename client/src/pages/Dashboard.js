import React, { useContext, useMemo } from 'react';
import { DataContext } from '../contexts/DataContext';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Grid, useTheme } from '@mui/material';
import { calculateBulbMinutes } from '../services/Calculations';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { data } = useContext(DataContext);
    const theme = useTheme();

    // Example: Calculate total operations
    const totalOperations = data.length;

    console.log(calculateBulbMinutes(data));

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

    // Prepare data for Diagnostic Status Distribution (Pie Chart)
    const diagnosticData = data.reduce((acc, curr) => {
        const status = curr.Diagnostic || 'NULL';
        if (!acc[status]) {
            acc[status] = 0;
        }
        acc[status]++;
        return acc;
    }, {});

    const diagnosticChartData = Object.keys(diagnosticData).map(status => ({
        name: status === 'NULL' ? 'No Data' : status,
        value: diagnosticData[status],
    }));

    const COLORS = ['#82ca9d', '#8884d8', '#ffc658']; // Colors for each section of the Pie Chart

    return (
        <div style={{ padding: '20px', minHeight: '100vh' }}>
            {data && (<>

                <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>Dashboard</h2>
                <div className="summary-cards" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
                    <div className="card" style={{ flex: 1, background: theme.palette.primary.main, color: 'white', padding: '20px', borderRadius: '8px', marginRight: '20px' }}>
                        <h3>Total Operations</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalOperations}</p>
                    </div>
                    <div className="card" style={{ flex: 1, background: theme.palette.primary.main, color: 'white', padding: '20px', borderRadius: '8px', marginLeft: '20px' }}>
                        <h3>Remaining Bulb Hours</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{calculateBulbMinutes(data).remainingBulbHours} hr</p>


                    </div>
                </div>
                <div className="quick-links" style={{ marginBottom: '30px' }}>
                    <h3>Quick Links</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
                            <Link to="/usage" style={{ textDecoration: 'none', color: 'inherit' }}>
                                View Usage Overview
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
                            <Link to="/hospitals" style={{ textDecoration: 'none', color: 'inherit' }}>
                                Explore Hospital Details
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
                            <Link to="/robots" style={{ textDecoration: 'none', color: 'inherit' }}>
                                Check Robot Details
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="charts" style={{ marginBottom: '30px' }}>
                    <Grid container spacing={2}>
                        <Grid item md={6} sm={12}>
                            <h3>Usage Trends</h3>
                            <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
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
                            <h3>Diagnostic Status Distribution</h3>
                            <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={diagnosticChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {diagnosticChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

                <div className="charts">
                    <h3>Robot Usage by Location</h3>
                    <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={robotUsageChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                <XAxis dataKey="name" tick={{ fill: '#000' }} />
                                <YAxis tick={{ fill: '#000' }} />
                                <Tooltip contentStyle={{ background: '#f0f0f0', border: 'none', borderRadius: '8px', color: '#000' }} />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </>)}
        </div>
    );
};

export default Dashboard;
