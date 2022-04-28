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
import Timeline, {
    TimelineHeaders,
    SidebarHeader,
    DateHeader,
} from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'

function Gestionale() {

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
    const [groups, setGroups] = React.useState([])
    const [items, setItems] = React.useState([])
    const [customerSelected, setCustomerSelected] = React.useState(null)
    const [eventSelected, setEventSelected] = React.useState(null)
    const [openCustomerCard, setOpenCustomerCard] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    // // const groups = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' }]
    // const items = [
    //     {
    //         id: 1,
    //         group: 1,
    //         title: 'item 1',
    //         start_time: moment(),
    //         end_time: moment().add(1, 'hour')
    //     },
    //     {
    //         id: 2,
    //         group: 2,
    //         title: 'item 2',
    //         start_time: moment().add(-0.5, 'hour'),
    //         end_time: moment().add(0.5, 'hour')
    //     },
    //     {
    //         id: 3,
    //         group: 1,
    //         title: 'item 3',
    //         start_time: moment().add(2, 'hour'),
    //         end_time: moment().add(3, 'hour')
    //     }
    // ]

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
            if (localStorage.getItem("auths").includes("gestionale")) {
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
                // const items = [
                //     {
                //         id: 1,
                //         group: 1,
                //         title: 'item 1',
                //         start_time: moment(),
                //         end_time: moment().add(1, 'hour')
                //     },
                //     {
                //         id: 2,
                //         group: 2,
                //         title: 'item 2',
                //         start_time: moment().add(-0.5, 'hour'),
                //         end_time: moment().add(0.5, 'hour')
                //     },
                //     {
                //         id: 3,
                //         group: 1,
                //         title: 'item 3',
                //         start_time: moment().add(2, 'hour'),
                //         end_time: moment().add(3, 'hour')
                //     }
                // ]
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
                let gps = res.data.map((e, idx) => {
                    e.title = e.lastName
                    e.id = e.lastName
                    return e
                })
                setGroups(gps)
                // let gps = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' }]
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
        // nome, tipo app, azienda, termico/eletttrico
        let newEvent = {}
        if (type === "appuntamento") {
            newEvent = { start: selectedStartTime, end: selectedEndTime, title: titleEvent, employees: employeesInvolved, customer: customerInvolved, type: type }
        } else {
            let titleNewEvent = customerInvolved.nome_cognome.toUpperCase() + "-" + type.toUpperCase() + "-" + customerInvolved.company.toUpperCase() + "-" + customerInvolved.termico_elettrico.toUpperCase()
            newEvent = { start: selectedStartTime, end: selectedEndTime, title: titleNewEvent, employees: employeesInvolved, customer: customerInvolved, type: type }
        }
        axiosInstance.post('calendar', newEvent, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
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
                                    {/* <Calendar
                                        localizer={localizer}
                                        events={events}
                                        style={{ height: 800 }}
                                        startAccessor="start"
                                        endAccessor="end"
                                        selectable={true}
                                        onSelectSlot={onSelectSlot}
                                        onSelectEvent={onSelectEvent}
                                        views={["month", "week", "day"]} // "week", "day"
                                    /> */}
                                    <Timeline
                                        groups={groups}
                                        items={items}
                                        defaultTimeStart={moment().add(-12, 'hour')}
                                        defaultTimeEnd={moment().add(12, 'hour')}
                                    />
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

export default Gestionale;
