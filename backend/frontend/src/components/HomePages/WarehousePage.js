// import axios from "axios";
import { axiosInstance } from "../../config.js"
import * as React from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import BuildIcon from '@material-ui/icons/Build';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import '../Classes.css'
import { getToolbarUtilityClass } from "@mui/material";

function WarehousePage() {

    return (
        <div style={{ display: "flex", justifyContent: 'center', textAlign: 'center', marginTop: '5rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <Card sx={{ maxWidth: "60%" }}>
                <CardHeader
                    title="Magazzino"
                    subheader="Gestisci i prodotti presenti nel magazzino"
                />
                <BuildIcon style={{ height: 100, width: 100 }} />
                <CardContent>
                    <Typography style={{ marginBottom: "2rem", marginTop: "2rem" }} variant="body2" color="text.primary">
                        All'interno di questa sezione, potrai aggiungere, cercare, eliminare o modificare un prodotto all'interno del magazzino.
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                        Portai consultare il catalogo dei prodotti suddivisi per reparto e sotto-reparto e potrai anche scaricare un file Excel di tutti i prodotti presenti nel magazzino o di quelli sotto una soglia minima definita da te.
                    </Typography>
                </CardContent>
                <CardActions style={{ display: "flex", justifyContent: 'center', textAlign: 'center' }}>
                    <IconButton>
                        <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}><Link style={{ color: 'white' }} to={"/warehouse"}>Vai al magazzino!</Link></Button>
                    </IconButton>
                </CardActions>
            </Card>
        </div >
    );
}

export default WarehousePage;
