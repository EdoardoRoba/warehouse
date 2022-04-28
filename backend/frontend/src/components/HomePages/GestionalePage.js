// import axios from "axios";
import { axiosInstance } from "../../config.js"
import * as React from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import '../Classes.css'

function GestionalePage() {

    return (
        <div style={{ display: "flex", justifyContent: 'center', textAlign: 'center', marginTop: '5rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <Card sx={{ width: "80%", height: "100%" }}>
                <CardHeader
                    title="Calendario"
                    subheader="Consulta il tuo calendario"
                />
                <CalendarTodayIcon style={{ height: 100, width: 100 }} />
                <CardContent>
                    <Typography style={{ marginBottom: "2rem", marginTop: "2rem" }} variant="body2" color="text.primary">
                        All'interno di questa sezione, potrai visualizzare, modificare e aggiungere i tuoi appuntamenti con i clienti
                    </Typography>
                </CardContent>
                <CardActions style={{ display: "flex", justifyContent: 'center', textAlign: 'center' }}>
                    <IconButton>
                        <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}><Link style={{ color: 'white' }} to={"/calendar"}>Vai al calendario!</Link></Button>
                    </IconButton>
                </CardActions>
            </Card>
        </div >
    );
}

export default GestionalePage;
