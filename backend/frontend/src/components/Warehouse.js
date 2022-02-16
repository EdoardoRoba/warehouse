// import axios from "axios";
import { axiosInstance } from "../config.js"
import * as React from "react";
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
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import './Classes.css'

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function Warehouse(props) {
    const [timerUpd, setTimerUpd] = React.useState(setTimeout(() => { }, 1000))
    const [tools, setTools] = React.useState([])
    const [employees, setEmployees] = React.useState([])
    const [inheritedQuantity, setInheritedQuantity] = React.useState(-1)
    const [label, setLabel] = React.useState("")
    const [quantity, setQuantity] = React.useState("")
    const [user, setUser] = React.useState("")
    const [lowerBound, setLowerBound] = React.useState("")
    const [price, setPrice] = React.useState("")
    const [department, setDepartment] = React.useState("")
    const [subDepartment, setSubDepartment] = React.useState("")
    const [rowLayout, setRowLayout] = React.useState("")
    const [columnLayout, setColumnLayout] = React.useState("")
    const [library, setLibrary] = React.useState(null)
    const [layout, setLayout] = React.useState(null)
    const [rowsLibrary, setRowsLibrary] = React.useState([])
    const [columnsLibrary, setColumnsLibrary] = React.useState([])
    const [open, setOpen] = React.useState(false);
    const [openLibraryUpdate, setOpenLibraryUpdate] = React.useState(false);
    const [toolsInShelf, setToolsInShelf] = React.useState([])
    const [shelfRowSelected, setShelfRowSelected] = React.useState("")
    const [shelfColumnSelected, setShelfColumnSelected] = React.useState("")
    const [addBookFlag, setAddBookFlag] = React.useState(false);
    const [getBookFlag, setGetBookFlag] = React.useState(false);
    const [updateBookFlag, setUpdateBookFlag] = React.useState(false);
    const [deleteBookFlag, setDeleteBookFlag] = React.useState(false);
    const [confermaAdd, setConfermaAdd] = React.useState(false);
    const [confermaUpdate, setConfermaUpdate] = React.useState(false);
    const [confermaDelete, setConfermaDelete] = React.useState(false);
    const [notFound, setNotFound] = React.useState("");
    const [showError, setShowError] = React.useState(false);
    const [nonExistingEmployee, setNonExistingEmployee] = React.useState("");
    const [departments, setDepartments] = React.useState([]);
    const [subDepartments, setSubDepartments] = React.useState([]);
    const [checked, setChecked] = React.useState(false);
    const [openPapers, setOpenPapers] = React.useState({});
    const [sdSelected, setSdSelected] = React.useState("");
    const [toolsInSd, setToolsInSd] = React.useState([]);
    const [toolInSd, setToolInSd] = React.useState(null);
    const [toolFound, setToolFound] = React.useState(null);

    const structureId = "6205a1c27f6cda42c2064a0f"
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "Z"]
    const beUrl = "http://localhost:8050/"

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

    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: 60,
        lineHeight: '60px',
    }));

    // whenever the page reloads (renders), the hook "useEffect" is called
    React.useEffect(() => {
        getTools()
        getLibraryStructure()
        getEmployees()
        getDepartments()
    }, [])

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

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setConfermaDelete(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [confermaDelete]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setNotFound("")
        }, 5000);
        return () => clearTimeout(timer);
    }, [notFound]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowError(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [showError]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setNonExistingEmployee("")
        }, 5000);
        return () => clearTimeout(timer);
    }, [nonExistingEmployee]);

    React.useEffect(() => {
        if (library !== null) {
            createLibrary()
        }
    }, [library])

    React.useEffect(() => {
        // console.log("layout: ", layout)
    }, [layout])

    React.useEffect(() => {
        // console.log("departments: ", departments)
    }, [departments])

    React.useEffect(() => {
        // console.log("subDepartments: ", subDepartments)
    }, [subDepartments])

    React.useEffect(() => {
        // console.log("tools: ", tools)
        getQuantity()
    }, [tools])

    React.useEffect(() => {
        // console.log("openPapers: ", openPapers)
    }, [openPapers])

    React.useEffect(() => {
        // console.log("label: ", label)
        // setTimerUpd(setTimeout(() => {
        getQuantity()
        // clearTimeout(timerUpd)
        // }, 1000))
    }, [label])

    React.useEffect(() => {
        // console.log("inheritedQuantity: ", inheritedQuantity)
        if (inheritedQuantity === 0) {
            setNotFound(true)
        }
    }, [inheritedQuantity])

    React.useEffect(() => {
        // console.log("toolsInShelf: ", toolsInShelf)
    }, [toolsInShelf])

    React.useEffect(() => {
        // console.log("toolInSd: ", toolInSd)
    }, [toolInSd])

    React.useEffect(() => {
        // console.log("library: ", library)
    }, [library])

    React.useEffect(() => {
        // console.log("columnsLibrary: ", columnsLibrary)
    }, [columnsLibrary])

    React.useEffect(() => {
        // console.log("rowsLibrary: ", rowsLibrary)
    }, [rowsLibrary])

    const handleChangeAddBook = () => {
        setAddBookFlag((prev) => !prev);
        setUpdateBookFlag(false);
        setDeleteBookFlag(false);
        setGetBookFlag(false);
    };

    const handleChangeGetBook = () => {
        setGetBookFlag((prev) => !prev);
        setUpdateBookFlag(false);
        setDeleteBookFlag(false);
        setAddBookFlag(false);
    };

    const handleChangeUpdateBook = () => {
        setUpdateBookFlag((prev) => !prev);
        setAddBookFlag(false);
        setDeleteBookFlag(false);
        setGetBookFlag(false);
        // setInheritedQuantity(0)
    };

    const handleChangeDeleteBook = () => {
        setDeleteBookFlag((prev) => !prev);
        setAddBookFlag(false);
        setUpdateBookFlag(false);
        setGetBookFlag(false);
    };

    const handleChangeInheritedQuantity = (event) => {
        setInheritedQuantity(event)
    }

    const createLibrary = () => {
        var structure = []
        var structureGrid = []
        var rows = []
        var cols = []
        if (library.length > 0) {
            for (var c = 0; c < library[0].columns; c++) {
                rows = []
                structureGrid[c] = []
                structure[c] = []
                for (var r = 0; r < library[0].rows; r++) {
                    structure[c].push({ row: r, column: c, selected: false, key: r.toString() + alphabet[c].toString(), color: '#964b00c7' })
                    rows.push(r)
                }
                cols.push(c)
            }
        }
        setLayout(structure)
        setRowsLibrary(rows)
        setColumnsLibrary(cols)
    }

    const handleClose = (l) => {
        setOpen(false)
        setToolsInSd([])
        setToolInSd(null)
    };

    const handleCloseLibraryUpdate = (l) => {
        setOpenLibraryUpdate(false)
        getTools()
        getLibraryStructure()
    };

    const showSubDepartment = (sd) => {
        setSdSelected(sd.name)
        var toolsInSdVar = []
        for (var tool of tools) {
            if (tool.subDepartment === sd.name) {
                toolsInSdVar.push(tool)
            }
        }
        setToolsInSd(toolsInSdVar)
        setOpen(true)
    }

    const showToolInSd = (e, tool) => {
        setToolInSd(tool)
    }

    const showToolFound = (e, tool) => {
        setToolFound(tool)
    }

    // GET
    const getTools = async () => {
        axiosInstance.get('tool')
            .then(res => {
                // console.log("Tools: ", res.data)
                setTools(res.data)
            })
    };
    const getLibraryStructure = async () => {
        axiosInstance.get('structure')
            .then(res => {
                // console.log("Library: ", res.data)
                setLibrary(res.data)
            })
    };
    const getEmployees = async () => {
        axiosInstance.get('employee')
            .then(res => {
                // console.log("Employees: ", res.data)
                setEmployees(res.data)
            })
    }
    const getDepartments = async () => {
        axiosInstance.get('structure')
            .then(res => {
                var depts = res.data
                var openDeps = {}
                var subds = depts.filter((d) => d.father !== undefined)
                for (var deps of subds) {
                    openDeps[deps.name] = false
                }
                setSubDepartments(subds)
                var ds = depts.filter((d) => d.father === undefined)
                setDepartments(ds)
                for (var depd of ds) {
                    openDeps[depd.name] = false
                }
                setOpenPapers(openDeps)
            })
    }
    const getBook = async (label) => {
        let count = 0
        tools.map((b) => {
            if (b.label.toUpperCase() === label.toUpperCase()) {
                count = count + 1
                layout[alphabet.indexOf(b.column)][parseInt(b.row)].color = "green"
                getTools()
                const timer = setTimeout(() => {
                    layout[alphabet.indexOf(b.column)][parseInt(b.row)].color = "#964b00c7"
                    getTools()
                }, 7000);
                return () => clearTimeout(timer);
            }
        })
        if (count === 0) {
            setNotFound(label)
        }
    };

    // POST
    let addBook = () => {
        axiosInstance.post('tool', { label: label, quantity: quantity, lowerBound: lowerBound, price: price, department: department, subDepartment: subDepartment, lastUser: '' })
            .then(response => {
                setConfermaAdd(true)
                getTools()
            }).catch(error => {
                // console.log("error")
                setShowError(true)
            });
    }

    let getQuantity = () => {
        var count = 0
        if (updateBookFlag) {
            for (let t of tools) {
                if (t.label.toUpperCase() === label.toUpperCase()) {
                    setInheritedQuantity(t.quantity)
                    count = count + 1
                }
            }
            if (count === 0) {
                setNotFound(true)
                setInheritedQuantity(0)
            }
        }
    }
    // PUT
    let updateBook = (label, q, user) => {
        var employeeIsPresent = false
        var oldQuantity
        for (let t of tools) {
            if (t.label.toUpperCase() === label.toUpperCase()) {
                oldQuantity = t.quantity
            }
        }
        employees.map((e) => {
            if (e.lastName === user.toLowerCase()) {
                employeeIsPresent = true
            }
        })
        if (employeeIsPresent) {
            setNonExistingEmployee("")
            var bookId = ""
            const newField = { label: label, quantity: oldQuantity + parseInt(q), lastUser: user.toLowerCase() } //, row: r - 1, column: c
            tools.map((b) => {
                if (b.label.toUpperCase() === label.toUpperCase()) {
                    bookId = b._id
                }
            })
            if (bookId !== "") {
                axiosInstance.put("tool/" + bookId, newField).then(response => {
                    // console.log("Fatto!", response)
                    setConfermaUpdate(true)
                    getTools()
                    axiosInstance.post('history/' + label, { user: user.toLowerCase(), tool: label, totalQuantity: oldQuantity + parseInt(q), update: parseInt(q) })
                        .then(response => {
                            console.log("History added!")
                        }).catch(error => {
                            setShowError(true)
                        });
                }).catch((error) => {
                    // console.log("error: ", error)
                    setShowError(true)
                });
            } else {
                setConfermaUpdate(false)
                setNotFound(label)
            }
            getTools()
        } else {
            setNonExistingEmployee(user)
        }

    }

    let updateLibraryLayout = (r, c) => {
        const newField = { rows: parseInt(r), columns: parseInt(c) }
        axiosInstance.put("structure/" + structureId, newField).then(response => {
            getTools()
            getLibraryStructure()
            setOpenLibraryUpdate(false)
        }).catch((error) => {
            console.log("error: ", error)
        });

    }

    let updateOpenPapers = (dep) => {
        var oD = { ...openPapers }
        oD[dep] = !oD[dep]
        setOpenPapers(oD)
    }

    // DELETE
    let deleteBook = (label) => {
        var bookId = ""
        tools.map((b) => {
            if (b.label.toUpperCase() === label.toUpperCase()) {
                bookId = b._id
            }
        })
        if (bookId !== "") {
            axiosInstance.delete('tool/' + bookId)
                .then(() => {
                    setConfermaDelete(true)
                    getTools()
                });
        } else {
            setConfermaDelete(false)
            setNotFound(label)
        }
        getTools()
    }

    return (
        <div style={{ width: '100vw' }}>
            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'times', marginLeft: '1rem', marginRight: 'auto' }}>Magazzino</h1>
                <Tooltip style={{ marginRight: '1rem' }} title="Aggiorna struttura magazzino">
                    <IconButton onClick={() => { setOpenLibraryUpdate(true) }}>
                        <SystemUpdateAltIcon />
                    </IconButton>
                </Tooltip>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginRight: '1rem' }} onClick={handleChangeAddBook}>
                    Aggiungi attrezzo
                </Button>
                <Button variant="outlined" style={{ color: 'white', backgroundColor: 'blue', marginRight: '1rem' }} onClick={handleChangeGetBook}>
                    Trova attrezzo
                </Button>
                <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem', marginRight: '1rem' }} onClick={handleChangeUpdateBook}>
                    Aggiorna attrezzo
                </Button>
                <Button style={{ color: 'white', backgroundColor: 'red', marginLeft: '1rem' }} onClick={handleChangeDeleteBook}>
                    Elimina attrezzo
                </Button>
            </div>
            {
                (!addBookFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Grow
                        in={addBookFlag}
                        style={{ transformOrigin: '0 0 0' }}
                        {...(addBookFlag ? { timeout: 1000 } : {})}
                    >
                        <div style={{ marginTop: '2rem' }}>
                            <div>
                                <input placeholder="attrezzo" onChange={(event) => { setLabel(event.target.value) }} />
                                <input placeholder="quantità" onChange={(event) => { setQuantity(event.target.value) }} />
                                <input placeholder="quantità minima" onChange={(event) => { setLowerBound(event.target.value) }} />
                                <input placeholder="prezzo/pz" onChange={(event) => { setPrice(event.target.value) }} />
                                <input placeholder="reparto" onChange={(event) => { setDepartment(event.target.value) }} />
                                <input placeholder="sotto-reparto" onChange={(event) => { setSubDepartment(event.target.value) }} />
                            </div>
                            <div style={{ marginTop: '2rem' }}>
                                <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }} onClick={addBook}>Conferma</Button>
                            </div>
                        </div>
                    </Grow>
                </Box>)
            }
            {
                (!getBookFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Grow
                        in={getBookFlag}
                        style={{ transformOrigin: '0 0 0', width: "80%" }}
                        {...(getBookFlag ? { timeout: 1000 } : {})}
                    >
                        <div style={{ marginTop: '2rem' }}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={tools}
                                style={{ marginLeft: 'auto', marginRight: "auto" }}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Attrezzi" />}
                                onChange={(event, value) => { showToolFound(event, value) }}
                            />
                            {toolFound === null ? "" : <Card style={{ marginTop: '1rem' }}>
                                <CardContent style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                    <div style={{ marginRight: '3rem' }}>
                                        <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            reparto
                                        </Typography>
                                        <Typography variant="h7" component="div">
                                            {toolFound.department}
                                        </Typography>
                                    </div>
                                    <div style={{ marginRight: '3rem' }}>
                                        <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            sotto-reparto
                                        </Typography>
                                        <Typography variant="h7" component="div">
                                            {toolFound.subDepartment}
                                        </Typography>
                                    </div>
                                    <div style={{ marginRight: '3rem' }}>
                                        <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            quantità
                                        </Typography>
                                        <Typography variant="h7" component="div">
                                            {toolFound.quantity}
                                        </Typography>
                                    </div>
                                    <div style={{ marginRight: '3rem' }}>
                                        <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            quantità minima necessaria
                                        </Typography>
                                        <Typography variant="h7" component="div">
                                            {toolFound.lowerBound}
                                        </Typography>
                                    </div>
                                    <div style={{ marginRight: '3rem' }}>
                                        <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            prezzo d'acquisto (per unità)
                                        </Typography>
                                        <Typography variant="h7" component="div">
                                            {toolFound.price}
                                        </Typography>
                                    </div>
                                    <div style={{ marginRight: '3rem' }}>
                                        <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            ultimo utente
                                        </Typography>
                                        <Typography variant="h7" component="div">
                                            {toolFound.lastUser}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                            }
                        </div>

                    </Grow>
                </Box>)
            }
            {
                (!updateBookFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Grow
                        in={updateBookFlag}
                        style={{ transformOrigin: '0 0 0' }}
                        {...(updateBookFlag ? { timeout: 1000 } : {})}
                    >
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                <input style={{ marginRight: '2rem' }} placeholder="attrezzo" onChange={(event) => {
                                    clearTimeout(timerUpd)
                                    setTimeout(() => {
                                        setLabel(event.target.value)
                                    }, 1000)
                                }} />
                                {inheritedQuantity === -1 ? <TextField
                                    disabled
                                    id="outlined-disabled"
                                    label="quantità attuale presente"
                                    value={0}
                                    onChange={(event) => { handleChangeInheritedQuantity(event) }}
                                /> : <TextField
                                    disabled
                                    id="outlined-disabled"
                                    label="quantità attuale presente"
                                    value={inheritedQuantity}
                                    onChange={(event) => { handleChangeInheritedQuantity(event) }}
                                />}

                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                <input style={{ marginRight: '2rem' }} placeholder="utente (cognome)" onChange={(event) => { setUser(event.target.value.toLowerCase()) }} />
                                <TextField
                                    id="outlined-number"
                                    label="quantità"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(event) => { setQuantity(event.target.value) }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem' }} onClick={() => { updateBook(label, quantity, user) }}>Conferma</Button>
                            </div>
                        </div>
                    </Grow>
                </Box>)
            }
            {
                (!deleteBookFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Grow
                        in={deleteBookFlag}
                        style={{ transformOrigin: '0 0 0' }}
                        {...(deleteBookFlag ? { timeout: 1000 } : {})}
                    >
                        <div style={{ marginTop: '2rem' }}>
                            <div>
                                <input placeholder="attrezzo" onChange={(event) => { setLabel(event.target.value) }} />
                            </div>
                            <div style={{ marginTop: '2rem' }}>
                                <Button style={{ color: 'white', backgroundColor: 'red', marginLeft: '1rem' }} onClick={() => { deleteBook(label) }}>Conferma</Button>
                            </div>
                        </div>
                    </Grow>
                </Box>)
            }

            <div>
                {
                    (!confermaAdd) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">Attrezzo aggiunto correttamente!</Alert>
                }
                {
                    (!confermaUpdate) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">Attrezzo aggiornato correttamente!</Alert>
                }
                {
                    (!confermaDelete) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">Attrezzo eliminato correttamente!</Alert>
                }
                {
                    (notFound === "") ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Attrezzo {notFound} non trovato! Controlla che il attrezzo sia scritto correttamente.</Alert>
                }
                {
                    (showError === false) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Errore. Controlla la connessione o i dati inseriti.</Alert>
                }
                {
                    (nonExistingEmployee === "") ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Utente inserito non presente.</Alert>
                }
            </div>

            {/* WAREHOUSE */}
            {/* <h2 style={{ marginTop: '5rem', fontFamily: 'times', marginLeft: '1rem' }}>Scaffali:</h2>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                {
                    columnsLibrary.map((c) => {
                        return <div style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}><span>{alphabet[c]}</span>
                            <Grid container>
                                {
                                    rowsLibrary.map((r) => {
                                        return <Grid item xs={12}>
                                            <Item onClick={() => { showShelf(r, c) }} className="hovered" style={{ backgroundColor: layout[c][r].color }}>{(r + 1).toString()}</Item>
                                        </Grid>
                                    })
                                }
                            </Grid>
                        </div>
                    })
                }
            </div> */}
            <h2 style={{ marginTop: '5rem', fontFamily: 'times', marginLeft: '1rem' }}>Reparti:</h2>
            <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', marginTop: '4rem', marginBottom: '4rem' }}>
                {
                    departments.map((d) => {
                        return <Accordion
                            expanded={openPapers[d.name] || false}
                            onChange={() => { updateOpenPapers(d.name) }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                            >
                                <Typography variant="h4" sx={{ width: "33%", flexShrink: 0 }}>
                                    {d.name.toUpperCase()}
                                </Typography>
                                {/* <Typography sx={{ color: "text.secondary" }}>
                                    I am an accordion
                                </Typography> */}
                            </AccordionSummary>
                            <AccordionDetails>
                                {
                                    subDepartments.map((sd) => {
                                        if (sd.father === d.name) {
                                            return <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                                <Typography className="hovered" onClick={() => { showSubDepartment(sd) }}>
                                                    {sd.name.toUpperCase()}
                                                </Typography>
                                            </div>
                                        }
                                    })
                                }
                            </AccordionDetails>
                        </Accordion>

                    })
                }
            </div>



            {/* Modal to show tools in the selected shelf */}
            <Modal
                open={open}
                style={{ padding: '5rem' }}
                onClose={() => { handleClose(layout) }}
                aria-labelledby="modal-modal-label"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography style={{ marginBottom: '2rem' }} id="modal-modal-label" variant="h6" component="h2">
                        Cerca un attrezzo nel reparto: {sdSelected.toUpperCase()}
                    </Typography>
                    {/* {
                        (toolsInShelf.length === 0) ? <span style={{ color: 'grey' }}>Nello ripiano selezionato non sono presenti attrezzi.</span> :
                            toolsInShelf.map((bis) => {
                                return <li style={{ marginBottom: '0.5rem' }}>{bis.label} - {bis.quantity}</li>
                            })
                    } */}
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={toolsInSd}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Attrezzi" />}
                        onChange={(event, value) => { showToolInSd(event, value) }}
                    />
                    {toolInSd === null ? "" : <Card style={{ marginTop: '1rem' }} sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Attrezzo
                            </Typography>
                            <Typography variant="h5" component="div">
                                {toolInSd.label.toUpperCase()}
                            </Typography>
                            <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                reparto
                            </Typography>
                            <Typography variant="h7" component="div">
                                {toolInSd.department}
                            </Typography>
                            <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                sotto-reparto
                            </Typography>
                            <Typography variant="h7" component="div">
                                {toolInSd.subDepartment}
                            </Typography>
                            <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                quantità
                            </Typography>
                            <Typography variant="h7" component="div">
                                {toolInSd.quantity}
                            </Typography>
                            <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                quantità minima necessaria
                            </Typography>
                            <Typography variant="h7" component="div">
                                {toolInSd.lowerBound}
                            </Typography>
                            <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                prezzo d'acquisto (per unità)
                            </Typography>
                            <Typography variant="h7" component="div">
                                {toolInSd.price}
                            </Typography>
                            <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                ultimo utente
                            </Typography>
                            <Typography variant="h7" component="div">
                                {toolInSd.lastUser}
                            </Typography>
                        </CardContent>
                    </Card>
                    }
                </Box>
            </Modal>

            {/* Modal to update library structure */}
            <Modal
                open={openLibraryUpdate}
                onClose={() => { handleCloseLibraryUpdate(layout) }}
                aria-labelledby="modal-modal-label"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography style={{ marginBottom: '2rem' }} id="modal-modal-label" variant="h6" component="h2">
                        Seleziona la nuova struttura del tuo magazzino:
                    </Typography>
                    <input placeholder="numero di scaffali" onChange={(event) => { setColumnLayout(event.target.value) }} />
                    <input placeholder="numero di ripiani" onChange={(event) => { setRowLayout(event.target.value) }} />
                    <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem' }} onClick={() => { updateLibraryLayout(rowLayout, columnLayout) }}>Conferma</Button>
                </Box>
            </Modal>

        </div >
    );
}

export default Warehouse;
