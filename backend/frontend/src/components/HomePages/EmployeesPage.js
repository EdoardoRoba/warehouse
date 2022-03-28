// import axios from "axios";
import { axiosInstance } from "../../config.js"
import * as React from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ApartmentIcon from '@material-ui/icons/Apartment';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import '../Classes.css'
import { getToolbarUtilityClass } from "@mui/material";

function EmployeesPage() {

    return (
        <div style={{ display: "flex", justifyContent: 'center', textAlign: 'center', marginTop: '5rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <Card sx={{ width: "80%", height: "100%" }}>
                <CardHeader
                    title="Dipendenti"
                    subheader="Consulta la sezione dipendenti"
                />
                <ApartmentIcon style={{ height: 100, width: 100 }} />
                <CardContent>
                    <Typography style={{ marginBottom: "2rem", marginTop: "2rem" }} variant="body2" color="text.primary">
                        All'interno di questa sezione, potrai visualizzare tutti i dipendenti
                    </Typography>
                </CardContent>
                <CardActions style={{ display: "flex", justifyContent: 'center', textAlign: 'center' }}>
                    <IconButton>
                        <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}><Link style={{ color: 'white' }} to={"/employees"}>Vai alla sezione Dipendenti!</Link></Button>
                    </IconButton>
                </CardActions>
            </Card>
        </div >
    );
}

export default EmployeesPage;
