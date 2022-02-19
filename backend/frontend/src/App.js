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


function App() {
  const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(false)
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [auths, setAuths] = React.useState([]);
  const [pages, setPages] = React.useState([{}]);

  React.useEffect(() => {
    userIsAuthenticated()
    setAuths(localStorage.getItem("auths"))
  }, [])

  React.useEffect(() => {
    console.log("pagesss: ", pages)
  }, [pages])

  React.useEffect(() => {
    var pgs = []
    var pg = {}
    console.log("authsssssss", auths)
    if (auths !== null) {
      if (auths.includes("warehouse")) {
        pg = {}
        pg['label'] = "Magazzino"
        pg['id'] = "warehouse"
        pgs.push(pg)
      }
      if (auths.includes("history")) {
        pg = {}
        pg['label'] = "Storico"
        pg['id'] = "history"
        pgs.push(pg)
      }
      if (auths.includes("customers")) {
        pg = {}
        pg['label'] = "Clienti"
        pg['id'] = "customers"
        pgs.push(pg)
      }
      if (auths.includes("employees")) {
        pg = {}
        pg['label'] = "Dipendenti"
        pg['id'] = "employees"
        pgs.push(pg)
      }
      setPages(pgs)
    }
  }, [auths])

  const userIsAuthenticated = () => {
    axiosInstance.get("authenticated", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "profile": localStorage.getItem("profile"),
        "auths": localStorage.getItem("auths")
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
