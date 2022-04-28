// import axios from "axios";
import { axiosInstance } from "../config.js"
import * as React from "react";
import { db } from '../firebase-config'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Classes.css'
import { getToolbarUtilityClass } from "@mui/material";
import WarehousePage from "./HomePages/WarehousePage.js";
import HistoryPage from "./HomePages/HistoryPage.js";
import CustomerPage from "./HomePages/CustomersPage.js";
import EmployeesPage from "./HomePages/EmployeesPage.js";
import CalendarPage from "./HomePages/CalendarPage.js";
import GestionalePage from "./HomePages/GestionalePage.js";

function Home() {

    const [value, setValue] = React.useState(0);
    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(true)
    const [auths, setAuths] = React.useState([])

    React.useEffect(() => {
        userIsAuthenticated()
    }, [])

    const userIsAuthenticated = () => {
        setUserIsAuthenticatedFlag(true)
    }

    return (
        <div>
            {
                !userIsAuthenticatedFlag ? <div>
                    <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert>
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}><Button variant="outlined" onClick={() => { window.location.reload(true) }} style={{ color: 'white', backgroundColor: 'green', marginTop: '8rem' }}><Link style={{ color: 'white' }} to={"/login"}>Vai al Login</Link></Button></div>
                </div> :
                    <div>
                        <Box sx={{ flexGrow: 1, marginBottom: 10 }}>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                <Grid item xs={12} sm={6}>
                                    <CustomerPage />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <WarehousePage />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <HistoryPage />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <EmployeesPage />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CalendarPage />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <GestionalePage />
                                </Grid>
                            </Grid>
                        </Box>
                    </div >
            }
        </div>
    );
}

export default Home;
