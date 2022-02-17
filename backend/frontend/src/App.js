import { axiosInstance } from "./config.js"
import './App.css';
import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Warehouse from './components/Warehouse';
import History from './components/History';
import Customers from './components/Customers';
import Employees from './components/Employees';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

const pages = [{ label: 'Magazzino', id: 'warehouse' }, { label: 'Storico', id: 'history' }, { label: 'Clienti', id: 'customers' }, { label: 'Dipendenti', id: 'employees' }];

function App() {
  const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(false)
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  React.useEffect(() => {
    userIsAuthenticated()
  }, [])

  const userIsAuthenticated = () => {
    axiosInstance.get("authenticated", {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    }).then(response => {
      console.log(response.data)
      setUserIsAuthenticatedFlag(true)
    }).catch(error => {
      console.log(error)
      setUserIsAuthenticatedFlag(false)
    });
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login replace to="/login" />} />
        <Route exact path='/login' element={< Login />}></Route>
      </Routes>

      {
        !userIsAuthenticatedFlag ? "" : <div>
          <AppBar position="static">
            <Container maxWidth="xl" style={{ marginLeft: '0' }}>
              <Toolbar disableGutters>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  {pages.map((page) => (
                    <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      style={{ color: 'white' }}
                    >
                      <Link style={{ color: 'white' }} to={"/" + page.id}>{page.label}</Link>
                    </Button>
                  ))}
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
        </div>
      }
      <Routes>
        <Route exact path='/warehouse' element={< Warehouse />}></Route>
        <Route exact path='/history' element={< History />}></Route>
        <Route exact path='/customers' element={< Customers />}></Route>
        <Route exact path='/employees' element={< Employees />}></Route>
      </Routes>

    </Router >
  );
}

export default App;
