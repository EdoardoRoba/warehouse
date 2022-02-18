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
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import './Classes.css'
import axios from "axios";

function Customers(props) {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(true)
    const [selectedFile, setSelectedFile] = React.useState();
    const [isFilePicked, setIsFilePicked] = React.useState(false);
    const [openAccordion, setOpenAccordion] = React.useState(false);
    const [openAccordionManual, setOpenAccordionManual] = React.useState(false);
    const [openAccordionScheda, setOpenAccordionScheda] = React.useState(false);
    const [excel, setExcel] = React.useState({});
    const [showError, setShowError] = React.useState(false);
    const [confermaAdd, setConfermaAdd] = React.useState(false);

    React.useEffect(() => {
        userIsAuthenticated()
    }, [])

    React.useEffect(() => {
        // console.log("file: ", selectedFile)
    }, [selectedFile])

    React.useEffect(() => {
        // console.log("excel: ", excel)
    }, [excel])

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

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };

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
                }).catch((e) => {
                    console.log("Error while uploading file: ", e)
                    setShowError(true)
                })
            }
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

    const userIsAuthenticated = () => {
        axiosInstance.get("authenticated", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        }).then(response => {
            // console.log(response.data)
            setUserIsAuthenticatedFlag(true)
        }).catch(error => {
            console.log(error)
            setUserIsAuthenticatedFlag(false)
        });
    }

    return (
        <div>
            {
                !userIsAuthenticatedFlag ? <div>
                    <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert>
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}><Button variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginTop: '8rem' }}><Link style={{ color: 'white' }} to={"/login"}>Vai al Login</Link></Button></div>
                </div> :
                    <div>
                        <h1 style={{ fontFamily: 'times', marginLeft: '1rem', marginRight: 'auto' }}>Gestione clienti</h1>
                        <Accordion
                            expanded={openAccordion || false}
                            onChange={handleChangeAccordion}
                            style={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                            >
                                <Typography variant="h4" sx={{ width: "33%", flexShrink: 0 }}>
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
                                <Typography variant="h4" sx={{ width: "33%", flexShrink: 0 }}>
                                    Carica cliente
                                </Typography>
                                {/* <Typography sx={{ color: "text.secondary" }}>
                                    I am an accordion
                                </Typography> */}
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '60%', marginTop: '1rem', marginBottom: '1rem' }}>
                                    manuale
                                </div>
                            </AccordionDetails>
                        </Accordion>
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
                                {/* <Typography sx={{ color: "text.secondary" }}>
                                    I am an accordion
                                </Typography> */}
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '60%', marginTop: '1rem', marginBottom: '1rem' }}>
                                    manuale
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
            }

        </div >
    );
}

export default Customers;
