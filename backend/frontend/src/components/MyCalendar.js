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
import ReplayIcon from '@material-ui/icons/Replay';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { TimePicker, MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
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
    const [type, setType] = React.useState("");
    const [filterCustomer, setFilterCustomer] = React.useState("");
    const [filterEmployee, setFilterEmployee] = React.useState("");
    const [selectedStartDate, setSelectedStartDate] = React.useState();
    const [selectedEndDate, setSelectedEndDate] = React.useState();
    const [selectedStartTime, setSelectedStartTime] = React.useState();
    const [selectedEndTime, setSelectedEndTime] = React.useState();
    const [employeesInvolved, setEmployeesInvolved] = React.useState([])
    const [customerInvolved, setCustomerInvolved] = React.useState([])
    const [customerSelected, setCustomerSelected] = React.useState(null)
    const [eventSelected, setEventSelected] = React.useState(null)
    const [openCustomerCard, setOpenCustomerCard] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    const useStyles = makeStyles((theme) => ({
        backdrop: {
            zIndex: 999,
            color: '#fff',
        },
    }));

    moment.locale('ko', {
        week: {
            dow: 1
        },
    });
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
        let user = ""
        if (localStorage.getItem("profile") === "admin") {
            user = "admin"
        } else {
            user = localStorage.getItem("user").replaceAll(".", "_")
        }
        axiosInstance.get('calendar', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { user: user } }) //, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
            .then(res => {
                // console.log("customers: ", res.data)
                for (let e of res.data) {
                    e.start = new Date(e.start)
                    e.end = new Date(e.end)
                }
                setEvents(res.data)
                setIsLoading(false)
            }).catch(error => {
                // console.log("error")
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
                setIsLoading(false)
                setShowError(true)
            });
    }

    const getEmployees = async () => {
        axiosInstance.get('employee', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(res => {
                // console.log("Employees: ", res.data)
                setEmployees(res.data)
            }).catch(error => {
                // console.log("error")
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
            });
    }

    const getCustomers = async () => {
        axiosInstance.get('customer', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(res => {
                // console.log("Customers: ", res.data)
                setCustomers(res.data)
            }).catch(error => {
                // console.log("error")
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
            });
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

    const handleOpenCustomerCard = () => {
        axiosInstance.get("customer/" + customerSelected._id, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
            setCustomerSelected(respp.data)
            setOpenCustomerCard(true)
        }).catch((error) => {
            if (error.response.status === 401) {
                userIsAuthenticated()
            }
        })
    }

    const updateExternalEmployees = async (externalEmployees) => {
        // console.log(externalEmployees)
        var is = []
        for (let extE of externalEmployees) {
            if (extE.visibleCustomers.filter(e => e.nome_cognome === customerInvolved.nome_cognome).length === 0) {
                var newField = {}
                newField.visibleCustomers = extE.visibleCustomers.concat(customerInvolved)
                is.push(axiosInstance.put('employee/' + extE._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }))
            }
        }
        is = await Promise.allSettled(is)
        console.log("dipendenti esterni aggiornati!")
    }

    const updateCustomer = () => {
        let newField = {}
        newField["tecnico_" + type] = employeesInvolved.map((eI) => eI.lastName.toUpperCase()).join("-")
        if (type === "installazione" && (new Date(selectedStartTime).getDate()) !== (new Date(selectedEndTime).getDate())) {
            newField["data_" + type] = (new Date(selectedStartTime).getDate()).toString().padStart(2, "0") + "/" + (new Date(selectedStartTime).getMonth() + 1).toString().padStart(2, "0") + "/" + (new Date(selectedStartTime).getFullYear()).toString() + " - " + (new Date(selectedEndTime).getDate()).toString().padStart(2, "0") + "/" + (new Date(selectedEndTime).getMonth()).toString().padStart(2, "0") + "/" + (new Date(selectedEndTime).getFullYear()).toString()
        } else {
            newField["data_" + type] = (new Date(selectedStartTime).getDate()).toString().padStart(2, "0") + "/" + (new Date(selectedStartTime).getMonth() + 1).toString().padStart(2, "0") + "/" + (new Date(selectedStartTime).getFullYear()).toString()
        }
        // console.log(newField)
        axiosInstance.put("customer/" + customerInvolved._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
            console.log("aggiornato!")
            setIsLoading(false)
        }).catch((error) => {
            setIsLoading(false)
            if (error.response.status === 401) {
                userIsAuthenticated()
            }
        })
    }

    const addCalendar = () => {
        setIsLoading(true)
        let externalEmployees = employeesInvolved.filter((eI) => eI.external)
        axiosInstance.post('calendar', { start: selectedStartTime, end: selectedEndTime, title: titleEvent, employees: employeesInvolved, customer: customerInvolved, type: type }, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(response => {
                getEvents()
                if (type !== "appuntamento") {
                    updateCustomer()
                }
                if (externalEmployees.length > 0) {
                    updateExternalEmployees(externalEmployees)
                }
                handleCloseModal()
            }).catch(error => {
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
                setIsLoading(false)
                setShowError(true)
                handleCloseModal()
            });
    }

    const updateCalendar = () => {
        setIsLoading(true)
        let externalEmployees = employeesInvolved.filter((eI) => eI.external)
        axiosInstance.put('calendar/' + eventSelected._id, { start: selectedStartTime, end: selectedEndTime, title: titleEvent, employees: employeesInvolved, customer: customerInvolved, type: type }, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(response => {
                getEvents()
                if (type !== "appuntamento") {
                    updateCustomer()
                }
                if (externalEmployees.length > 0) {
                    updateExternalEmployees(externalEmployees)
                }
                handleCloseModal()
            }).catch(error => {
                // console.log("error")
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
                setIsLoading(false)
                setShowError(true)
                handleCloseModal()
            });
    }

    const deleteCalendar = () => {
        setIsLoading(true)
        axiosInstance.delete('calendar/' + eventSelected._id, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(() => {
                getEvents()
                handleCloseModal()
            }).catch(error => {
                // console.log("error")
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
                setIsLoading(false)
                setShowError(true)
                handleCloseModal()
            });
    }

    const handleCloseModal = () => {
        setEventSelected(null)
        setSelectedStartTime()
        setSelectedEndTime()
        setEmployeesInvolved([])
        setCustomerInvolved(null)
        setTitleEvent("")
        setType("")
        setCustomerSelected(null)
        getEvents()
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
        setType(e.type)
        setCustomerSelected(e.customer)
        setOpenModal(true)
    }

    const showFilteredCalendar = (value, type) => {
        if (value !== null) {
            setIsLoading(true)
            let user = ""
            if (localStorage.getItem("profile") === "admin") {
                user = "admin"
            } else {
                user = localStorage.getItem("user").replaceAll(".", "_")
            }
            let filter = {}
            let valFilter = ""
            if (type === "customer") {
                valFilter = value.nome_cognome
            } else {
                valFilter = value.lastName
            }
            filter.user = user
            filter[type] = valFilter
            axiosInstance.get('calendar', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: filter }).then((res) => { //, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
                setEvents(res.data)
                setIsLoading(false)
            }).catch(error => {
                console.log(error)
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
                setIsLoading(false)
                setShowError(true)
            });
        }
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
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ marginBottom: "2rem" }} justifyContent="center">
                                        <Autocomplete
                                            disablePortal
                                            item xs={12} sm={4}
                                            id="combo-box-demo"
                                            options={customers}
                                            style={{ marginLeft: 'auto', marginRight: "auto" }}
                                            sx={{ width: 300 }}
                                            getOptionLabel={option => option.nome_cognome.toUpperCase()}
                                            renderInput={(params) => <TextField {...params} label="filtra per cliente" />}
                                            onChange={(event, value) => {
                                                showFilteredCalendar(value, "customer")
                                                setFilterCustomer(value.nome_cognome)
                                                setFilterEmployee("")
                                            }
                                            }
                                        />
                                        {
                                            filterCustomer === "" && filterEmployee === "" ? "" : <div>
                                                <Typography sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h7" component="h7">
                                                    Filtrato per:
                                                </Typography>
                                                <Typography sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h6">
                                                    {filterCustomer}{filterEmployee}
                                                </Typography>
                                            </div>
                                        }
                                        <Autocomplete
                                            disablePortal
                                            item xs={12} sm={4}
                                            id="combo-box-demo"
                                            options={employees}
                                            style={{ marginLeft: 'auto', marginRight: "auto" }}
                                            sx={{ width: 300 }}
                                            getOptionLabel={option => option.label.toUpperCase()}
                                            renderInput={(params) => <TextField {...params} label="filtra per dipendente" />}
                                            onChange={(event, value) => {
                                                showFilteredCalendar(value, "employee")
                                                setFilterEmployee(value.label)
                                                setFilterCustomer("")
                                            }
                                            }
                                        />
                                        <Tooltip item xs={12} sm={4} sx={{ marginRight: '1rem' }} title={"Azzera filtri"}>
                                            <IconButton
                                                onClick={() => {
                                                    getEvents()
                                                    setFilterCustomer("")
                                                    setFilterEmployee("")
                                                }}>
                                                <ReplayIcon style={{ fontSize: "30px" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid >
                                    <Calendar
                                        localizer={localizer}
                                        events={events}
                                        style={{ height: 800 }}
                                        startAccessor="start"
                                        endAccessor="end"
                                        selectable={true}
                                        onSelectSlot={onSelectSlot}
                                        onSelectEvent={onSelectEvent}
                                        views={["month", "day"]} // "week", "day"
                                    />
                                    <Modal
                                        open={openModal}
                                        onClose={() => { handleCloseModal() }}
                                        aria-labelledby="modal-modal-label"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Card container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={style}>
                                            {
                                                eventSelected === null ? <CardHeader
                                                    title="Aggiungi un nuovo evento"
                                                    item xs={12} sm={6}
                                                    style={{
                                                        marginBottom: '1rem', display: 'flex', justifyContent: 'center', textAlign: 'center', width: "100%", backgroundColor: "#1976d2", minHeight: "80px",
                                                        color: "white",
                                                        // paddingLeft: 5
                                                    }}
                                                /> : <CardHeader
                                                    title="Consulta o aggiorna l'evento"
                                                    item xs={12} sm={6}
                                                    style={{
                                                        marginBottom: '1rem', display: 'flex', justifyContent: 'center', textAlign: 'center', width: "100%", backgroundColor: "#1976d2", minHeight: "80px",
                                                        color: "white",
                                                        // paddingLeft: 5
                                                    }}
                                                />
                                            }

                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                {
                                                    auths["calendar"] !== "*" && eventSelected === null ?
                                                        <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert>
                                                        : <div>
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

                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                                                {
                                                                    eventSelected === null ? <div>
                                                                        <Button
                                                                            id="demo-positioned-button"
                                                                            aria-controls={openMenu ? 'demo-positioned-menu' : undefined}
                                                                            aria-haspopup="true"
                                                                            aria-expanded={openMenu ? 'true' : undefined}
                                                                            onClick={(event) => {
                                                                                setAnchorEl(event.currentTarget)
                                                                            }}
                                                                        >
                                                                            Tipo di appuntamento
                                                                        </Button>
                                                                        <Typography sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h6">
                                                                            {type}
                                                                        </Typography>
                                                                    </div> : <div>
                                                                        <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                            Tipo di appuntamento
                                                                        </Typography>
                                                                        <Typography sx={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h6">
                                                                            {eventSelected.type}
                                                                        </Typography>
                                                                    </div>
                                                                }
                                                                <Menu
                                                                    id="demo-positioned-menu"
                                                                    aria-labelledby="demo-positioned-button"
                                                                    anchorEl={anchorEl}
                                                                    open={openMenu}
                                                                    onClose={() => {
                                                                        setAnchorEl(null)
                                                                    }}
                                                                    anchorOrigin={{
                                                                        vertical: 'top',
                                                                        horizontal: 'left',
                                                                    }}
                                                                    transformOrigin={{
                                                                        vertical: 'top',
                                                                        horizontal: 'left',
                                                                    }}
                                                                >
                                                                    <MenuItem onClick={() => {
                                                                        setType("installazione")
                                                                        setAnchorEl(null)
                                                                    }}>Installazione</MenuItem>
                                                                    <MenuItem onClick={() => {
                                                                        setType("sopralluogo")
                                                                        setAnchorEl(null)
                                                                    }}>Sopralluogo</MenuItem>
                                                                    <MenuItem onClick={() => {
                                                                        setType("assistenza")
                                                                        setAnchorEl(null)
                                                                    }}>Assistenza</MenuItem>
                                                                    <MenuItem onClick={() => {
                                                                        setType("appuntamento")
                                                                        setAnchorEl(null)
                                                                    }}>Appuntamento</MenuItem>
                                                                </Menu>
                                                            </div>

                                                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: "2rem" }}>
                                                                {
                                                                    eventSelected === null ? <div>
                                                                        <TimePicker
                                                                            label="inizio"
                                                                            value={selectedStartTime}
                                                                            item xs={12} sm={6}
                                                                            // style={{ width: "90%" }}
                                                                            onChange={(date) => {
                                                                                setSelectedStartTime(date)
                                                                            }}
                                                                        />
                                                                        <TimePicker
                                                                            label="fine"
                                                                            value={selectedEndTime}
                                                                            item xs={12} sm={6}
                                                                            // style={{ width: "90%" }}
                                                                            onChange={(date) => {
                                                                                setSelectedEndTime(date)
                                                                            }}
                                                                        />
                                                                    </div> : <div>
                                                                        {
                                                                            localStorage.getItem("user") !== "admin" ? <DateTimePicker
                                                                                label="inizio"
                                                                                readOnly
                                                                                value={selectedStartTime}
                                                                                item xs={12} sm={6}
                                                                                // style={{ width: "90%" }}
                                                                                onChange={(date) => {
                                                                                    setSelectedStartTime(date)
                                                                                }}
                                                                            /> : <DateTimePicker
                                                                                label="inizio"
                                                                                value={selectedStartTime}
                                                                                item xs={12} sm={6}
                                                                                // style={{ width: "90%" }}
                                                                                onChange={(date) => {
                                                                                    setSelectedStartTime(date)
                                                                                }}
                                                                            />
                                                                        }
                                                                        {
                                                                            localStorage.getItem("user") !== "admin" ? <DateTimePicker
                                                                                label="fine"
                                                                                readOnly
                                                                                value={selectedEndTime}
                                                                                item xs={12} sm={6}
                                                                                // style={{ width: "90%" }}
                                                                                onChange={(date) => {
                                                                                    setSelectedEndTime(date)
                                                                                }}
                                                                            /> : <DateTimePicker
                                                                                label="fine"
                                                                                value={selectedEndTime}
                                                                                item xs={12} sm={6}
                                                                                // style={{ width: "90%" }}
                                                                                onChange={(date) => {
                                                                                    setSelectedEndTime(date)
                                                                                }}
                                                                            />
                                                                        }
                                                                    </div>
                                                                }
                                                            </Grid>
                                                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: "3rem" }}>
                                                                {
                                                                    eventSelected === null ? <Autocomplete
                                                                        multiple
                                                                        id="tags-standard"
                                                                        // item xs={12} sm={12}
                                                                        style={{ width: "50%" }}
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
                                                                    /> : <div>
                                                                        {
                                                                            localStorage.getItem("user") !== "admin" ? <Autocomplete
                                                                                multiple
                                                                                id="tags-standard"
                                                                                readOnly
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
                                                                            /> : <Autocomplete
                                                                                multiple
                                                                                id="tags-standard"
                                                                                // item xs={12} sm={12}
                                                                                // style={{ width: "50%" }}
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
                                                                }
                                                            </Grid>
                                                            {
                                                                type === "appuntamento" || type === "admin" ? "" : <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: "3rem" }}>
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
                                                                                handleOpenCustomerCard()
                                                                            }}>
                                                                                <Typography sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h4" component="h2">
                                                                                    {customerInvolved.nome_cognome}
                                                                                </Typography>
                                                                            </IconButton>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            }
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: "4rem" }}>
                                                                {
                                                                    eventSelected === null ? <Button disabled={titleEvent === "" || type === null || type === ""}
                                                                        variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginBottom: '1rem' }}
                                                                        onClick={() => { addCalendar() }}>
                                                                        Aggiungi evento
                                                                    </Button> : <div>
                                                                        {
                                                                            localStorage.getItem("user") !== "admin" ? "" : <Button
                                                                                variant="outlined" style={{ color: 'white', backgroundColor: '#ffae1b', marginBottom: '1rem' }}
                                                                                onClick={() => { updateCalendar() }}>
                                                                                Aggiorna evento
                                                                            </Button>
                                                                        }
                                                                        {
                                                                            localStorage.getItem("user") !== "admin" ? "" : <Button
                                                                                variant="outlined" style={{ color: 'white', backgroundColor: 'red', marginBottom: '1rem' }}
                                                                                onClick={() => { deleteCalendar() }}>
                                                                                Elimina evento
                                                                            </Button>
                                                                        }
                                                                    </div>
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
                (showError === false) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Error. Controlla connessione, formato dei dati o ricarica la pagina.</Alert>
            }
        </div>
    );
}

export default MyCalendar;
