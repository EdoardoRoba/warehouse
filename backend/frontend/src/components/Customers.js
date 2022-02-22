// import axios from "axios";
import { axiosInstance } from "../config.js"
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
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
import BrushIcon from '@material-ui/icons/Brush';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { AiFillInfoCircle } from "react-icons/ai";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FileBase64 from 'react-file-base64';
import { DataGrid } from '@mui/x-data-grid';
import { SketchPicker } from 'react-color';
import './Classes.css'
import axios from "axios";

function Customers(props) {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(true)
    const [selectedFile, setSelectedFile] = React.useState();
    const [selectedFilePDF, setSelectedFilePDF] = React.useState();
    const [selectedSopralluogo, setSelectedSopralluogo] = React.useState([{}]);
    const [selectedInstallazione, setSelectedInstallazione] = React.useState([{}]);
    const [selectedAssistenza, setSelectedAssistenza] = React.useState([{}]);
    const [isFilePicked, setIsFilePicked] = React.useState(false);
    const [isFilePDFPicked, setIsFilePDFPicked] = React.useState(false);
    const [isSopralluogoPicked, setIsSopralluogoPicked] = React.useState(false);
    const [isInstallazionePicked, setIsInstallazionePicked] = React.useState(false);
    const [isAssistenzaPicked, setIsAssistenzaPicked] = React.useState(false);
    const [openAccordion, setOpenAccordion] = React.useState(false);
    const [openAccordionManual, setOpenAccordionManual] = React.useState(false);
    const [openAccordionScheda, setOpenAccordionScheda] = React.useState(false);
    const [excel, setExcel] = React.useState({});
    const [showError, setShowError] = React.useState(false);
    const [confermaAdd, setConfermaAdd] = React.useState(false);
    const [customers, setCustomers] = React.useState([]);
    const [customerSelected, setCustomerSelected] = React.useState(null);
    const [confermaUpdate, setConfermaUpdate] = React.useState(false);
    const [customerSelectedId, setCustomerSelectedId] = React.useState(false);
    const [openSopralluogo, setOpenSopralluogo] = React.useState(false);
    const [openInstallazione, setOpenInstallazione] = React.useState(false);
    const [openAssistenza, setOpenAssistenza] = React.useState(false);
    const [company, setCompany] = React.useState("");
    const [nome_cognome, setNome_cognome] = React.useState("");
    const [telefono, setTelefono] = React.useState("");
    const [indirizzo, setIndirizzo] = React.useState("");
    const [comune, setComune] = React.useState("");
    const [provincia, setProvincia] = React.useState("");
    const [bonus, setBonus] = React.useState("");
    const [termico_elettrico, setTermico_elettrico] = React.useState("");
    const [computo, setComputo] = React.useState("");
    const [data_sopralluogo, setData_sopralluogo] = React.useState("");
    const [data_installazione, setData_installazione] = React.useState("");
    const [installatore, setInstallatore] = React.useState("");
    const [trasferta, setTrasferta] = React.useState("");
    const [collaudo, setCollaudo] = React.useState("");
    const [assistenza, setAssistenza] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [note, setNote] = React.useState("");
    const [pagamenti_testo, setPagamenti_testo] = React.useState("");
    const [auths, setAuths] = React.useState([])
    const [openColorsUpdate, setOpenColorsUpdate] = React.useState(false);
    const [statusToAdd, setStatusToAdd] = React.useState("");
    const [colorToAdd, setColorToAdd] = React.useState("");
    const [statusColors, setStatusColors] = React.useState("");
    const [fieldToEdit, setFieldToEdit] = React.useState("");
    const [valueToEdit, setValueToEdit] = React.useState("");
    const [openEditField, setOpenEditField] = React.useState(false);

    const columns = [
        { field: 'nome_cognome', headerName: 'nome e cognome', width: 300 },
        { field: 'status', headerName: 'stato', width: 300 }
    ]

    const possibleStatuses = [
        {
            id: "closed",
            label: "closed"
        },
        {
            id: "pending",
            label: "pending"
        },
        {
            id: "emergency",
            label: "emergency"
        }
    ]
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    React.useEffect(() => {
        userIsAuthenticated()
        getCustomers()
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
        // console.log("selectedSopralluogo: ", selectedSopralluogo[0].base64)
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

    const getStatusColors = () => {
        axiosInstance.get('colorsStatus')
            .then(res => {
                var scs = {}
                for (let sc of res.data) {
                    scs[sc.label] = sc.color
                }
                setStatusColors(scs)
            })
    }

    const changeHandlerPDF = (event) => {
        setSelectedFilePDF(event.target.files[0]);
        setIsFilePDFPicked(true);
    };

    const changeHandlerPhotoSopralluogo = (event) => {
        setSelectedSopralluogo(event.target.files[0]);
        setIsSopralluogoPicked(true);
    };

    const getCustomers = () => {
        axiosInstance.get('customer')
            .then(res => {
                // console.log("Tools: ", res.data)
                setCustomers(res.data)
            })
    }

    let addCustomer = () => {
        axiosInstance.post('customer', { company: company, nome_cognome: nome_cognome, telefono: telefono, indirizzo: indirizzo, comune: comune, provincia: provincia, bonus: bonus, termico_elettrico: termico_elettrico, computo: computo, data_sopralluogo: data_sopralluogo, data_installazione: data_installazione, installatore: installatore, trasferta: trasferta, assistenza: assistenza, note: note, pagamenti_testo: pagamenti_testo, status: status })
            .then(response => {
                setConfermaAdd(true)
                getCustomers()
            }).catch(error => {
                // console.log("error")
                setShowError(true)
            });
    }

    let addStatusColor = () => {
        axiosInstance.post('colorsStatus', { label: statusToAdd, color: colorToAdd }).then(response => {
            handleCloseColorsUpdate()
            getStatusColors()
        }).catch(error => {
            // console.log("error")
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
                }).then((response) => {
                    console.log("File uploaded!")
                    setConfermaAdd(true)
                    getCustomers()
                }).catch((e) => {
                    console.log("Error while uploading file: ", e)
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

    const editField = () => {
        var newField = {}
        newField[fieldToEdit] = valueToEdit
        axiosInstance.put("customer/" + customerSelected._id, newField).then((response) => {
            axiosInstance.put("customer/" + customerSelected._id, newField).then((resp) => {
                console.log("aggiornato!")
                setCustomerSelected(resp.data)
                handleCloseEditField()
            }).catch((error) => {
                console.log("error")
                console.log(error)
            })
        }).catch((error) => {
            console.log("error")
            console.log(error)
        })
    }

    const handleSubmissionPDF = (e) => {
        var customer = {}
        customer.di_co = selectedFilePDF
        // console.log(customer.di_co)
        axiosInstance.put("customer/" + customerSelected._id, customer).then(response => {
            // console.log("Fatto!", response)
            setConfermaUpdate(true)
            getCustomers()
            axiosInstance.get('customer/' + customerSelected._id).then((res) => {
                setCustomerSelected(res.data)
            }).catch((error) => {
                // console.log("error: ", error)
                setShowError(true)
            });
        }).catch((error) => {
            // console.log("error: ", error)
            setShowError(true)
        });
    };

    const deleteImage = (ph, phType) => {
        var new_ph_array = customerSelected[phType].filter((p) => p !== ph)
        var newField = {}
        newField[phType] = new_ph_array
        axiosInstance.put("customer/" + customerSelected._id, newField).then((resp) => {
            axiosInstance.put("customer/" + customerSelected._id, newField).then((respp) => {
                console.log("foto eliminata!")
                setCustomerSelected(respp.data)
            }).catch((error) => {
                console.log("error")
                console.log(error)
            })
        }).catch((error) => {
            console.log("error")
            console.log(error)
        })
    }

    const handleSubmissionSopralluogo = (e) => {
        var customer = {}
        customer.foto_sopralluogo = customerSelected.foto_sopralluogo
        customer.foto_sopralluogo.push(selectedSopralluogo[0].base64)
        // console.log(customer.foto_sopralluogo)
        axiosInstance.put("customer/" + customerSelected._id, customer).then(response => {
            // console.log("Fatto!", response)
            setConfermaUpdate(true)
            getCustomers()
            axiosInstance.get('customer/' + customerSelected._id).then((res) => {
                setCustomerSelected(res.data)
            }).catch((error) => {
                // console.log("error: ", error)
                setShowError(true)
            });
        }).catch((error) => {
            // console.log("error: ", error)
            setShowError(true)
        });
    };

    const handleSubmissionInstallazione = (e) => {
        var customer = {}
        customer.foto_fine_installazione = customerSelected.foto_fine_installazione
        customer.foto_fine_installazione.push(selectedInstallazione[0].base64)
        // console.log(customer.foto_fine_installazione)
        axiosInstance.put("customer/" + customerSelected._id, customer).then(response => {
            // console.log("Fatto!", response)
            setConfermaUpdate(true)
            getCustomers()
            axiosInstance.get('customer/' + customerSelected._id).then((res) => {
                setCustomerSelected(res.data)
            }).catch((error) => {
                // console.log("error: ", error)
                setShowError(true)
            });
        }).catch((error) => {
            // console.log("error: ", error)
            setShowError(true)
        });
    };

    const handleSubmissionAssistenza = (e) => {
        var customer = {}
        customer.foto_assistenza = customerSelected.foto_assistenza
        customer.foto_assistenza.push(selectedAssistenza[0].base64)
        // console.log(customer.foto_assistenza)
        axiosInstance.put("customer/" + customerSelected._id, customer).then(response => {
            // console.log("Fatto!", response)
            setConfermaUpdate(true)
            getCustomers()
            axiosInstance.get('customer/' + customerSelected._id).then((res) => {
                setCustomerSelected(res.data)
            }).catch((error) => {
                // console.log("error: ", error)
                setShowError(true)
            });
        }).catch((error) => {
            // console.log("error: ", error)
            setShowError(true)
        });
    };

    const handleChangeAccordion = () => {
        setOpenAccordion((prev) => !prev)
    }

    const handleChangeAccordionManual = () => {
        setOpenAccordionManual((prev) => !prev)
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
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}><Button variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginTop: '8rem' }}><Link style={{ color: 'white' }} to={"/login"}>Vai al Login</Link></Button></div>
                </div> :
                    <div>
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
                        {
                            auths["customers"] === "installer" ? "" : <div>
                                <Accordion
                                    expanded={openAccordion || false}
                                    onChange={handleChangeAccordion}
                                    style={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                    >
                                        <Typography variant="h4" sx={{ width: "50%", flexShrink: 0 }}>
                                            Carica file Excel
                                        </Typography>
                                        {/* <Typography sx={{ color: "text.secondary" }}>
                                                I am an accordion
                                            </Typography> */}
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {/* <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '60%', marginTop: '1rem', marginBottom: '1rem' }}>
                                                <Alert severity="warning">Il caricamento di un nuovo file sovrascriverà il precedente!</Alert>
                                            </div> */}
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
                                                {/* onClick={handleSubmission} */}
                                            </div>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion
                                    expanded={openAccordionManual || false}
                                    onChange={handleChangeAccordionManual}
                                    style={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                    >
                                        <Typography variant="h4" sx={{ width: "50%", flexShrink: 0 }}>
                                            Carica singolo cliente
                                        </Typography>
                                        {/* <Typography sx={{ color: "text.secondary" }}>
                                                I am an accordion
                                            </Typography> */}
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '90%', marginTop: '1rem', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '100%' }}>
                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="company" onChange={(event) => { setCompany(event.target.value) }} />
                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="nome e cognome" onChange={(event) => { setNome_cognome(event.target.value.toLowerCase()) }} />
                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="telefono" onChange={(event) => { setTelefono(parseInt(event.target.value)) }} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="indirizzo" onChange={(event) => { setIndirizzo(event.target.value) }} />
                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="comune" onChange={(event) => { setComune(event.target.value) }} />
                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="provincia" onChange={(event) => { setProvincia(event.target.value) }} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="bonus" onChange={(event) => { setBonus(event.target.value.toLowerCase()) }} />
                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="termico/elettrico" onChange={(event) => { setTermico_elettrico(event.target.value) }} />
                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="computo" onChange={(event) => { setComputo(event.target.value) }} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="data sopralluogo" onChange={(event) => { setData_sopralluogo(event.target.value) }} />
                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="data installazione" onChange={(event) => { setData_installazione(event.target.value) }} />
                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="installatore" onChange={(event) => { setInstallatore(event.target.value) }} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                <input style={{ margin: '1rem', width: '50%' }} placeholder="trasferta" onChange={(event) => { setTrasferta(event.target.value) }} />
                                                <input style={{ margin: '1rem', width: '50%' }} placeholder="assistenza" onChange={(event) => { setAssistenza(event.target.value) }} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                {/* <input style={{ margin: '1rem', width: '50%' }} placeholder="stato" onChange={(event) => { setStatus(event.target.value.toLowerCase()) }} /> */}
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={possibleStatuses}
                                                    sx={{ width: 300 }}
                                                    renderInput={(params) => <TextField {...params} label="stato" />}
                                                    onChange={(event, value) => { setStatus(value.label) }}
                                                />
                                                <input style={{ margin: '1rem', width: '50%' }} placeholder="note" onChange={(event) => { setNote(event.target.value.toLowerCase()) }} />
                                                <input style={{ margin: '1rem', width: '50%' }} placeholder="pagamenti (testo)" onChange={(event) => { setPagamenti_testo(event.target.value) }} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                                <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }} onClick={addCustomer}>Conferma</Button>
                                            </div>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        }
                        {
                            (!confermaAdd) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">File aggiunto correttamente!</Alert>
                        }
                        {
                            (showError === false) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Upload fallito. Controlla connessione e formato dei dati.</Alert>
                        }
                        <Accordion
                            expanded={openAccordionScheda || false}
                            onChange={handleChangeAccordionScheda}
                            style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: '2rem' }}
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
                                <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '80%', marginTop: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ height: 400, width: '100%' }}>
                                        <DataGrid
                                            rows={customers}
                                            columns={columns}
                                            getRowId={(row) => row._id}
                                            pageSize={5}
                                            rowsPerPageOptions={[5]}
                                            onRowClick={(event, value) => { setCustomerSelected(event.row) }}
                                        />
                                    </div>
                                    {/* <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={customers}
                                        style={{ marginLeft: 'auto', marginRight: "auto" }}
                                        sx={{ width: 300 }}
                                        getOptionLabel={option => option.nome_cognome}
                                        renderInput={(params) => <TextField {...params} label="cliente" />}
                                        onChange={(event, value) => { setCustomerSelected(value) }}
                                    /> */}
                                    {customerSelected === null ? "" : <Card style={{ marginTop: '1rem' }}>
                                        <CardContent>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <AiFillInfoCircle style={{ color: statusColors[customerSelected.status.toLowerCase()], fontSize: 'xx-large' }} />
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.status.toLowerCase()}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        COMPANY
                                                    </Typography>
                                                    <div>
                                                        <Typography variant="h7" component="div">
                                                            {customerSelected.company}
                                                        </Typography>
                                                        {
                                                            auths["customers"] !== "*" ? "" : <IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("company")
                                                                    setOpenEditField(true)
                                                                }}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        }
                                                    </div>

                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        NOME E COGNOME
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.nome_cognome}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("nome_cognome")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        TELEFONO
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.telefono}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("telefono")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        INDIRIZZO
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.indirizzo}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("indirizzo")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        COMUNE
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.comune}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("comune")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        PROVINCIA
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.provincia}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("provincia")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        BONUS
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.bonus}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("bonus")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        TERMICO/ELETTRICO
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.termico_elettrico}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("termico_elettrico")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        COMPUTO
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.computo}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("computo")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        DATA SOPRALLUOGO
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.data_sopralluogo}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("data_sopralluogo")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        DATA INSTALLAZIONE
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.data_installazione}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("data_installazione")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        INSTALLATORE
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.installatore}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("installatore")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        TRASFERTA
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.trasferta}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("trasferta")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        DI.CO
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.di_co}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("di_co")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        CHECK LIST
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.check_list}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("check_list")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        FGAS
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.fgas}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("fgas")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        PROVA FUMI
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.prova_fumi}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("prova_fumi")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        COLLAUDO
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.collaudo}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("collaudo")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        ASSISTENZA
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.assistenza}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("assistenza")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>
                                                <div style={{ marginRight: '3rem' }}>
                                                    <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        NOTE
                                                    </Typography>
                                                    <Typography variant="h7" component="div">
                                                        {customerSelected.note}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("note")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                                </div>

                                            </div>
                                            {
                                                auths["customers"] !== "*" ? "" : <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                                    <div style={{ marginRight: '3rem' }}>
                                                        <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                            PAGAMENTI (PDF)
                                                        </Typography>
                                                        <Typography variant="h7" component="div">
                                                            {customerSelected.pagamenti_pdf}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ marginRight: '3rem' }}>
                                                        <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                            PAGAMENTI (TESTO)
                                                        </Typography>
                                                        <Typography variant="h7" component="div">
                                                            {customerSelected.pagamenti_testo}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            }
                                            <div style={{ justifyContent: 'left', textAlign: 'left', marginTop: '5rem' }}>
                                                <div style={{ marginRight: '3rem', marginBottom: '4rem' }}>
                                                    <Typography style={{ marginTop: '1rem', marginBottom: '2rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        FOTO SOPRALLUOGO
                                                    </Typography>
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                            <FileBase64
                                                                multiple={true}
                                                                onDone={(event) => {
                                                                    setSelectedSopralluogo(event)
                                                                    setIsSopralluogoPicked(true)
                                                                }}
                                                            />
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <Button disabled={!isSopralluogoPicked} onClick={(event) => handleSubmissionSopralluogo(event)} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                                {/* onClick={handleSubmission} */}

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1.5rem' }}>
                                                        <Button onClick={(event) => setOpenSopralluogo(event)} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Apri foto</Button>
                                                    </div>
                                                </div>
                                                <div style={{ marginRight: '3rem', marginBottom: '4rem' }}>
                                                    <Typography style={{ marginTop: '1rem', marginBottom: '2rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        FOTO FINE INSTALLAZIONE
                                                    </Typography>
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                            <FileBase64
                                                                multiple={true}
                                                                onDone={(event) => {
                                                                    setSelectedInstallazione(event)
                                                                    setIsInstallazionePicked(true)
                                                                }}
                                                            />
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <Button disabled={!isInstallazionePicked} onClick={(event) => handleSubmissionInstallazione(event)} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                                {/* onClick={handleSubmission} */}

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1.5rem' }}>
                                                        <Button onClick={(event) => setOpenInstallazione(event)} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Apri foto</Button>
                                                    </div>
                                                </div>
                                                <div style={{ marginRight: '3rem', marginBottom: '4rem' }}>
                                                    <Typography style={{ marginTop: '1rem', marginBottom: '2rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                        FOTO ASSISTENZA
                                                    </Typography>
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                            <FileBase64
                                                                multiple={true}
                                                                onDone={(event) => {
                                                                    setSelectedAssistenza(event)
                                                                    setIsAssistenzaPicked(true)
                                                                }}
                                                            />
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <Button disabled={!isAssistenzaPicked} onClick={(event) => handleSubmissionAssistenza(event)} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                                {/* onClick={handleSubmission} */}

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1.5rem' }}>
                                                        <Button onClick={(event) => setOpenAssistenza(event)} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Apri foto</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    }
                                    {/* <div>
                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                            <input type="file" name="file" onChange={changeHandlerPDF} /></div>
                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                            {isFilePDFPicked ?
                                                <div>
                                                    <p>Nome file: {selectedFilePDF.name}</p>
                                                    <p>Tipo di file: {selectedFilePDF.type}</p>
                                                    <p>Dimensione in bytes: {selectedFilePDF.size}</p>
                                                    <p>
                                                        Ultima modifica:{' '}
                                                        {selectedFilePDF.lastModifiedDate.toLocaleDateString()}
                                                    </p>
                                                </div>
                                                :
                                                <p>Seleziona un file per vederne le specifiche</p>
                                            }
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                            <Button disabled={!isFilePDFPicked} onClick={(event) => handleSubmissionPDF(event)} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                        </div>
                                    </div> */}
                                    {
                                        (!confermaUpdate) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">cliente aggiornato correttamente!</Alert>
                                    }
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
            }
            {
                customerSelected === null ? "" : <div>
                    <Modal
                        open={openSopralluogo}
                        onClose={() => { setOpenSopralluogo(false) }}
                        aria-labelledby="modal-modal-label"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} style={{ maxHeight: '80%', overflowY: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>
                            {
                                customerSelected.foto_sopralluogo.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> : <div>
                                    <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Foto sopralluogo</h2>
                                    {
                                        customerSelected.foto_sopralluogo.map((fotosl) => {
                                            return <Typography style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }} id="modal-modal-label" variant="h6" component="h2">
                                                <img style={{ maxHeight: '200px', maxWidth: '200px', marginRight: '2rem' }} src={fotosl} alt="Logo" />
                                                <IconButton onClick={() => { deleteImage(fotosl, "foto_sopralluogo") }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Typography>
                                        })
                                    }
                                </div>
                            }
                        </Box>
                    </Modal>
                    <Modal
                        open={openInstallazione}
                        onClose={() => { setOpenInstallazione(false) }}
                        aria-labelledby="modal-modal-label"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} style={{ maxHeight: '80%', overflowY: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>
                            {
                                customerSelected.foto_fine_installazione.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> : <div>
                                    <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Foto fine installazione</h2>
                                    {
                                        customerSelected.foto_fine_installazione.map((fotoin) => {
                                            return <Typography style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }} id="modal-modal-label" variant="h6" component="h2">
                                                <img style={{ maxHeight: '200px', maxWidth: '200px' }} src={fotoin} alt="Logo" />
                                                <IconButton onClick={() => { deleteImage(fotoin, "foto_fine_installazione") }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Typography>
                                        })
                                    }
                                </div>
                            }

                        </Box>
                    </Modal>
                    <Modal
                        open={openAssistenza}
                        onClose={() => { setOpenAssistenza(false) }}
                        aria-labelledby="modal-modal-label"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} style={{ maxHeight: '80%', overflowY: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>
                            {
                                customerSelected.foto_assistenza.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> : <div>
                                    <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Foto assistenza</h2>
                                    {
                                        customerSelected.foto_assistenza.map((fotoas) => {
                                            return <Typography style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }} id="modal-modal-label" variant="h6" component="h2">
                                                <img style={{ maxHeight: '200px', maxWidth: '200px' }} src={fotoas} alt="Logo" />
                                                <IconButton onClick={() => { deleteImage(fotoas, "foto_assistenza") }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Typography>
                                        })
                                    }
                                </div>
                            }
                        </Box>
                    </Modal>
                    {/* Modal to edit field */}
                    <Modal
                        open={openEditField}
                        onClose={() => { handleCloseEditField() }}
                        aria-labelledby="modal-modal-label"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h2">
                                Aggiorna il campo {fieldToEdit.toUpperCase()}:
                            </Typography>
                            <TextField style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }} id="filled-basic" label="Nuovo valore:" variant="filled" onChange={(event) => {
                                setValueToEdit(event.target.value)
                            }} />
                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                <Button style={{ color: 'white', backgroundColor: 'green', marginLeft: '1rem' }} onClick={() => { editField() }}>Conferma</Button>
                            </div>
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
        </div >
    );
}

export default Customers;
