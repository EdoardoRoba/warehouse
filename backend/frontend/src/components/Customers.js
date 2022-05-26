// import axios from "axios";
import { axiosInstance, refFirestore } from "../config.js"
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import * as React from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import BrushIcon from '@material-ui/icons/Brush';
import Grow from '@mui/material/Grow';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from '@material-ui/icons/Add';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Grid from '@mui/material/Grid';
import { AiFillInfoCircle } from "react-icons/ai";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
// import FileBase64 from 'react-file-base64';
import { DataGrid } from '@mui/x-data-grid';
import { SketchPicker } from 'react-color';
import { saveAs } from 'file-saver'
import { storage } from "../firebase";
import * as XLSX from 'xlsx';
// import { firebase } from "firebase/compat/app";
import './Classes.css'
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable, getStorage, deleteObject, uploadString } from "firebase/storage";
import { makeStyles } from '@mui/styles';
import CustomerCard from "./CustomerCard.js";

function Customers(props) {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(true)
    const [selectedFile, setSelectedFile] = React.useState();
    const [selectedFilePDF, setSelectedFilePDF] = React.useState();
    const [selectedSopralluogo, setSelectedSopralluogo] = React.useState([{}]);
    const [isFilePicked, setIsFilePicked] = React.useState(false);
    const [openAccordionScheda, setOpenAccordionScheda] = React.useState(false);
    const [excel, setExcel] = React.useState({});
    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [confermaAdd, setConfermaAdd] = React.useState(false);
    const [addCustomerRecord, setAddCustomerRecord] = React.useState(false);
    const [addCustomerRecordFile, setAddCustomerRecordFile] = React.useState(false);
    const [customers, setCustomers] = React.useState([]);
    const [customerSelected, setCustomerSelected] = React.useState(null);
    const [confermaUpdate, setConfermaUpdate] = React.useState(false);
    const [customerSelectedId, setCustomerSelectedId] = React.useState(false);
    const [openCustomerCard, setOpenCustomerCard] = React.useState(false);
    const [company, setCompany] = React.useState("");
    const [nome_cognome, setNome_cognome] = React.useState("");
    const [telefono, setTelefono] = React.useState("");
    const [cf, setCf] = React.useState("");
    const [indirizzo, setIndirizzo] = React.useState("");
    const [comune, setComune] = React.useState("");
    const [provincia, setProvincia] = React.useState("");
    const [cap, setCap] = React.useState("");
    const [bonus, setBonus] = React.useState("");
    const [termico_elettrico, setTermico_elettrico] = React.useState("");
    const [computo, setComputo] = React.useState("");
    const [data_sopralluogo, setData_sopralluogo] = React.useState("");
    const [data_installazione, setData_installazione] = React.useState("");
    const [tecnico_installazione, setTecnico_installazione] = React.useState("");
    const [tecnico_sopralluogo, setTecnico_sopralluogo] = React.useState("");
    const [trasferta, setTrasferta] = React.useState("");
    const [assistenza, setAssistenza] = React.useState([]);
    const [status, setStatus] = React.useState("");
    const [genericError, setGenericError] = React.useState("");
    const [pagamenti_testo, setPagamenti_testo] = React.useState("");
    const [auths, setAuths] = React.useState([])
    const [openColorsUpdate, setOpenColorsUpdate] = React.useState(false);
    const [statusToAdd, setStatusToAdd] = React.useState("");
    const [colorToAdd, setColorToAdd] = React.useState("");
    const [statusColors, setStatusColors] = React.useState("");
    const [possibleStatuses, setPossibleStatuses] = React.useState("");
    const [fieldToEdit, setFieldToEdit] = React.useState("");
    const [valueToEdit, setValueToEdit] = React.useState("");
    const [openEditField, setOpenEditField] = React.useState(false);
    const [openLoadPdf, setOpenLoadPdf] = React.useState(false);
    const [openEditStatus, setOpenEditStatus] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [progress, setProgress] = React.useState(0);
    const [url, setUrl] = React.useState("");
    const [askDeleteAll, setAskDeleteAll] = React.useState(false);
    const [typeToDeleteAll, setTypeToDeleteAll] = React.useState("");
    const [checkTypologyToDelete, setCheckTypologyToDelete] = React.useState("");

    const columns = [
        { field: 'nome_cognome', headerName: 'nome e cognome', flex: 1 },
        { field: 'status', headerName: 'stato', flex: 1 }
    ]

    var JSZip = require("jszip");
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const navigate = useNavigate();

    const bull = (
        <Box
            component="span"
            sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
            •
        </Box>
    );

    const useStyles = makeStyles((theme) => ({
        backdrop: {
            zIndex: 999,
            color: '#fff',
        },
    }));

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
    };

    React.useEffect(() => {
        userIsAuthenticated()
        checkUserExternal()
        getStatusColors()
    }, [])

    React.useEffect(() => {
        // console.log("file: ", selectedFile)
    }, [selectedFile])

    React.useEffect(() => {
        // console.log("customers: ", customers)
    }, [customers])

    React.useEffect(() => {
        // console.log("customerSelected: ", customerSelected)
    }, [customerSelected])

    React.useEffect(() => {
        // console.log("openColorsUpdate: ", openColorsUpdate)
    }, [openColorsUpdate])

    React.useEffect(() => {
        // console.log("excel: ", excel)
    }, [excel])

    React.useEffect(() => {
        // console.log("statusColors: ", statusColors)
    }, [statusColors])

    React.useEffect(() => {
        // console.log("valueToEdit: ", valueToEdit)
    }, [valueToEdit])

    React.useEffect(() => {
        // console.log("customerSelected: ", customerSelected)
    }, [customerSelected])

    React.useEffect(() => {
        // console.log("selectedSopralluogo: ", selectedSopralluogo)
    }, [selectedSopralluogo])

    React.useEffect(() => {
        if (customerSelected !== null) {
            setCustomerSelectedId(customerSelected._id)
        }
        // console.log("customerSelected: ", customerSelected)
    }, [customerSelected])

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowError(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [showError]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setErrorMessage("")
        }, 5000);
        return () => clearTimeout(timer);
    }, [errorMessage]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setGenericError("")
        }, 5000);
        return () => clearTimeout(timer);
    }, [genericError]);

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

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };

    const routeChange = (custSel) => {
        let path = 'customer-card';
        navigate(path, { state: { customerSelected: custSel } });
    }

    const checkUserExternal = () => {
        setIsLoading(true)
        if (localStorage.getItem("user") !== "admin") {
            axiosInstance.get('employeeIsExternal', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { user: localStorage.getItem("user").replaceAll(".", " ") } }) // { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
                .then(res => {
                    if (res.data) {
                        getCustomers(localStorage.getItem("user").replaceAll(".", " "))
                    } else {
                        getCustomers()
                    }
                }).catch(error => {
                    // console.log("error")
                    if (error.response.status === 401) {
                        userIsAuthenticated()
                    }
                    setIsLoading(false)
                    setShowError(true)
                });
        } else {
            getCustomers()
        }
    }

    const getStatusColors = () => {
        axiosInstance.get('colorsStatus', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(res => {
                var scs = {}
                var pss = []
                var ps = {}
                for (let sc of res.data) {
                    ps = {}
                    scs[sc.label] = sc.color
                    ps["id"] = sc.label
                    ps["label"] = sc.label
                    pss.push(ps)
                }
                setPossibleStatuses(pss)
                setStatusColors(scs)
            }).catch(error => {
                // console.log("error")
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
                setIsLoading(false)
            });
    }

    const getCustomers = (user) => {
        // console.log(user) // undefined
        if (user === undefined) {
            axiosInstance.get('customer', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
                .then(res => {
                    // console.log("customers: ", res.data)
                    setCustomers(res.data)
                    setIsLoading(false)
                }).catch(error => {
                    // console.log("error")
                    if (error.response.status === 401) {
                        userIsAuthenticated()
                    }
                    setIsLoading(false)
                    setShowError(true)
                });
        } else {
            axiosInstance.get('customer', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { user: user } })
                .then(res => {
                    // console.log("customers: ", res.data)
                    setCustomers(res.data)
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
    }

    let addCustomer = () => {
        setIsLoading(true)
        axiosInstance.post('customer', { company: company, nome_cognome: nome_cognome, telefono: telefono, indirizzo: indirizzo, comune: comune, provincia: provincia, cap: cap, bonus: bonus, termico_elettrico: termico_elettrico, computo: computo, data_sopralluogo: data_sopralluogo, data_installazione: data_installazione, tecnico_installazione: tecnico_installazione, tecnico_sopralluogo: tecnico_sopralluogo, trasferta: trasferta, assistenza: assistenza, pagamenti_testo: pagamenti_testo, status: "in attesa di sopralluogo", isAssisted: false, note_info: "", note_sopralluogo: "", note_installazione: "", note_assistenza: "", note_pagamenti: "", cf: cf }, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(response => {
                setConfermaAdd(true)
                getCustomers()
            }).catch(error => {
                // console.log("error")
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
                if (error.response.status === 406) {
                    // console.log(error.response.data.message)
                    setErrorMessage(error.response.data.message)
                    setShowError(false)
                } else {
                    setShowError(true)
                }
                setIsLoading(false)
            });
    }

    let addStatusColor = () => {
        axiosInstance.post('colorsStatus', { label: statusToAdd, color: colorToAdd }, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then(response => {
            handleCloseColorsUpdate()
            getStatusColors()
        }).catch(error => {
            // console.log("error")
            if (error.response.status === 401) {
                userIsAuthenticated()
            }
            setShowError(true)
        });
    }

    const handleSubmission = (e) => {
        ExcelRenderer(selectedFile, (err, resp) => {
            if (err) {
                console.log(err);
                setShowError(true)
            }
            else {
                axiosInstance.post('newCustomerFile', {
                    cols: resp.cols,
                    rows: resp.rows
                }, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((response) => {
                    console.log("File uploaded!")
                    setConfermaAdd(true)
                    getCustomers()
                }).catch((error) => {
                    if (error.response.status === 401) {
                        userIsAuthenticated()
                    }
                    setShowError(true)
                })
            }
        });
    };

    const handleCloseColorsUpdate = () => {
        setOpenColorsUpdate(false)
        getCustomers()
    };

    const handleCloseEditField = () => {
        setFieldToEdit("")
        setValueToEdit("")
        getCustomers()
        setOpenEditField(false)
    };

    const handleCloseLoadPdf = () => {
        setFieldToEdit("")
        setValueToEdit("")
        setSelectedFilePDF({})
        getCustomers()
        setOpenLoadPdf(false)
    };

    const handleCloseAskDeleteAll = () => {
        getCustomers()
        setTypeToDeleteAll("")
        setCheckTypologyToDelete("")
        setAskDeleteAll(false)
    }

    const handleCloseEditStatus = () => {
        setFieldToEdit("")
        setValueToEdit("")
        getCustomers()
        setOpenEditStatus(false)
    };

    const editField = () => {
        var newField = {}
        newField[fieldToEdit] = valueToEdit
        axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((response) => {
            axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                console.log("aggiornato!")
                setIsLoading(false)
                setCustomerSelected(resp.data)
                handleCloseEditField()
            }).catch((error) => {
                setIsLoading(false)
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
            })
        }).catch((error) => {
            if (error.response.status === 401) {
                userIsAuthenticated()
            }
            setIsLoading(false)
        })
    }

    const editStatus = () => {
        var newField = {}
        newField[fieldToEdit] = valueToEdit
        axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((response) => {
            axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                console.log("aggiornato!")
                setIsLoading(false)
                setCustomerSelected(resp.data)
                handleCloseEditStatus()
            }).catch((error) => {
                setIsLoading(false)
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
            })
        }).catch((error) => {
            if (error.response.status === 401) {
                userIsAuthenticated()
            }
            setIsLoading(false)
        })
    }

    const handleSubmissionPDF = () => {
        if (!selectedFilePDF) return;
        const now = Date.now()
        const storageRef = ref(storage, '/files/' + customerSelected.nome_cognome + '/' + fieldToEdit + "_" + now)
        const uploadTask = uploadBytesResumable(storageRef, selectedFilePDF)
        uploadTask.on("state_changed", (snapshot) => {
            const progr = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setProgress(progr)
            setIsLoading(false)
        }, (error) => console.log("error: ", error),
            () => {
                //when the file is uploaded we want to download it. uploadTask.snapshot.ref is the reference to the pdf
                getDownloadURL(uploadTask.snapshot.ref).then((fileUrl) => {
                    console.log("fileUrl: ", fileUrl)

                    var newField = {}
                    newField[fieldToEdit] = customerSelected[fieldToEdit]
                    if (newField[fieldToEdit] === undefined) {
                        newField[fieldToEdit] = [fileUrl]
                    } else {
                        newField[fieldToEdit].push(fileUrl)
                    }
                    axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                        axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                            setIsLoading(false)
                            console.log("customer updated")
                            setCustomerSelected(respp.data)
                            handleCloseLoadPdf()
                        }).catch((error) => {
                            setIsLoading(false)
                            if (error.response.status === 401) {
                                userIsAuthenticated()
                            }
                        })
                    })
                })
            }
        )
    };

    const deletePdf = (pdf, pdfType) => {
        let pdfRef = ref(storage, pdf);
        deleteObject(pdfRef)
            .then(() => {
                console.log("Firebase clean!")
                var new_pdf_array = customerSelected[pdfType].filter((p) => p !== pdf)
                var newField = {}
                newField[pdfType] = new_pdf_array
                axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                    axiosInstance.get("customer/" + customerSelected._id, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                        setIsLoading(false)
                        console.log("pdf eliminato!")
                        setCustomerSelected(respp.data)
                    }).catch((error) => {
                        setIsLoading(false)
                        if (error.response.status === 401) {
                            userIsAuthenticated()
                        }
                    })
                }).catch((error) => {
                    setIsLoading(false)
                    if (error.response.status === 401) {
                        userIsAuthenticated()
                    }
                })
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
            });

    }

    const downloadCustomers = () => { // csvData, fileName
        var csvData = []
        for (let c of customers) {
            var custForCsv = {}
            custForCsv["nome"] = c.nome_cognome
            custForCsv.status = c.status
            custForCsv.company = c.company
            custForCsv.telefono = c.telefono
            custForCsv.cf = c.cf ? c.cf : ""
            var capCsv = c.cap ? " - " + c.cap : ""
            custForCsv["indirizzo (via - comune - provincia - cap)"] = c.indirizzo + " - " + c.comune + " - " + c.provincia + capCsv
            custForCsv.bonus = c.bonus
            custForCsv["termico/elettrico"] = c.termico_elettrico

            custForCsv["data sopralluogo"] = c.data_sopralluogo
            custForCsv["tecnico sopralluogo"] = c.tecnico_sopralluogo
            custForCsv["note sopralluogo"] = c.note_sopralluogo
            custForCsv["# foto sopralluogo"] = c.foto_sopralluogo.length
            custForCsv["# pdf sopralluogo"] = c.pdf_sopralluogo.length

            custForCsv["data installazione"] = c.data_installazione
            custForCsv["tecnico installazione"] = c.tecnico_installazione
            custForCsv["note installazione"] = c.note_installazione
            custForCsv["# foto installazione"] = c.foto_fine_installazione.length
            custForCsv["# pdf computo"] = c.pdf_computo.length
            custForCsv["computo (testo)"] = c.computo

            custForCsv["data assistenza"] = c.data_assistenza
            custForCsv["tecnico assistenza"] = c.tecnico_assistenza
            custForCsv["note assistenza"] = c.note_assistenza
            custForCsv["# foto assistenza"] = c.foto_assistenza.length
            custForCsv["# pdf assistenza"] = c.assistenza.length

            custForCsv.trasferta = c.trasferta
            custForCsv["ha assistenza?"] = c.isAssisted ? "SI" : "NO"
            custForCsv["# pdf di.co"] = c.di_co.length
            custForCsv["# pdf checklist"] = c.check_list.length
            custForCsv["# pdf fgas"] = c.fgas.length
            custForCsv["# pdf prova fumi"] = c.prova_fumi.length
            custForCsv["# pdf collaudo"] = c.collaudo.length
            csvData.push(custForCsv)
        }
        let fileName = "clienti"
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        saveAs(data, fileName + fileExtension);
    }

    const handleChangeAccordionScheda = () => {
        setOpenAccordionScheda((prev) => !prev)
    }

    const handleChangeComplete = (event) => {
        setColorToAdd(event.hex)
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
                    <div>
                        {
                            isLoading ? <Backdrop className={classes.backdrop} open>
                                <CircularProgress color="inherit" />
                            </Backdrop> :
                                <div>
                                    <div style={{ zIndex: '-1', width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                            <h1 style={{ fontFamily: 'times', marginLeft: '1rem', marginRight: 'auto' }}>Gestione clienti</h1>
                                            {
                                                auths["customers"] !== "*" ? "" : <Tooltip style={{ marginRight: '1rem' }} title="Aggiungi un nuovo stato">
                                                    <IconButton onClick={() => { setOpenColorsUpdate(true) }}>
                                                        <BrushIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                        </div>
                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                            <div item xs={12} sm={6}>
                                                {
                                                    auths["customers"] === "installer" ? "" : <div>
                                                        <Tooltip style={{ marginRight: '1rem' }} title="Aggiungi un singolo cliente">
                                                            <IconButton
                                                                onClick={() => { setAddCustomerRecord((prev) => !prev) }}>
                                                                <AddIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {
                                                            !addCustomerRecord ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <Grow
                                                                    in={addCustomerRecord}
                                                                    style={{ transformOrigin: '0 0 0' }}
                                                                    {...(addCustomerRecord ? { timeout: 1000 } : {})}
                                                                >
                                                                    <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '90%', marginTop: '1rem', marginBottom: '1rem' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '100%' }}>
                                                                            <input style={{ margin: '1rem', width: '33%' }} placeholder="company" onChange={(event) => { setCompany(event.target.value) }} />
                                                                            <input style={{ margin: '1rem', width: '33%' }} placeholder="nome e cognome" onChange={(event) => { setNome_cognome(event.target.value.toUpperCase()) }} />
                                                                            <input style={{ margin: '1rem', width: '33%' }} placeholder="telefono" onChange={(event) => { setTelefono(parseInt(event.target.value)) }} />
                                                                            <input style={{ margin: '1rem', width: '33%' }} placeholder="codice fiscale" onChange={(event) => { setCf(parseInt(event.target.value)) }} />
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                            <input style={{ margin: '1rem', width: '25%' }} placeholder="indirizzo" onChange={(event) => { setIndirizzo(event.target.value) }} />
                                                                            <input style={{ margin: '1rem', width: '25%' }} placeholder="comune" onChange={(event) => { setComune(event.target.value) }} />
                                                                            <input style={{ margin: '1rem', width: '25%' }} placeholder="provincia" onChange={(event) => { setProvincia(event.target.value) }} />
                                                                            <input style={{ margin: '1rem', width: '25%' }} placeholder="cap" onChange={(event) => { setCap(event.target.value) }} />
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                            <input style={{ margin: '1rem', width: '25%' }} placeholder="bonus" onChange={(event) => { setBonus(event.target.value.toLowerCase()) }} />
                                                                            <input style={{ margin: '1rem', width: '25%' }} placeholder="termico/elettrico" onChange={(event) => { setTermico_elettrico(event.target.value) }} />
                                                                            <input style={{ margin: '1rem', width: '25%' }} placeholder="computo" onChange={(event) => { setComputo(event.target.value) }} />
                                                                            <input style={{ margin: '1rem', width: '25%' }} placeholder="trasferta" onChange={(event) => { setTrasferta(event.target.value) }} />
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                            <input style={{ margin: '1rem', width: '25%' }} placeholder="data sopralluogo" onChange={(event) => { setData_sopralluogo(event.target.value) }} />
                                                                            <input style={{ margin: '1rem', width: '25%' }} placeholder="tecnico sopralluogo" onChange={(event) => { setTecnico_sopralluogo(event.target.value) }} />
                                                                            <input style={{ margin: '1rem', width: '25%' }} placeholder="data installazione" onChange={(event) => { setData_installazione(event.target.value) }} />
                                                                            <input style={{ margin: '1rem', width: '25%' }} placeholder="tecnico installazione" onChange={(event) => { setTecnico_installazione(event.target.value) }} />
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                            {/* <input style={{ margin: '1rem', width: '50%' }} placeholder="stato" onChange={(event) => { setStatus(event.target.value.toLowerCase()) }} /> */}
                                                                            {/* <Autocomplete
                                                                                disablePortal
                                                                                id="combo-box-demo"
                                                                                options={possibleStatuses}
                                                                                sx={{ width: 300 }}
                                                                                renderInput={(params) => <TextField {...params} label="stato" />}
                                                                                onChange={(event, value) => { setStatus(value.label) }}
                                                                            /> */}
                                                                            <input style={{ margin: '1rem', width: '50%' }} placeholder="pagamenti (testo)" onChange={(event) => { setPagamenti_testo(event.target.value) }} />
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                                                            <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }} onClick={addCustomer}>Conferma</Button>
                                                                        </div>
                                                                    </div>
                                                                </Grow>
                                                            </Box>
                                                        }
                                                        <img src={url} />
                                                    </div>
                                                }
                                            </div>
                                            <div item xs={12} sm={6}>
                                                {
                                                    auths["customers"] === "installer" ? "" : <div>
                                                        <Tooltip style={{ marginRight: '1rem' }} title="Aggiungi un Excel contenente i clienti">
                                                            <IconButton
                                                                onClick={() => { setAddCustomerRecordFile((prev) => !prev) }}>
                                                                <FileCopyIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {
                                                            !addCustomerRecordFile ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <Grow
                                                                    in={addCustomerRecordFile}
                                                                    style={{ transformOrigin: '0 0 0' }}
                                                                    {...(addCustomerRecordFile ? { timeout: 1000 } : {})}
                                                                >
                                                                    <div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                            <input type="file" name="file" onChange={changeHandler} /></div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                            {isFilePicked ?
                                                                                <div>
                                                                                    <p>Nome file: {selectedFile.name}</p>
                                                                                    <p>Tipo di file: {selectedFile.type}</p>
                                                                                    <p>Dimensione in bytes: {selectedFile.size}</p>
                                                                                    <p>
                                                                                        Ultima modifica:{' '}
                                                                                        {selectedFile.lastModifiedDate.toLocaleDateString()}
                                                                                    </p>
                                                                                </div>
                                                                                :
                                                                                <p>Seleziona un file per vederne le specifiche</p>
                                                                            }
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                            <Button disabled={!isFilePicked} onClick={(event) => handleSubmission(event)} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                                        </div>
                                                                    </div>
                                                                </Grow>
                                                            </Box>
                                                        }
                                                        <img src={url} />
                                                    </div>
                                                }
                                            </div>
                                        </Grid>
                                        {
                                            (!confermaAdd) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">File aggiunto correttamente!</Alert>
                                        }
                                        {
                                            (showError === false) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Upload fallito. Controlla connessione e formato dei dati.</Alert>
                                        }
                                        {
                                            (errorMessage === "") ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">{errorMessage}</Alert>
                                        }
                                        {
                                            (genericError === "") ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">{genericError}</Alert>
                                        }
                                        {
                                            auths["customers"] === "installer" ? "" : <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: "2rem" }}>
                                                <Tooltip style={{ marginRight: '1rem' }} title="Scarica Excel di tutti i clienti">
                                                    <IconButton
                                                        onClick={() => { downloadCustomers() }}>
                                                        <GetAppIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        }
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={customers}
                                            getOptionLabel={(option) => option.nome_cognome}
                                            style={{ marginLeft: 'auto', marginRight: "auto", marginBottom: "3rem", marginTop: "3rem" }}
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="clienti" />}
                                            onChange={(event, value) => {
                                                setCustomerSelected(value)
                                                // setOpenCustomerCard(true)
                                                routeChange(value)
                                            }}
                                        />
                                        <Accordion
                                            expanded={openAccordionScheda || false}
                                            onChange={handleChangeAccordionScheda}
                                            style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: '2rem', marginBottom: "3rem" }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1bh-content"
                                            >
                                                <Typography variant="h4" sx={{ width: "33%", flexShrink: 0 }}>
                                                    Scheda cliente
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <div style={{ width: '100%', marginTop: '1rem', marginBottom: '1rem' }}>
                                                    <div style={{ height: 400, width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <DataGrid
                                                            rows={customers}
                                                            columns={columns}
                                                            getRowId={(row) => row._id}
                                                            pageSize={5}
                                                            rowsPerPageOptions={[5]}
                                                            onRowClick={(event, value) => {
                                                                setCustomerSelected(event.row)
                                                                // setOpenCustomerCard(true)
                                                                routeChange(event.row)
                                                            }}
                                                        />
                                                    </div>
                                                    {
                                                        (!confermaUpdate) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">cliente aggiornato correttamente!</Alert>
                                                    }
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
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
                                    {/* Modal to add statuses and colors */}
                                    <Modal
                                        open={openColorsUpdate}
                                        onClose={() => { handleCloseColorsUpdate() }}
                                        aria-labelledby="modal-modal-label"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <Typography style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h2">
                                                Aggiungi uno stato e il suo colore:
                                            </Typography>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                <div>
                                                    <input style={{ marginTop: '2rem', marginBottom: '2rem' }} placeholder="nuovo stato" onChange={(event) => { setStatusToAdd(event.target.value.toLowerCase()) }} />
                                                    <SketchPicker
                                                        color={colorToAdd}
                                                        disableAlpha={true}
                                                        onChangeComplete={handleChangeComplete}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                <Button style={{ color: 'white', backgroundColor: 'green', marginLeft: '1rem' }} onClick={() => { addStatusColor() }}>Conferma</Button>
                                            </div>
                                        </Box>
                                    </Modal>
                                </div>
                        }
                    </div>
            }

        </div>
    );
}

export default Customers;
