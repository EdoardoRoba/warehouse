// import axios from "axios";
import { axiosInstance } from "../config.js"
import * as React from "react";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grow from '@mui/material/Grow';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import './Classes.css'
import { external } from "jszip";

function Employees(props) {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(true)
    const [addEmployeeRecordFlag, setAddEmployeeRecordFlag] = React.useState(false);
    const [getEmployeeRecordFlag, setGetEmployeeRecordFlag] = React.useState(false);
    const [updateEmployeeRecordFlag, setUpdateEmployeeRecordFlag] = React.useState(false);
    const [deleteEmployeeRecordFlag, setDeleteEmployeeRecordFlag] = React.useState(false);
    const [name, setName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [birth, setBirth] = React.useState("")
    const [fiscalCode, setFiscalCode] = React.useState("")
    const [employees, setEmployees] = React.useState([])
    const [confermaAdd, setConfermaAdd] = React.useState(false);
    const [confermaUpdate, setConfermaUpdate] = React.useState(false);
    const [confermaDelete, setConfermaDelete] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    const [notFound, setNotFound] = React.useState("");
    const [employeeFound, setEmployeeFound] = React.useState("");
    const [showQuestionDelete, setShowQuestionDelete] = React.useState(false);
    const [auths, setAuths] = React.useState([])
    const [visibleCustomers, setVisibleCustomers] = React.useState([])
    const [customers, setCustomers] = React.useState([])
    const [checkedCheckbox, setCheckedCheckbox] = React.useState(false);

    React.useEffect(() => {
        getEmployees()
        userIsAuthenticated()
        getCustomers()
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
        if (localStorage.getItem("auths") !== null) {
            if (localStorage.getItem("auths").includes("employees")) {
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

    const handleChangeAddEmployeeRecord = () => {
        setAddEmployeeRecordFlag((prev) => !prev);
        setUpdateEmployeeRecordFlag(false);
        setDeleteEmployeeRecordFlag(false);
        setGetEmployeeRecordFlag(false);
        setName("")
        setLastName("")
        setBirth("")
        setFiscalCode("")
        setEmployeeFound(null)
        setShowQuestionDelete(false)
        setCheckedCheckbox(false)
        setVisibleCustomers([])
    };

    const handleChangeGetEmployeeRecord = () => {
        setGetEmployeeRecordFlag((prev) => !prev);
        setUpdateEmployeeRecordFlag(false);
        setDeleteEmployeeRecordFlag(false);
        setAddEmployeeRecordFlag(false);
        setName("")
        setLastName("")
        setBirth("")
        setFiscalCode("")
        setEmployeeFound(null)
        setShowQuestionDelete(false)
        setCheckedCheckbox(false)
        setVisibleCustomers([])
    };

    const handleChangeUpdateEmployeeRecord = () => {
        setUpdateEmployeeRecordFlag((prev) => !prev);
        setAddEmployeeRecordFlag(false);
        setDeleteEmployeeRecordFlag(false);
        setGetEmployeeRecordFlag(false);
        setName("")
        setLastName("")
        setBirth("")
        setFiscalCode("")
        setEmployeeFound(null)
        setShowQuestionDelete(false)
        setCheckedCheckbox(false)
        setVisibleCustomers([])
    };

    const handleChangeDeleteEmployeeRecord = () => {
        setDeleteEmployeeRecordFlag((prev) => !prev);
        setAddEmployeeRecordFlag(false);
        setUpdateEmployeeRecordFlag(false);
        setGetEmployeeRecordFlag(false);
        setName("")
        setLastName("")
        setBirth("")
        setFiscalCode("")
        setEmployeeFound(null)
        setShowQuestionDelete(false)
        setCheckedCheckbox(false)
        setVisibleCustomers([])
    };

    const getEmployees = async () => {
        axiosInstance.get('employee')
            .then(res => {
                // console.log("Employees: ", res.data)
                setEmployees(res.data)
            })
    }

    const getCustomers = async () => {
        axiosInstance.get('customer')
            .then(res => {
                // console.log("Customers: ", res.data)
                setCustomers(res.data)
            })
    }

    let addEmployeeRecord = () => {
        axiosInstance.post('employee', { name: name.toLowerCase(), lastName: lastName.toLowerCase(), label: name.toLowerCase() + " " + lastName.toLowerCase(), email: email, external: checkedCheckbox, visibleCustomers: visibleCustomers }) //, birth: birth, fiscalCode: fiscalCode
            .then(response => {
                setConfermaAdd(true)
                getEmployees()
            }).catch(error => {
                // console.log("error")
                setShowError(true)
            });
    }

    let updateEmployeeRecord = () => {
        axiosInstance.put('employee/' + employeeFound._id, { visibleCustomers: visibleCustomers }) //, birth: birth, fiscalCode: fiscalCode
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
            setNotFound(lastName)
        }
        getEmployees()
    }

    const handleChangeCheckbox = (event) => {
        // console.log(event.target.value)
        setCheckedCheckbox(event.target.checked);
    };

    return (
        <div>
            {
                !userIsAuthenticatedFlag ? <div>
                    <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert>
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}><Button variant="outlined" onClick={() => { window.location.reload(true) }} style={{ color: 'white', backgroundColor: 'green', marginTop: '8rem' }}><Link style={{ color: 'white' }} to={"/login"}>Vai al Login</Link></Button></div>
                </div> :
                    <div>
                        <h1 style={{ fontFamily: 'times', marginLeft: '1rem', marginRight: 'auto' }}>Gestione dipendenti</h1>
                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                            <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginRight: '1rem' }} onClick={handleChangeAddEmployeeRecord}>
                                Aggiungi record dipendente
                            </Button>
                            <Button variant="outlined" style={{ color: 'white', backgroundColor: 'blue', marginRight: '1rem' }} onClick={handleChangeGetEmployeeRecord}>
                                Trova record dipendente
                            </Button>
                            <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem', marginRight: '1rem' }} onClick={handleChangeUpdateEmployeeRecord}>
                                Aggiorna record dipendente
                            </Button>
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
                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>

                                            <input item xs={12} sm={4} placeholder="nome" onChange={(event) => { setName(event.target.value) }} />
                                            <input item xs={12} sm={4} placeholder="cognome" onChange={(event) => { setLastName(event.target.value) }} />
                                            <input item xs={12} sm={4} placeholder="email" onChange={(event) => { setEmail(event.target.value) }} />
                                            {/* <input placeholder="data di nascita (dd/mm/YYYY)" onChange={(event) => { setBirth(event.target.value) }} />
                                <input placeholder="codice fiscale" onChange={(event) => { setFiscalCode(event.target.value) }} /> */}
                                        </Grid>
                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1rem' }}>
                                            <FormControlLabel
                                                value={!checkedCheckbox}
                                                control={<Checkbox
                                                    item xs={12} sm={4}
                                                    checked={checkedCheckbox}
                                                    label={"Esterno"}
                                                    onChange={handleChangeCheckbox}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />}
                                                label="Esterno"
                                                labelPlacement="end"
                                            />
                                        </Grid>
                                        {
                                            !checkedCheckbox ? "" : <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1rem' }}>
                                                <Autocomplete
                                                    multiple
                                                    id="tags-standard"
                                                    item xs={12} sm={6}
                                                    style={{ width: "80%" }}
                                                    options={customers}
                                                    // defaultValue={eventSelected.employees}
                                                    getOptionLabel={(option) => option.nome_cognome}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                            label="Clienti visibili"
                                                            placeholder="clienti visibili"
                                                        />
                                                    )}
                                                    onChange={(event, value) => {
                                                        if (value !== null) {
                                                            setVisibleCustomers(value)
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        }
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
                                            <CardContent>
                                                <div>
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1rem' }}>
                                                        <div item xs={12} sm={6} style={{ marginRight: '3rem' }}>
                                                            <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                                nome
                                                            </Typography>
                                                            <Typography variant="h7" component="div">
                                                                {employeeFound.name.toUpperCase()}
                                                            </Typography>
                                                        </div>
                                                        <div item xs={12} sm={6} style={{ marginRight: '3rem' }}>
                                                            <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                                cognome
                                                            </Typography>
                                                            <Typography variant="h7" component="div">
                                                                {employeeFound.lastName.toUpperCase()}
                                                            </Typography>
                                                        </div>
                                                    </Grid>
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1rem' }}>
                                                        {
                                                            !employeeFound.external ? "" :
                                                                <Autocomplete
                                                                    multiple
                                                                    id="tags-standard"
                                                                    item xs={12} sm={6}
                                                                    style={{ width: "80%" }}
                                                                    readOnly
                                                                    options={customers}
                                                                    defaultValue={employeeFound.visibleCustomers}
                                                                    getOptionLabel={(option) => option.nome_cognome}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            variant="standard"
                                                                            label="Clienti visibili"
                                                                            placeholder="clienti visibili"
                                                                        />
                                                                    )}
                                                                    onChange={(event, value) => {
                                                                        if (value !== null) {
                                                                            setVisibleCustomers(value)
                                                                        }
                                                                    }}
                                                                />
                                                        }
                                                    </Grid>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        }
                                    </div>

                                </Grow>
                            </Box>)
                        }
                        {
                            (!updateEmployeeRecordFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                <Grow
                                    in={updateEmployeeRecordFlag}
                                    style={{ transformOrigin: '0 0 0', width: "50%" }}
                                    {...(updateEmployeeRecordFlag ? { timeout: 1000 } : {})}
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
                                            <CardContent>
                                                <div>
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1rem' }}>
                                                        <div item xs={12} sm={6} style={{ marginRight: '3rem' }}>
                                                            <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                                nome
                                                            </Typography>
                                                            <Typography variant="h7" component="div">
                                                                {employeeFound.name.toUpperCase()}
                                                            </Typography>
                                                        </div>
                                                        <div item xs={12} sm={6} style={{ marginRight: '3rem' }}>
                                                            <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                                cognome
                                                            </Typography>
                                                            <Typography variant="h7" component="div">
                                                                {employeeFound.lastName.toUpperCase()}
                                                            </Typography>
                                                        </div>
                                                    </Grid>
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1rem' }}>
                                                        {
                                                            !employeeFound.external ? "" :
                                                                <Autocomplete
                                                                    multiple
                                                                    id="tags-standard"
                                                                    item xs={12} sm={6}
                                                                    style={{ width: "80%" }}
                                                                    options={customers}
                                                                    defaultValue={employeeFound.visibleCustomers}
                                                                    getOptionLabel={(option) => option.nome_cognome}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            variant="standard"
                                                                            label="Clienti visibili"
                                                                            placeholder="clienti visibili"
                                                                        />
                                                                    )}
                                                                    onChange={(event, value) => {
                                                                        if (value !== null) {
                                                                            setVisibleCustomers(value)
                                                                        }
                                                                    }}
                                                                />
                                                        }
                                                    </Grid>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        }
                                        <div style={{ marginTop: '2rem' }}>
                                            <Button variant="outlined" style={{ color: 'white', backgroundColor: '#ffae1b' }} onClick={updateEmployeeRecord}>Aggiorna</Button>
                                        </div>
                                    </div>
                                </Grow>
                            </Box>)
                        }
                        {
                            (!deleteEmployeeRecordFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                <Grow
                                    in={deleteEmployeeRecordFlag}
                                    style={{ transformOrigin: '0 0 0' }}
                                    {...(deleteEmployeeRecordFlag ? { timeout: 1000 } : {})}
                                >
                                    <div style={{ marginTop: '2rem' }}>
                                        <div>
                                            <input placeholder="dipendente (cognome)" onChange={(event) => { setLastName(event.target.value) }} />
                                        </div>
                                        <div style={{ marginTop: '2rem' }}>
                                            <Button style={{
                                                color: 'white', backgroundColor: 'red', marginLeft: '1rem'
                                            }} onClick={() => { setShowQuestionDelete(true) }}>Conferma</Button>
                                        </div>
                                        {
                                            !showQuestionDelete ? "" : <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1rem' }}>
                                                <Typography variant="subtitle1" gutterBottom component="div">
                                                    Sei sicuro di voler cancellare i dati del dipendente {lastName.toUpperCase()}?
                                                </Typography>
                                                <Button style={{ color: 'white', backgroundColor: 'red', marginLeft: '1rem' }} onClick={() => { deleteEmployeeRecord() }}>Sì</Button>
                                            </div>
                                        }
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
