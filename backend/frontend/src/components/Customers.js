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
import './Classes.css'

function Customers(props) {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(false)

    React.useEffect(() => {
        userIsAuthenticated()
    }, [])

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
                !userIsAuthenticatedFlag ? <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert> :
                    <div>
                        <h1 style={{ fontFamily: 'times', marginLeft: '1rem', marginRight: 'auto' }}>Gestione clienti</h1>
                    </div >
            }
        </div >
    );
}

export default Customers;
