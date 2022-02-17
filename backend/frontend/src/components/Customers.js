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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import './Classes.css'

function Customers(props) {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(false)
    const [selectedFile, setSelectedFile] = React.useState();
    const [isFilePicked, setIsFilePicked] = React.useState(false);
    const [openAccordion, setOpenAccordion] = React.useState(false);

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };

    const handleSubmission = () => {
    };

    React.useEffect(() => {
        userIsAuthenticated()
    }, [])

    const handleChangeAccordion = () => {
        setOpenAccordion((prev) => !prev)
    }

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
                                    Carica file
                                </Typography>
                                {/* <Typography sx={{ color: "text.secondary" }}>
                                    I am an accordion
                                </Typography> */}
                            </AccordionSummary>
                            <AccordionDetails>
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
                                        <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                        {/* onClick={handleSubmission} */}
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>



                    </div>
            }
        </div >
    );
}

export default Customers;
