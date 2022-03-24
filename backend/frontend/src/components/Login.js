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
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import './Classes.css'

function Login(props) {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [password, setPassword] = React.useState("")
    const [username, setUsername] = React.useState("")
    const [showError, setShowError] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [token, setToken] = React.useState("");
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        setLoading(false)
        userIsAuthenticated(false)
    }, []);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowError(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [showError]);

    // React.useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setLoggedIn(false)
    //     }, 5000);
    //     return () => clearTimeout(timer);
    // }, [loggedIn]);

    React.useEffect(() => {
        // console.log(token)
        // userIsAuthenticated()
    }, [token]);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev)
    }

    const login = () => {
        axiosInstance.post('profile', { username: username, password: password })
            .then(response => {
                setLoggedIn(true)
                setToken(response.data.token)
                // console.log(response.data)
                localStorage.setItem("token", response.data.token)
                localStorage.setItem("auths", response.data.auths)
                localStorage.setItem("profile", response.data.profile)
            }).catch(error => {
                setShowError(true)
                console.log(error)
            });
    }

    const userIsAuthenticated = (flagReload) => {
        // axiosInstance.get("authenticated", {
        //     headers: {
        //         "x-access-token": localStorage.getItem("token"),
        //         "profile": localStorage.getItem("profile"),
        //         "auths": localStorage.getItem("auths")
        //     }
        // }).then(response => {
        //     console.log(response.data)
        // }).catch(error => {
        //     setShowError(true)
        //     console.log(error)
        // });
        if (localStorage.getItem("auths") !== null) {
            if (localStorage.getItem("auths").includes("warehouse")) {
                axiosInstance.get("authenticated", {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                        "profile": localStorage.getItem("profile"),
                        "auths": localStorage.getItem("auths")
                    }
                }).then(response => {
                    // console.log(response.data)
                    setUserIsAuthenticatedFlag(true)
                    if (flagReload) {
                        window.location.reload(true)
                    }
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
                !userIsAuthenticatedFlag ? <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '10rem' }}>
                    <Card style={{ width: '40%' }} sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography style={{ marginBottom: '3rem' }} variant="h3" component="div">
                                Login
                            </Typography>
                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="username"
                                    onChange={(event) => { setUsername(event.target.value) }}
                                />
                                {/* <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                        /> */}
                                <FormControl sx={{ width: '25ch' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(event) => { setPassword(event.target.value) }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </div>
                            <Button onClick={login} variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginTop: '3rem' }}>Conferma</Button>
                        </CardContent>
                    </Card>
                </div > : <div>
                    <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="success"><h1>UTENTE GIA' AUTORIZZATO!</h1></Alert>
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}><Button variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginTop: '8rem' }}><Link style={{ color: 'white' }} to={"/warehouse"}>Vai al magazzino</Link></Button></div>
                </div>
            }

            <div>
                {
                    (showError === false) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Errore. Utente o password non corretti.</Alert>
                }
                {
                    (!loggedIn) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '2rem' }} severity="success">Utente loggato correttamente!</Alert>
                }
            </div>
            {
                !loggedIn ? "" : <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}><Button onClick={() => { userIsAuthenticated(true) }} variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginTop: '3rem' }}><Link style={{ color: 'white' }} to={"/warehouse"}>Continua</Link></Button></div>
            }
        </div>
    );
}

export default Login;
