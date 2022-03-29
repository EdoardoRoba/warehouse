import { axiosInstance } from "./config.js"
import './App.css';
import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Warehouse from './components/Warehouse';
import History from './components/History';
import Customers from './components/Customers';
import Employees from './components/Employees';
import MyCalendar from './components/MyCalendar';
import Home from './components/Home';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { ItaurosTextField } from "itauros-material";


function App() {
  const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(false)
  const [openLeft, setOpenLeft] = React.useState(false)
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [auths, setAuths] = React.useState([]);
  const [pages, setPages] = React.useState([{}]);

  const [valueSelect, setValueSelect] = React.useState("");
  function onChangeIta(value) {
    setValueSelect(value)
  }

  React.useEffect(() => {
    userIsAuthenticated()
    setAuths(localStorage.getItem("auths"))
  }, [])

  React.useEffect(() => {
    // console.log("pagesss: ", pages)
  }, [pages])

  React.useEffect(() => {
    var pgs = []
    var pg = {}
    pg = {}
    pg['label'] = "Home"
    pg['id'] = "home"
    pgs.push(pg)
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
      if (auths.includes("calendar")) {
        pg = {}
        pg['label'] = "Calendario"
        pg['id'] = "calendar"
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

  const freeCache = () => {
    window.location.reload(true);
    localStorage.clear()
    // localStorage.removeItem("key")
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const toggleDrawer = () => {
    setOpenLeft((prev) => !prev)
  }

  const list = () => (
    // <Box
    //   // sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
    //   role="presentation"
    //   onClick={toggleDrawer}
    //   onKeyDown={toggleDrawer}
    // >
    <List>
      {pages.map((page) => (
        <ListItem button key={page.label}>
          {/* <ListItemText primary={page.label} />
           */}
          <Button
            key={page}
            onClick={() => {
              handleCloseNavMenu()
              toggleDrawer()
            }}
          >
            <Link to={"/" + page.id}>{page.label}</Link>
          </Button>
        </ListItem>

      ))
      }
    </List >
    // </Box>
  );

  return (
    <Router>

      {/* <div style={{ width: "60%" }}>
        <ItaurosTextField
          title={"Nome"}
          id={"name"}
          isLoading={false}
          size={"large"}
          isDisabled={false}
          allowClear={false}
          required={true}
          placeholder={"inserisci qui il tuo nome"}
          value={valueSelect}
          onChange={onChangeIta}
          rules={[{ type: "text", rule: "^[0-9A-Z]{1,5}$", message: "This field does not follow regex rule." }]}
          maxLength={10}
        // className={style["itauros-text-field"]}
        />
      </div> */}

      {
        !userIsAuthenticatedFlag ? "" : <div>
          <AppBar position="static">
            <Container maxWidth="xl" style={{ marginLeft: '0' }}>
              <Toolbar disableGutters>
                <Box sx={{ flexGrow: 1 }}>
                  <IconButton onClick={toggleDrawer}
                    style={{ color: 'white' }}>
                    <MenuIcon />
                  </IconButton>
                  <Drawer
                    anchor={"left"}
                    open={openLeft}
                    onClose={toggleDrawer}
                  >
                    {list()}
                  </Drawer>
                </Box>
                {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  {pages.map((page) => (
                    <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      style={{ color: 'white' }}
                    >
                      <Link style={{ color: 'white' }} to={"/" + page.id}>{page.label}</Link>
                    </Button>
                  ))}
                </Box>*/}
                <Button style={{ right: '0' }} color="inherit">
                  <Tooltip style={{ marginRight: '1rem' }} title="Logout">
                    <IconButton onClick={() => { freeCache() }}>
                      <Link style={{ color: 'white' }} to={"/login"}><ExitToAppIcon /></Link>
                    </IconButton>
                  </Tooltip>
                </Button>
              </Toolbar>
            </Container>
          </AppBar>
        </div>
      }
      <Routes>
        <Route exact path="/" element={<Login replace to="/login" />} />
        <Route exact path='/login' element={< Login />}></Route>
        <Route exact path='/home' element={< Home />}></Route>
        {/* </Routes>
      <Routes> */}
        <Route exact path='/warehouse' element={< Warehouse />}></Route>
        <Route exact path='/history' element={< History />}></Route>
        <Route exact path='/customers' element={< Customers />}></Route>
        <Route exact path='/employees' element={< Employees />}></Route>
        <Route exact path='/calendar' element={< MyCalendar />}></Route>
      </Routes>

    </Router >
  );
}

export default App;
