// import axios from "axios";
import { axiosInstance } from "../config.js"
import * as React from "react";
import { db } from '../firebase-config'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import Grow from '@mui/material/Grow';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/Menu';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import './Classes.css'
import { getToolbarUtilityClass } from "@mui/material";
import WarehousePage from "./HomePages/WarehousePage.js";
import HistoryPage from "./HomePages/HistoryPage.js";
import CustomerPage from "./HomePages/CustomersPage.js";
import EmployeesPage from "./HomePages/EmployeesPage.js";

function Home() {

    const [value, setValue] = React.useState(0);
    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(true)
    const [auths, setAuths] = React.useState([])

    const TabPanel = (props) => {
        const { children, value, index, component, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    React.useEffect(() => {
        userIsAuthenticated()
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const userIsAuthenticated = () => {
        if (localStorage.getItem("auths") !== null) {
            if (localStorage.getItem("auths").includes("customers")) {
                axiosInstance.get("authenticated", {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                        "profile": localStorage.getItem("profile"),
                        "auths": localStorage.getItem("auths")
                    }
                }).then(response => {
                    // console.log(response.data)
                    setUserIsAuthenticatedFlag(true)
                    var a = {}
                    for (let au of localStorage.getItem("auths").split(',')) {
                        a[au.split(":")[0]] = au.split(":")[1]
                    }
                    setAuths(a)
                }).catch(error => {
                    console.log(error)
                    setUserIsAuthenticatedFlag(false)
                });
            } else {
                setUserIsAuthenticatedFlag(false)
            }
        } else {
            setUserIsAuthenticatedFlag(false)
        }
    }

    return (
        <div>
            {
                !userIsAuthenticatedFlag ? <div>
                    <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert>
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}><Button variant="outlined" onClick={() => { window.location.reload(true) }} style={{ color: 'white', backgroundColor: 'green', marginTop: '8rem' }}><Link style={{ color: 'white' }} to={"/login"}>Vai al Login</Link></Button></div>
                </div> :
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '5rem', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '80%' }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                                {
                                    auths["customers"] === "*" ? <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Tab label="Magazzino" {...a11yProps(0)} />
                                        <Tab label="Storico" {...a11yProps(1)} />
                                        <Tab label="Clienti" {...a11yProps(2)} />
                                        <Tab label="Dipendenti" {...a11yProps(3)} />
                                    </Tabs> : <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Tab label="Magazzino" {...a11yProps(0)} />
                                        <Tab label="Clienti" {...a11yProps(1)} />
                                    </Tabs>
                                }

                            </Box>
                            {
                                auths["customers"] === "*" ? "" : <Tab label="Dipendenti" {...a11yProps(3)} />
                            }
                            <TabPanel value={value} index={0}>
                                <WarehousePage />
                            </TabPanel>
                            {
                                auths["customers"] === "*" ? <TabPanel value={value} index={1}>
                                    <HistoryPage />
                                </TabPanel> : <TabPanel value={value} index={1}>
                                    <CustomerPage />
                                </TabPanel>
                            }
                            {
                                auths["customers"] === "*" ? <TabPanel value={value} index={2}>
                                    <CustomerPage />
                                </TabPanel> : ""
                            }
                            {
                                auths["customers"] === "*" ? <TabPanel value={value} index={3}>
                                    <EmployeesPage />
                                </TabPanel> : ""
                            }

                        </Box >
                    </div >
            }
        </div>
    );
}

export default Home;
