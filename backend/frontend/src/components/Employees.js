// import axios from "axios";
import { axiosInstance } from "../config.js"
import * as React from "react";
import { db } from '../firebase-config'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import './Classes.css'

function Employees(props) {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(false)
    const [addEmployeeRecordFlag, setAddEmployeeRecordFlag] = React.useState(false);
    const [getEmployeeRecordFlag, setGetEmployeeRecordFlag] = React.useState(false);
    const [updateEmployeeRecordFlag, setUpdateEmployeeRecordFlag] = React.useState(false);
    const [deleteEmployeeRecordFlag, setDeleteEmployeeRecordFlag] = React.useState(false);
    const [label, setLabel] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [birth, setBirth] = React.useState("")
    const [fiscalCode, setFiscalCode] = React.useState("")
    const [employees, setEmployees] = React.useState([])
    const [confermaAdd, setConfermaAdd] = React.useState(false);
    const [confermaUpdate, setConfermaUpdate] = React.useState(false);
    const [confermaDelete, setConfermaDelete] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    const [notFound, setNotFound] = React.useState("");
    const [employeeFound, setEmployeeFound] = React.useState("");

    React.useEffect(() => {
        getEmployees()
        userIsAuthenticated()
    }, [])

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowError(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [showError]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setConfermaAdd(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [confermaAdd]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setConfermaUpdate(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [confermaUpdate]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setConfermaDelete(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [confermaDelete]);

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

    const handleChangeAddEmployeeRecord = () => {
        setAddEmployeeRecordFlag((prev) => !prev);
        setUpdateEmployeeRecordFlag(false);
        setDeleteEmployeeRecordFlag(false);
        setGetEmployeeRecordFlag(false);
        setLabel("")
        setLastName("")
        setBirth("")
        setFiscalCode("")
        setEmployeeFound(null)
    };

    const handleChangeGetEmployeeRecord = () => {
        setGetEmployeeRecordFlag((prev) => !prev);
        setUpdateEmployeeRecordFlag(false);
        setDeleteEmployeeRecordFlag(false);
        setAddEmployeeRecordFlag(false);
        setLabel("")
        setLastName("")
        setBirth("")
        setFiscalCode("")
        setEmployeeFound(null)
    };

    const handleChangeUpdateEmployeeRecord = () => {
        setUpdateEmployeeRecordFlag((prev) => !prev);
        setAddEmployeeRecordFlag(false);
        setDeleteEmployeeRecordFlag(false);
        setGetEmployeeRecordFlag(false);
        setLabel("")
        setLastName("")
        setBirth("")
        setFiscalCode("")
        setEmployeeFound(null)
    };

    const handleChangeDeleteEmployeeRecord = () => {
        setDeleteEmployeeRecordFlag((prev) => !prev);
        setAddEmployeeRecordFlag(false);
        setUpdateEmployeeRecordFlag(false);
        setGetEmployeeRecordFlag(false);
        setLabel("")
        setLastName("")
        setBirth("")
        setFiscalCode("")
        setEmployeeFound(null)
    };

    const getEmployees = async () => {
        axiosInstance.get('employee')
            .then(res => {
                // console.log("Employees: ", res.data)
                setEmployees(res.data)
            })
    }

    let addEmployeeRecord = () => {
        axiosInstance.post('employee', { label: label.toLowerCase(), lastName: lastName.toLowerCase() }) //, birth: birth, fiscalCode: fiscalCode
            .then(response => {
                setConfermaAdd(true)
                getEmployees()
            }).catch(error => {
                // console.log("error")
                setShowError(true)
            });
    }

    let deleteEmployeeRecord = () => {
        var emplId = ""
        employees.map((b) => {
            if (b.lastName.toUpperCase() === lastName.toUpperCase()) {
                emplId = b._id
            }
        })
        if (emplId !== "") {
            axiosInstance.delete('employee/' + emplId)
                .then(() => {
                    setConfermaDelete(true)
                    getEmployees()
                }).catch(error => {
                    // console.log("error")
                    setShowError(true)
                });
        } else {
            setConfermaDelete(false)
            setNotFound(label)
        }
        getEmployees()
    }

    return (
        <div>
            {
                !userIsAuthenticatedFlag ? <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert> :
                    <div>
                        <h1 style={{ fontFamily: 'times', marginLeft: '1rem', marginRight: 'auto' }}>Gestione dipendenti</h1>
                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                            <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginRight: '1rem' }} onClick={handleChangeAddEmployeeRecord}>
                                Aggiungi record dipendente
                            </Button>
                            <Button variant="outlined" style={{ color: 'white', backgroundColor: 'blue', marginRight: '1rem' }} onClick={handleChangeGetEmployeeRecord}>
                                Trova record dipendente
                            </Button>
                            {/* <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem', marginRight: '1rem' }} onClick={handleChangeUpdateEmployeeRecord}>
                            Aggiorna record dipendente
                        </Button> */}
                            <Button style={{ color: 'white', backgroundColor: 'red', marginLeft: '1rem' }} onClick={handleChangeDeleteEmployeeRecord}>
                                Elimina record dipendente
                            </Button>
                        </div>
                        {
                            (!addEmployeeRecordFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                <Grow
                                    in={addEmployeeRecordFlag}
                                    style={{ transformOrigin: '0 0 0' }}
                                    {...(addEmployeeRecordFlag ? { timeout: 1000 } : {})}
                                >
                                    <div style={{ marginTop: '2rem' }}>
                                        <div>
                                            <input placeholder="nome" onChange={(event) => { setLabel(event.target.value) }} />
                                            <input placeholder="cognome" onChange={(event) => { setLastName(event.target.value) }} />
                                            {/* <input placeholder="data di nascita (dd/mm/YYYY)" onChange={(event) => { setBirth(event.target.value) }} />
                                <input placeholder="codice fiscale" onChange={(event) => { setFiscalCode(event.target.value) }} /> */}
                                        </div>
                                        <div style={{ marginTop: '2rem' }}>
                                            <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }} onClick={addEmployeeRecord}>Conferma</Button>
                                        </div>
                                    </div>
                                </Grow>
                            </Box>)
                        }
                        {
                            (!getEmployeeRecordFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                <Grow
                                    in={getEmployeeRecordFlag}
                                    style={{ transformOrigin: '0 0 0', width: "50%" }}
                                    {...(getEmployeeRecordFlag ? { timeout: 1000 } : {})}
                                >
                                    <div style={{ marginTop: '2rem' }}>
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={employees}
                                            style={{ marginLeft: 'auto', marginRight: "auto" }}
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="dipendente" />}
                                            onChange={(event, value) => { setEmployeeFound(value) }}
                                        />
                                        {employeeFound === null ? "" : <Card style={{ marginTop: '1rem' }}>
                                            <CardContent style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                        nome
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {employeeFound.label.toUpperCase()}
                                                    </Typography>
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                        cognome
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {employeeFound.lastName.toUpperCase()}
                                                    </Typography>
                                                </div>
                                                {/* <div style={{ marginRight: '3rem' }}>
                                        <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            data di nascita
                                        </Typography>
                                        <Typography variant="h7" component="div">
                                            {employeeFound.birth}
                                        </Typography>
                                    </div>
                                    <div style={{ marginRight: '3rem' }}>
                                        <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            codice fiscale
                                        </Typography>
                                        <Typography variant="h7" component="div">
                                            {employeeFound.fiscalCode}
                                        </Typography>
                                    </div> */}
                                            </CardContent>
                                        </Card>
                                        }
                                    </div>

                                </Grow>
                            </Box>)
                        }
                        {/* {
                            (!updateEmployeeRecordFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                <Grow
                                    in={updateEmployeeRecordFlag}
                                    style={{ transformOrigin: '0 0 0' }}
                                    {...(updateEmployeeRecordFlag ? { timeout: 1000 } : {})}
                                >
                                    <div style={{ marginTop: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                            <input style={{ marginRight: '2rem' }} placeholder="prodotto" onChange={(event) => {
                                                clearTimeout(timerUpd)
                                                setTimeout(() => {
                                                    setLabel(event.target.value)
                                                }, 1000)
                                            }} />
                                            {inheritedQuantity === -1 ? <TextField
                                                disabled
                                                id="outlined-disabled"
                                                label="quantità attuale presente"
                                                value={0}
                                                onChange={(event) => { handleChangeInheritedQuantity(event) }}
                                            /> : <TextField
                                                disabled
                                                id="outlined-disabled"
                                                label="quantità attuale presente"
                                                value={inheritedQuantity}
                                                onChange={(event) => { handleChangeInheritedQuantity(event) }}
                                            />}
                                            {inheritedLowerBound === -1 ? <TextField
                                                disabled
                                                id="outlined-disabled"
                                                label="quantità minima attuale richiesta"
                                                value={0}
                                                onChange={(event) => { handleChangeInheritedLowerBound(event) }}
                                            /> : <TextField
                                                disabled
                                                id="outlined-disabled"
                                                label="quantità minima attuale richiesta"
                                                value={inheritedLowerBound}
                                                onChange={(event) => { handleChangeInheritedLowerBound(event) }}
                                            />}

                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                            <input style={{ marginRight: '2rem' }} placeholder="utente (cognome)" onChange={(event) => { setUser(event.target.value.toLowerCase()) }} />
                                            <TextField
                                                id="outlined-number"
                                                label="quantità"
                                                type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                onChange={(event) => { setQuantity(event.target.value) }}
                                            />
                                            {
                                                inheritedLowerBound === -1 ? <TextField
                                                    id="outlined-number"
                                                    label="quantità minima"
                                                    type="number"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={0}
                                                    onChange={(event) => { setLowerBound(event.target.value) }}
                                                /> : <TextField
                                                    id="outlined-number"
                                                    label="quantità minima"
                                                    type="number"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={inheritedLowerBound}
                                                    onChange={(event) => {
                                                        setLowerBound(event.target.value)
                                                        setInheritedLowerBound(event.target.value)
                                                    }}
                                                />
                                            }

                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                            <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem' }} onClick={() => { updateEmployeeRecord(label, quantity, user, lowerBound) }}>Conferma</Button>
                                        </div>
                                    </div>
                                </Grow>
                            </Box>)
                        } */}
                        {
                            (!deleteEmployeeRecordFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                <Grow
                                    in={deleteEmployeeRecordFlag}
                                    style={{ transformOrigin: '0 0 0' }}
                                    {...(deleteEmployeeRecordFlag ? { timeout: 1000 } : {})}
                                >
                                    <div style={{ marginTop: '2rem' }}>
                                        <div>
                                            <input placeholder="dipendente" onChange={(event) => { setLastName(event.target.value) }} />
                                        </div>
                                        <div style={{ marginTop: '2rem' }}>
                                            <Button style={{
                                                color: 'white', backgroundColor: 'red', marginLeft: '1rem'
                                            }} onClick={() => { deleteEmployeeRecord() }}>Conferma</Button>
                                        </div>
                                    </div>
                                </Grow>
                            </Box>)
                        }
                        <div>
                            {
                                (!confermaAdd) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">dipendente aggiunto correttamente!</Alert>
                            }
                            {
                                (!confermaUpdate) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">dipendente aggiornato correttamente!</Alert>
                            }
                            {
                                (!confermaDelete) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">dipendente eliminato correttamente!</Alert>
                            }
                            {
                                (notFound === "") ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">dipendente {notFound} non trovato! Controlla che il dipendente sia scritto correttamente.</Alert>
                            }
                            {
                                (showError === false) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Errore. Controlla la connessione o i dati inseriti.</Alert>
                            }
                        </div>
                    </div>
            }
        </div >
    );
}

export default Employees;
