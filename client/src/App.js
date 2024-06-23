import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CssBaseline, Drawer, AppBar, Toolbar, IconButton, List, ListItem, ListItemIcon, ListItemText, Container, Avatar, Typography, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import RoomIcon from '@mui/icons-material/Room';
import BedIcon from '@mui/icons-material/Bed';
import RobotIcon from '@mui/icons-material/Memory';
import theme from './theme';
import Dashboard from './pages/Dashboard';
import UsageOverview from './pages/UsageOverview';
import Hospitals from './pages/Hospitals';
import Wards from './pages/Wards';
import Beds from './pages/Beds';
import RobotDetails from './pages/RobotDetails';
import { DataProvider } from './contexts/DataContext';
import { useUser ,SignIn , UserButton} from '@clerk/clerk-react';
import SigninComponent from './SigninComponent';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const {user, isSignedIn} = useUser();

  useEffect(()=>{
    if(isSignedIn === true){
      console.log(user)
    }
  },[user])

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <DataProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth={'xl'}>

          <AppBar position="fixed">
            <Toolbar>
              <IconButton edge="start"  aria-label="menu" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color='black' component="div" sx={{ flexGrow: 1 }}>
                ProtoBot Dashboard
              </Typography>
              {isSignedIn === true ? (<UserButton />) : (<>
                <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <Avatar alt="User Avatar" src="https://img.freepik.com/free-photo/portrait-3d-male-doctor_23-2151107019.jpg?size=626&ext=jpg" />
                </Badge>
              </IconButton>
              </>)}
            </Toolbar>
          </AppBar>

          <Drawer variant="temporary" open={drawerOpen} onClose={handleDrawerToggle}>
            <List>
              <ListItem button onClick={() => handleNavClick('/')}>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem button onClick={() => handleNavClick('/usage')}>
                <ListItemIcon><AssessmentIcon /></ListItemIcon>
                <ListItemText primary="Usage Overview" />
              </ListItem>
              <ListItem button onClick={() => handleNavClick('/hospitals')}>
                <ListItemIcon><LocalHospitalIcon /></ListItemIcon>
                <ListItemText primary="Hospitals" />
              </ListItem>
              <ListItem button onClick={() => handleNavClick('/wards')}>
                <ListItemIcon><RoomIcon /></ListItemIcon>
                <ListItemText primary="Wards" />
              </ListItem>
              <ListItem button onClick={() => handleNavClick('/beds')}>
                <ListItemIcon><BedIcon /></ListItemIcon>
                <ListItemText primary="Beds" />
              </ListItem>
              <ListItem button onClick={() => handleNavClick('/robots')}>
                <ListItemIcon><RobotIcon /></ListItemIcon>
                <ListItemText primary="Robot Details" />
              </ListItem>
            </List>
          </Drawer>

          <Toolbar />
          <Routes>
            <Route path="/" element={
              isSignedIn === true ? (<Dashboard />) : (<SigninComponent />)} />
            <Route path="/usage" element={
              isSignedIn === true ? (<UsageOverview />) : (<SigninComponent />)} />
            <Route path="/hospitals" element={
              isSignedIn === true ? (<Hospitals />) : (<SigninComponent />)} />
            <Route path="/wards" element={
              isSignedIn === true ? (<Wards />) : (<SigninComponent />)} />
            <Route path="/beds" element={
              isSignedIn === true ? (<Beds />) : (<SigninComponent />)} />
            <Route path="/robots" element={
              isSignedIn === true ? (<RobotDetails />) : (<SigninComponent />)} />
          </Routes>

        </Container>
      </ThemeProvider>
    </DataProvider>
  );
};

export default App;
