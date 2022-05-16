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
// import CustomerCard from "./CustomerCard.js";
// import Timeline, {
//     TimelineHeaders,
//     SidebarHeader,
//     DateHeader,
// } from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'

function Gestionale() {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(true)
    const [auths, setAuths] = React.useState([])
    const [events, setEvents] = React.useState([])
    const [employees, setEmployees] = React.useState([])
    const [employee, setEmployee] = React.useState({})
    const [selectedEmployee, setSelectedEmployee] = React.useState({})
    const [requests, setRequests] = React.useState([])
    const [showRequests, setShowRequests] = React.useState(false)
    const [requestsToShow, setRequestsToShow] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true);
    const [showError, setShowError] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [type, setType] = React.useState("");
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
        color: {
            backgroundColor: '#1976d2 !important',
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
        // const timer = setInterval(() => {
        //     getEvents()
        // }, 300000)
    }, [])

    React.useEffect(() => {
        if (auths.gestionale) {
            getEvents()
            // getEmployee()
            getEmployees()
            getRequests()
        }
    }, [auths])

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
        // if (auths["gestionale"] === "*") {
        // axiosInstance.get('gestionale', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }) //, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
        //     .then(ress => {
        //         let its = []
        //         its = ress.data.map((e, idx) => {
        //             let it = {}
        //             it.id = idx
        //             it.group = e.employee.lastName
        //             it.title = e.type
        //             it.start_time = new Date(e.start)
        //             it.end_time = new Date(e.end)
        //             it.itemProps = {
        //                 style: {
        //                     position: "sticky"
        //                 }
        //             }
        //             return it
        //         })
        //         setItems(its)
        //         setIsLoading(false)
        //     }).catch(error => {
        //         console.log("error")
        //         if (error.response.status === 401) {
        //             userIsAuthenticated()
        //         }
        //         setIsLoading(false)
        //         setShowError(true)
        //     });
        // } else {
        axiosInstance.get('gestionale', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }) //, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } } // , params: { lastName: localStorage.getItem("user") }
            .then(res => {
                for (let e of res.data) {
                    e.start = new Date(e.start)
                    e.end = new Date(e.end)
                    e.title = e.type + " (" + e.status + ")"
                    e.employee = e.employee
                }
                setEvents(res.data)
                setIsLoading(false)
            }).catch(error => {
                console.log("error")
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
                setIsLoading(false)
                setShowError(true)
            });
        // }

    }

    const getEmployees = async () => {
        axiosInstance.get('employee', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(res => {
                setEmployees(res.data)
                let gps = res.data.map((e, idx) => {
                    e.title = e.lastName
                    e.id = e.lastName
                    e.height = 60
                    return e
                })
                // console.log("gps")
                // console.log(gps)
                setGroups(gps)
            }).catch(error => {
                // console.log(error)
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
            });
    }

    // const getEmployee = () => {
    //     axiosInstance.get('employee', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { lastName: localStorage.getItem("user") } })
    //         .then(res => {
    //             setEmployee(res.data[0])
    //         }).catch(error => {
    //             // console.log("error")
    //             if (error.response.status === 401) {
    //                 userIsAuthenticated()
    //             }
    //         });
    // }

    const groupArrayOfObjects = (list, key) => {
        return list.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    const getRequests = () => {
        axiosInstance.get('requests', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(res => {
                let data = res.data
                let rqsts = groupArrayOfObjects(data, "employee")
                setRequests(rqsts)
            }).catch(error => {
                console.log(error)
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

    const addGestionale = () => {
        setIsLoading(true)
        // let externalEmployees = employeesInvolved.filter((eI) => eI.external)
        // nome, tipo app, azienda, termico/eletttrico
        let newEvent = { start: selectedStartTime, end: selectedEndTime, employee: employee, type: type, status: "in attesa" }
        axiosInstance.post('gestionale', newEvent, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(response => {
                getEvents()
                let newReq = { employee: employee.lastName, type: type, start: selectedStartTime, end: selectedEndTime }
                axiosInstance.post('requests', newReq, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
                    .then(response => {
                        getEvents()
                        handleCloseModal()
                    }).catch(error => {
                        if (error.response.status === 401) {
                            userIsAuthenticated()
                        }
                        setIsLoading(false)
                        setShowError(true)
                        handleCloseModal()
                    });
            }).catch(error => {
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
                setIsLoading(false)
                setShowError(true)
                handleCloseModal()
            });
    }

    const updateGestionale = () => {
        setIsLoading(true)
        axiosInstance.put('gestionale/' + eventSelected._id, { start: selectedStartTime, end: selectedEndTime, employee: employee, type: type }, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(response => {
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

    const deleteGestionale = () => {
        setIsLoading(true)
        axiosInstance.delete('gestionale/' + eventSelected._id, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
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
        setType("")
        setCustomerSelected(null)
        getEvents()
        setOpenModal(false)
    }

    const handleCloseModalRequests = () => {
        setRequestsToShow([])
        setShowRequests(false)
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
        setEmployee(e.employee)
        setEmployeesInvolved(e.employees)
        setCustomerInvolved(e.customer)
        setType(e.type)
        setCustomerSelected(e.customer)
        setOpenModal(true)
    }

    const groupRenderer = ({ group }) => {
        let marker = ""
        if (requests[group.title] && requests[group.title].length > 0) {
            marker = "!"
        }
        return <div style={{ display: "flex" }} className="hovered" onClick={() => {
            setShowRequests(true)
            setRequestsToShow(requests[group.lastName])
            // console.log(requests[group.lastName])
            setSelectedEmployee(group)
        }}><p>{group.title}</p><p style={{ color: "red", fontWeight: "bold", marginLeft: "5px" }}>{marker}</p></div>;
    };

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
                                    <div>
                                        <h2>Gestionale</h2>
                                        <h3>Inserisci i tuoi orari</h3>
                                        <Calendar
                                            localizer={localizer}
                                            events={events}
                                            style={{ height: 800 }}
                                            startAccessor="start"
                                            endAccessor="end"
                                            selectable={true}
                                            onSelectSlot={onSelectSlot}
                                            onSelectEvent={onSelectEvent}
                                            views={["month", "week", "day"]} // "week", "day"
                                        />
                                    </div>
                                </div >
                        }
                        <Modal
                            open={showRequests}
                            onClose={() => { handleCloseModalRequests() }}
                            aria-labelledby="modal-modal-label"
                            aria-describedby="modal-modal-description"
                        >
                            <Card container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={style}>
                                {
                                    !selectedEmployee.lastName ? "" : <CardHeader
                                        title={"Richieste di ferie/permessi: " + selectedEmployee.lastName.toUpperCase()}
                                        item xs={12} sm={6}
                                        style={{
                                            marginBottom: '1rem', display: 'flex', justifyContent: 'center', textAlign: 'center', width: "100%", backgroundColor: "#1976d2", minHeight: "80px",
                                            color: "white",
                                            // paddingLeft: 5
                                        }}
                                    />
                                }
                                <div>ciao</div>
                            </Card>
                        </Modal>

                        <Modal
                            open={openModal}
                            onClose={() => { handleCloseModal() }}
                            aria-labelledby="modal-modal-label"
                            aria-describedby="modal-modal-description"
                        >
                            <Card container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={style}>
                                {
                                    eventSelected === null ? <CardHeader
                                        title="Aggiungi un orario"
                                        item xs={12} sm={6}
                                        style={{
                                            marginBottom: '1rem', display: 'flex', justifyContent: 'center', textAlign: 'center', width: "100%", backgroundColor: "#1976d2", minHeight: "80px",
                                            color: "white",
                                            // paddingLeft: 5
                                        }}
                                    /> : <CardHeader
                                        title="Consulta o aggiorna l'orario selezionato"
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
                                        auths["gestionale"] === "installer" ?
                                            <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert>
                                            : <div>
                                                {
                                                    eventSelected === null ? <Autocomplete
                                                        id="tags-standard"
                                                        options={employees}
                                                        style={{ width: "50%", marginLeft: 'auto', marginRight: 'auto', marginTop: '2rem' }}
                                                        // defaultValue={eventSelected.employees}
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
                                                                setEmployee(value)
                                                            }
                                                        }}
                                                    /> : <div style={{ justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                                        <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                            Dipendente
                                                        </Typography>
                                                        <Typography sx={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h6">
                                                            {eventSelected.employee.label}
                                                        </Typography>
                                                    </div>
                                                }
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
                                                                Tipo di orario
                                                            </Button>
                                                            <Typography sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h6">
                                                                {type}
                                                            </Typography>
                                                        </div> : <div>
                                                            <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                Tipo di orario
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
                                                        {/* <MenuItem onClick={() => {
                                                            setType("orario lavorativo")
                                                            setAnchorEl(null)
                                                        }}>Orario lavorativo</MenuItem> */}
                                                        <MenuItem onClick={() => {
                                                            setType("straordinario")
                                                            setAnchorEl(null)
                                                        }}>Straordinario</MenuItem>
                                                        <MenuItem onClick={() => {
                                                            setType("ferie")
                                                            setAnchorEl(null)
                                                        }}>Ferie</MenuItem>
                                                        <MenuItem onClick={() => {
                                                            setType("permesso")
                                                            setAnchorEl(null)
                                                        }}>Permesso</MenuItem>
                                                    </Menu>
                                                </div>

                                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: "2rem" }}>
                                                    {
                                                        eventSelected === null ? <div>
                                                            <TimePicker
                                                                label="inizio"
                                                                value={selectedStartTime}
                                                                ampm={false}
                                                                item xs={12} sm={6}
                                                                // style={{ width: "90%" }}
                                                                onChange={(date) => {
                                                                    setSelectedStartTime(date)
                                                                }}
                                                            />
                                                            <TimePicker
                                                                label="fine"
                                                                value={selectedEndTime}
                                                                ampm={false}
                                                                item xs={12} sm={6}
                                                                // style={{ width: "90%" }}
                                                                onChange={(date) => {
                                                                    setSelectedEndTime(date)
                                                                }}
                                                            />
                                                        </div> : <div>
                                                            <DateTimePicker
                                                                label="inizio"
                                                                value={selectedStartTime}
                                                                ampm={false}
                                                                item xs={12} sm={6}
                                                                // style={{ width: "90%" }}
                                                                onChange={(date) => {
                                                                    setSelectedStartTime(date)
                                                                }}
                                                            />
                                                            <DateTimePicker
                                                                label="fine"
                                                                ampm={false}
                                                                value={selectedEndTime}
                                                                item xs={12} sm={6}
                                                                // style={{ width: "90%" }}
                                                                onChange={(date) => {
                                                                    setSelectedEndTime(date)
                                                                }}
                                                            />
                                                        </div>
                                                    }
                                                </Grid>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: "4rem" }}>
                                                    {
                                                        eventSelected === null ? <Button disabled={type === null || type === ""}
                                                            variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginBottom: '1rem' }}
                                                            onClick={() => { addGestionale() }}>
                                                            Aggiungi orario
                                                        </Button> : <div>
                                                            <Button
                                                                variant="outlined" style={{ color: 'white', backgroundColor: '#ffae1b', marginBottom: '1rem' }}
                                                                onClick={() => { updateGestionale() }}>
                                                                Aggiorna orario
                                                            </Button>
                                                            <Button
                                                                variant="outlined" style={{ color: 'white', backgroundColor: 'red', marginBottom: '1rem' }}
                                                                onClick={() => { deleteGestionale() }}>
                                                                Elimina evento
                                                            </Button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                    }
                                </MuiPickersUtilsProvider>
                            </Card>
                        </Modal>
                    </div>
            }
            {
                (showError === false) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Error. Controlla connessione, formato dei dati o ricarica la pagina.</Alert>
            }
        </div>
    );
}

export default Gestionale;
