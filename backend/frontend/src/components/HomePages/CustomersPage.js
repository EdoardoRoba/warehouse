// import axios from "axios";
import { axiosInstance } from "../../config.js"
import * as React from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import PeopleIcon from '@material-ui/icons/People';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import '../Classes.css'
import { getToolbarUtilityClass } from "@mui/material";

function CustomerPage() {

    return (
        <div style={{ display: "flex", justifyContent: 'center', textAlign: 'center', marginTop: '5rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <Card sx={{ width: "80%", height: "100%" }}>
                <CardHeader
                    title="Clienti"
                    subheader="Consulta la sezione cliente"
                />
                <PeopleIcon style={{ height: 100, width: 100 }} />
                <CardContent>
                    <Typography style={{ marginBottom: "2rem", marginTop: "2rem" }} variant="body2" color="text.primary">
                        All'interno di questa sezione, potrai visualizzare tutti i clienti, aggiungerli e modificarli.
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                        Potrai caricare le foto del sopralluogo, di fine installazione e di assistenza. Potrai caricare e consultare i pdf. Le note, modificabili, ti aiuteranno ad annotare appunti e avvertenze di un determinato cliente.
                    </Typography>
                </CardContent>
                <CardActions style={{ display: "flex", justifyContent: 'center', textAlign: 'center' }}>
                    <IconButton>
                        <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}><Link style={{ color: 'white' }} to={"/customers"}>Vai alla sezione clienti!</Link></Button>
                    </IconButton>
                </CardActions>
            </Card>
        </div >
    );
}

export default CustomerPage;
