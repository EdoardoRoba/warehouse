// import axios from "axios";
import { axiosInstance } from "../config.js"
import * as React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import Autocomplete from '@mui/material/Autocomplete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@mui/material/IconButton';
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import './Classes.css'
import CustomerCard from "./CustomerCard.js";

function MyCalendar() {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(true)
    const [auths, setAuths] = React.useState([])
    const [events, setEvents] = React.useState([])
    const [employees, setEmployees] = React.useState([])
    const [customers, setCustomers] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true);
    const [showError, setShowError] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [titleEvent, setTitleEvent] = React.useState("");
    const [selectedStartDate, setSelectedStartDate] = React.useState();
    const [selectedEndDate, setSelectedEndDate] = React.useState();
    const [selectedStartTime, setSelectedStartTime] = React.useState();
    const [selectedEndTime, setSelectedEndTime] = React.useState();
    const [employeesInvolved, setEmployeesInvolved] = React.useState([])
    const [customerInvolved, setCustomerInvolved] = React.useState([])
    const [customerSelected, setCustomerSelected] = React.useState(null)
    const [eventSelected, setEventSelected] = React.useState(null)
    const [openCustomerCard, setOpenCustomerCard] = React.useState(false);

    const useStyles = makeStyles((theme) => ({
        backdrop: {
            zIndex: 999,
            color: '#fff',
        },
    }));

    const localizer = momentLocalizer(moment)
    const classes = useStyles();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "80%",
        height: "80%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        padding: "0 !important",
        overflowY: 'auto'
    };

    React.useEffect(() => {
        userIsAuthenticated()
        getEvents()
        getEmployees()
        getCustomers()
    }, [])

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowError(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [showError]);

    const userIsAuthenticated = () => {
        if (localStorage.getItem("auths") !== null) {
            if (localStorage.getItem("auths").includes("calendar")) {
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

    const getEvents = () => {
        axiosInstance.get('calendar')
            .then(res => {
                // console.log("customers: ", res.data)
                setEvents(res.data)
                setIsLoading(false)
            }).catch(error => {
                // console.log("error")
                setIsLoading(false)
                setShowError(true)
            });
    }

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

    const onSelectSlot = (event) => {
        // console.log("select slot")
        setSelectedStartDate(event.start)
        setSelectedEndDate(event.end)
        setSelectedStartTime(new Date(
            event.start.getFullYear(),
            event.start.getMonth(),
            event.start.getDate(),
            8,
            0
        )
        )
        setSelectedEndTime(new Date(
            event.end.getFullYear(),
            event.end.getMonth(),
            event.end.getDate(),
            16,
            0
        )
        )
        setOpenModal(true)
    }

    const addCalendar = () => {
        setIsLoading(true)
        axiosInstance.post('calendar', { start: selectedStartTime, end: selectedEndTime, title: titleEvent, employees: employeesInvolved, customer: customerInvolved })
            .then(response => {
                getEvents()
                setIsLoading(false)
                handleCloseModal()
            }).catch(error => {
                // console.log("error")
                setIsLoading(false)
                setShowError(true)
                handleCloseModal()
            });
    }

    const updateCalendar = () => {
        setIsLoading(true)
        axiosInstance.put('calendar/' + eventSelected._id, { start: selectedStartTime, end: selectedEndTime, title: titleEvent, employees: employeesInvolved, customer: customerInvolved })
            .then(response => {
                getEvents()
                setIsLoading(false)
                handleCloseModal()
            }).catch(error => {
                // console.log("error")
                setIsLoading(false)
                setShowError(true)
                handleCloseModal()
            });
    }

    const handleCloseModal = () => {
        setSelectedStartTime()
        setSelectedEndTime()
        setEmployeesInvolved([])
        setCustomerInvolved(null)
        setTitleEvent("")
        setCustomerSelected(null)
        getEvents()
        setEventSelected(null)
        setOpenModal(false)
    }

    const onSelectEvent = (e) => {
        setEventSelected(e)
        setSelectedStartTime(new Date(
            new Date(e.start).getFullYear(),
            new Date(e.start).getMonth(),
            new Date(e.start).getDate(),
            new Date(e.start).getHours(),
            new Date(e.start).getMinutes()
        )
        )
        setSelectedEndTime(new Date(
            new Date(e.end).getFullYear(),
            new Date(e.end).getMonth(),
            new Date(e.end).getDate(),
            new Date(e.end).getHours(),
            new Date(e.end).getMinutes()
        )
        )
        setEmployeesInvolved(e.employees)
        setCustomerInvolved(e.customer)
        setTitleEvent(e.title)
        setCustomerSelected(e.customer)
        setOpenModal(true)
    }

    return (
        <div>
            {
                !userIsAuthenticatedFlag ? <div>
                    <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert>
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}><Button variant="outlined" onClick={() => { window.location.reload(true) }} style={{ color: 'white', backgroundColor: 'green', marginTop: '8rem' }}><Link style={{ color: 'white' }} to={"/login"}>Vai al Login</Link></Button></div>
                </div> :
                    <div>
                        {
                            isLoading ? <Backdrop className={classes.backdrop} open>
                                <CircularProgress color="inherit" />
                            </Backdrop> :
                                <div style={{ marginBottom: "1rem", marginTop: "2rem", width: "90%", marginLeft: "auto", marginRight: "auto" }}>
                                    <Calendar
                                        localizer={localizer}
                                        events={events}
                                        style={{ height: 800 }}
                                        startAccessor="start"
                                        endAccessor="end"
                                        selectable={true}
                                        onSelectSlot={onSelectSlot}
                                        onSelectEvent={onSelectEvent}
                                        views={["month"]} // "week", "day"
                                    />
                                    <Modal
                                        open={openModal}
                                        onClose={() => { handleCloseModal() }}
                                        aria-labelledby="modal-modal-label"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Card sx={style}>
                                            {
                                                eventSelected === null ? <CardHeader
                                                    title="Aggiungi un nuovo evento"
                                                    style={{
                                                        marginBottom: '1rem', display: 'flex', justifyContent: 'center', textAlign: 'center', width: "100%", backgroundColor: "#1976d2", minHeight: "80px",
                                                        color: "white",
                                                        // paddingLeft: 5
                                                    }}
                                                /> : <CardHeader
                                                    title="Consulta o aggiorna l'evento"
                                                    style={{
                                                        marginBottom: '1rem', display: 'flex', justifyContent: 'center', textAlign: 'center', width: "100%", backgroundColor: "#1976d2", minHeight: "80px",
                                                        color: "white",
                                                        // paddingLeft: 5
                                                    }}
                                                />
                                            }

                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                    {
                                                        eventSelected === null ? <TextField
                                                            id="standard-search"
                                                            label="Titolo dell'evento"
                                                            type="search"
                                                            variant="standard"
                                                            onChange={(e) => {
                                                                setTitleEvent(e.target.value)
                                                            }}
                                                            xs={12}
                                                            sm={6}
                                                            style={{ marginTop: "3rem", width: "80%" }}
                                                        /> : <TextField
                                                            id="standard-search"
                                                            label="Titolo dell'evento"
                                                            type="search"
                                                            defaultValue={eventSelected.title}
                                                            variant="standard"
                                                            onChange={(e) => {
                                                                setTitleEvent(e.target.value)
                                                            }}
                                                            xs={12}
                                                            sm={6}
                                                            style={{ marginTop: "3rem", width: "80%" }}
                                                        />
                                                    }

                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: "3rem" }}>
                                                    <TimePicker
                                                        label="inizio"
                                                        value={selectedStartTime}
                                                        onChange={(date) => {
                                                            setSelectedStartTime(date)
                                                        }}
                                                    />
                                                    <TimePicker
                                                        label="fine"
                                                        value={selectedEndTime}
                                                        onChange={(date) => {
                                                            setSelectedEndTime(date)
                                                        }}

                                                    />
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: "3rem" }}>
                                                    {
                                                        eventSelected === null ? <Autocomplete
                                                            multiple
                                                            id="tags-standard"
                                                            style={{ width: "40%" }}
                                                            options={employees}
                                                            getOptionLabel={(option) => option.label}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    variant="standard"
                                                                    label="Dipendenti coinvolti"
                                                                    placeholder="dipendenti coinvolti"
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                if (value !== null) {
                                                                    setEmployeesInvolved(value)
                                                                }
                                                            }}
                                                        /> : <Autocomplete
                                                            multiple
                                                            id="tags-standard"
                                                            style={{ width: "40%" }}
                                                            options={employees}
                                                            defaultValue={eventSelected.employees}
                                                            getOptionLabel={(option) => option.label}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    variant="standard"
                                                                    label="Dipendenti coinvolti"
                                                                    placeholder="dipendenti coinvolti"
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                if (value !== null) {
                                                                    setEmployeesInvolved(value)
                                                                }
                                                            }}
                                                        />
                                                    }
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: "3rem" }}>
                                                    {
                                                        eventSelected === null ? <Autocomplete
                                                            id="tags-standard"
                                                            style={{ width: "40%" }}
                                                            options={customers}
                                                            getOptionLabel={(option) => option.nome_cognome}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    variant="standard"
                                                                    label="Cliente"
                                                                    placeholder="cliente"
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                if (value !== null) {
                                                                    setCustomerInvolved(value)
                                                                }
                                                            }}
                                                        /> : <div>
                                                            <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                cliente
                                                            </Typography><IconButton onClick={() => {
                                                                setOpenCustomerCard(true)
                                                            }}>
                                                                <Typography sx={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h4" component="h2">
                                                                    {customerInvolved.nome_cognome}
                                                                </Typography>
                                                            </IconButton>
                                                        </div>
                                                    }
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: "8rem" }}>
                                                    {
                                                        eventSelected === null ? <Button disabled={customerInvolved === null || customerInvolved === "" || employeesInvolved === null || employeesInvolved.length === 0 || titleEvent === ""}
                                                            variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginRight: '1rem' }}
                                                            onClick={() => { addCalendar() }}>
                                                            Aggiungi evento
                                                        </Button> : <Button
                                                            variant="outlined" style={{ color: 'white', backgroundColor: '#ffae1b', marginRight: '1rem' }}
                                                            onClick={() => { updateCalendar() }}>
                                                            Aggiorna evento
                                                        </Button>
                                                    }
                                                </div>
                                                {
                                                    customerSelected === null ? "" : <div>
                                                        <Modal
                                                            open={openCustomerCard}
                                                            onClose={() => { setOpenCustomerCard(false) }}
                                                            aria-labelledby="modal-modal-label"
                                                            aria-describedby="modal-modal-description"
                                                        >
                                                            <Box sx={style} style={{ maxHeight: '80%', overflowY: 'auto', marginTop: 'auto', marginBottom: 'auto', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <CustomerCard customerSelected={customerSelected} />
                                                            </Box>
                                                        </Modal>
                                                    </div>
                                                }
                                            </MuiPickersUtilsProvider>
                                        </Card>
                                    </Modal>
                                </div >
                        }
                    </div>
            }
            {
                (showError === false) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Upload fallito. Controlla connessione e formato dei dati.</Alert>
            }
        </div>
    );
}

export default MyCalendar;
