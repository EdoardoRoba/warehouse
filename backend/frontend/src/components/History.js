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

function History(props) {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(true)
    const [history, setHistory] = React.useState([])
    const [historyShown, setHistoryShown] = React.useState([])
    const [employeeSelected, setEmployeeSelected] = React.useState("")
    const [toolSelected, setToolSelected] = React.useState("")
    const [showHistory, setShowHistory] = React.useState(false)
    const [showError, setShowError] = React.useState(false);
    const [employees, setEmployees] = React.useState([])
    const [tools, setTools] = React.useState([])
    const [auths, setAuths] = React.useState([])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);

    const columns = [
        { field: 'user', headerName: 'Utente', width: 200 },
        { field: 'tool', headerName: 'Attrezzo', width: 350 },
        { field: 'totalQuantity', headerName: 'Quantità totale', width: 200 },
        { field: 'update', headerName: 'Azione fatta', width: 200 },
        { field: 'createdAt', headerName: 'Data', width: 200 }
    ]

    React.useEffect(() => {
        userIsAuthenticated()
        getHistory()
        getEmployees()
        getTools()
        getToolbarUtilityClass()
        setShowHistory(false)
    }, [])

    React.useEffect(() => {
        // console.log("history: ", history)
    }, [history]);

    React.useEffect(() => {
        setShowHistory(true)
    }, [employeeSelected, toolSelected]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowError(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [showError]);

    const getEmployees = async () => {
        axiosInstance.get('employee')
            .then(res => {
                // console.log("Employees: ", res.data)
                setEmployees(res.data)
            })
    }

    const getTools = async () => {
        axiosInstance.get('tool')
            .then(res => {
                setTools(res.data)
            })
    };

    const handleChangePage = (event, newPage) => {
        console.log(newPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getHistory = () => {
        axiosInstance.get('history')
            .then(res => {
                setHistory(res.data)
            })
    }

    const userIsAuthenticated = () => {
        if (localStorage.getItem("auths") !== null) {
            if (localStorage.getItem("auths").includes("history")) {
                axiosInstance.get("authenticated", {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                        "profile": localStorage.getItem("profile"),
                        "auths": localStorage.getItem("auths")
                    }
                }).then(response => {
                    console.log(response.data)
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

    const showHistoryDetail = (value, type) => {
        if (value !== null) {
            if (type === "user") {
                setEmployeeSelected(value.lastName)
                setToolSelected(null)
                axiosInstance.get('history', { params: { type: "user", data: value.lastName } })
                    .then(response => {
                        setHistoryShown(response.data)
                    }).catch(error => {
                        setShowError(true)
                    });
            } else {
                setEmployeeSelected(null)
                setToolSelected(value.label)
                console.log(value.label)
                axiosInstance.get('history', { params: { type: "tool", data: value.label } })
                    .then(response => {
                        console.log(response.data)
                        setHistoryShown(response.data)
                    }).catch(error => {
                        setShowError(true)
                    });
            }
        } else {
            setHistoryShown([])
        }
    }

    return (
        <div>
            {
                !userIsAuthenticatedFlag ? <div>
                    <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert>
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}><Button variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginTop: '8rem' }}><Link style={{ color: 'white' }} to={"/login"}>Vai al Login</Link></Button></div>
                </div> :
                    <div>
                        <h1 style={{ fontFamily: 'times', marginLeft: '1rem', marginRight: 'auto' }}>Storico</h1>
                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={employees}
                                style={{ marginLeft: 'auto', marginRight: "auto" }}
                                sx={{ width: 300 }}
                                getOptionLabel={option => option.lastName}
                                renderInput={(params) => <TextField {...params} label="storico (per utente)" />}
                                onChange={(event, value) => { showHistoryDetail(value, "user") }}
                            />
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={tools}
                                style={{ marginLeft: 'auto', marginRight: "auto" }}
                                sx={{ width: 300 }}
                                getOptionLabel={option => option.label}
                                renderInput={(params) => <TextField {...params} label="storico (per prodotto)" />}
                                onChange={(event, value) => { showHistoryDetail(value, "tool") }}
                            />
                        </div >
                        {
                            (showError === false) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Errore. Controlla la connessione o i dati inseriti.</Alert>
                        }
                        {
                            (showHistory === false) ? "" : <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '80%', marginTop: '3rem', marginLeft: 'auto', marginRight: 'auto' }}>
                                {/* <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Utente</TableCell>
                                                <TableCell align="right">Attrezzo</TableCell>
                                                <TableCell align="right">Quantità totale</TableCell>
                                                <TableCell align="right">Azione fatta</TableCell>
                                                <TableCell align="right">Data</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {historyShown.map((row) => (
                                                <TableRow
                                                    key={row.user}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.user}
                                                    </TableCell>
                                                    <TableCell align="right">{row.tool}</TableCell>
                                                    <TableCell align="right">{row.totalQuantity}</TableCell>
                                                    <TableCell align="right">{row.update}</TableCell>
                                                    <TableCell align="right">{row.createdAt}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer> */}
                                <div style={{ height: 650, width: '100%' }}>
                                    <DataGrid
                                        rows={historyShown}
                                        columns={columns}
                                        getRowId={(row) => row._id}
                                        pageSize={10}
                                        rowsPerPageOptions={[10]}
                                    // onRowClick={(event, value) => { setCustomerSelected(event.row) }}
                                    />
                                </div>
                            </div>
                        }
                    </div >
            }
        </div >
    );
}

export default History;
