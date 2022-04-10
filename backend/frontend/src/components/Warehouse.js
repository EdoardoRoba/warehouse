// import axios from "axios";
import { axiosInstance } from "../config.js"
import * as React from "react";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled, alpha } from '@mui/material/styles';
import Grow from '@mui/material/Grow';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import SettingsIcon from '@material-ui/icons/Settings';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddIcon from '@material-ui/icons/Add';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { AiOutlineInfoCircle } from "react-icons/ai";
import { QrReader } from 'react-qr-reader';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import './Classes.css'
import { makeStyles } from '@mui/styles';

function Warehouse(props) {
    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(true)
    const [timerUpd, setTimerUpd] = React.useState(setTimeout(() => { }, 1000))
    const [tools, setTools] = React.useState([])
    const [employees, setEmployees] = React.useState([])
    const [inheritedQuantity, setInheritedQuantity] = React.useState(-1)
    const [inheritedLowerBound, setInheritedLowerBound] = React.useState(-1)
    const [inheritedDepartment, setInheritedDepartment] = React.useState(-1)
    const [inheritedSubDepartment, setInheritedSubDepartment] = React.useState(-1)
    const [inheritedLastUpdated, setInheritedLastUpdated] = React.useState(-1)
    const [label, setLabel] = React.useState("")
    const [labelToUpdate, setLabelToUpdate] = React.useState("")
    const [code, setCode] = React.useState(null)
    const [codeToUpdate, setCodeToUpdate] = React.useState("")
    const [marca, setMarca] = React.useState(null)
    const [marcaToUpdate, setMarcaToUpdate] = React.useState("")
    const [quantity, setQuantity] = React.useState("")
    const [user, setUser] = React.useState("")
    const [lowerBound, setLowerBound] = React.useState(0)
    const [price, setPrice] = React.useState("")
    const [department, setDepartment] = React.useState("")
    const [departmentToUpdate, setDepartmentToUpdate] = React.useState("")
    const [subDepartment, setSubDepartment] = React.useState("")
    const [subDepartmentToUpdate, setSubDepartmentToUpdate] = React.useState("")
    const [rowLayout, setRowLayout] = React.useState("")
    const [columnLayout, setColumnLayout] = React.useState("")
    const [library, setLibrary] = React.useState(null)
    const [layout, setLayout] = React.useState(null)
    const [rowsLibrary, setRowsLibrary] = React.useState([])
    const [columnsLibrary, setColumnsLibrary] = React.useState([])
    const [open, setOpen] = React.useState(false);
    const [openLibraryAdd, setOpenLibraryAdd] = React.useState(false);
    const [openQrCode, setOpenQrCode] = React.useState(false);
    const [toolsInShelf, setToolsInShelf] = React.useState([])
    const [shelfRowSelected, setShelfRowSelected] = React.useState("")
    const [shelfColumnSelected, setShelfColumnSelected] = React.useState("")
    const [addBookFlag, setAddBookFlag] = React.useState(false);
    const [getBookFlag, setGetBookFlag] = React.useState(false);
    const [updateAddBookFlag, setUpdateAddBookFlag] = React.useState(false);
    const [updateRemoveBookFlag, setUpdateRemoveBookFlag] = React.useState(false);
    const [updateBookFlag, setUpdateBookFlag] = React.useState(false);
    const [updateBookListFlag, setUpdateBookListFlag] = React.useState(false);
    const [deleteBookFlag, setDeleteBookFlag] = React.useState(false);
    const [confermaAdd, setConfermaAdd] = React.useState(false);
    const [confermaUpdate, setConfermaUpdate] = React.useState(false);
    const [confermaDelete, setConfermaDelete] = React.useState(false);
    const [notFound, setNotFound] = React.useState("");
    const [showError, setShowError] = React.useState(false);
    const [nonExistingEmployee, setNonExistingEmployee] = React.useState("");
    const [departments, setDepartments] = React.useState([]);
    const [subDepartments, setSubDepartments] = React.useState([]);
    const [allDeps, setAllDeps] = React.useState([]);
    const [subDepartmentsForMenu, setSubDepartmentsForMenu] = React.useState([]);
    const [openPapers, setOpenPapers] = React.useState({});
    const [sdSelected, setSdSelected] = React.useState("");
    const [toolsInSd, setToolsInSd] = React.useState([]);
    const [toolInSd, setToolInSd] = React.useState(null);
    const [toolFound, setToolFound] = React.useState(null);
    const [isSubDep, setIsSubDep] = React.useState(false);
    const [addingDepartment, setAddingDepartment] = React.useState("");
    const [addingSubDepartment, setAddingSubDepartment] = React.useState("");
    const [disabledSDMenu, setDisabledSDMenu] = React.useState(true);
    const [showQuestionDelete, setShowQuestionDelete] = React.useState(false);
    const [auths, setAuths] = React.useState([{}])
    const [openEditDeps, setOpenEditDeps] = React.useState(false)
    const [editedDepartmentLabel, seteditedDepartmentLabel] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true);
    const [qrData, setQrData] = React.useState('No result');

    const structureId = "6205a1c27f6cda42c2064a0f"
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "Z"]
    const beUrl = "http://localhost:8050/"
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const useStyles = makeStyles((theme) => ({
        backdrop: {
            zIndex: 999,
            color: '#fff',
        },
    }));

    const classes = useStyles();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    // whenever the page reloads (renders), the hook "useEffect" is called
    React.useEffect(() => {
        setIsLoading(true)
        getTools()
        getEmployees()
        getDepartments()
        userIsAuthenticated()
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
        // if (library !== null) {
        //     createLibrary()
        // }
    }, [library])

    React.useEffect(() => {
        getQuantity()
        getInheritedDeps()
        getInheritedLastUpdated()
        // console.log("toolFound: ", toolFound)
    }, [toolFound])

    React.useEffect(() => {
        // console.log("layout: ", layout)
    }, [layout])

    React.useEffect(() => {
        // console.log("inheritedDepartment: ", inheritedDepartment)
    }, [inheritedDepartment])

    React.useEffect(() => {
        // console.log("user: ", user)
    }, [user])

    React.useEffect(() => {
        // console.log("departments: ", departments)
    }, [departments])

    React.useEffect(() => {
        // window.location.reload(true);
    }, [userIsAuthenticatedFlag])

    React.useEffect(() => {
        // console.log("subDepartments: ", subDepartments)
    }, [subDepartments])

    React.useEffect(() => {
        // console.log("subDepartment: ", subDepartment)
    }, [subDepartment])

    React.useEffect(() => {
        // console.log("department: ", department)
    }, [department])

    React.useEffect(() => {
        // console.log("tools: ", tools)
        getQuantity()
    }, [tools])

    React.useEffect(() => {
        // console.log("openPapers: ", openPapers)
    }, [openPapers])

    React.useEffect(() => {
        // console.log("label: ", label)
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
        // console.log("employees: ", employees)
    }, [employees])

    React.useEffect(() => {
        // console.log("columnsLibrary: ", columnsLibrary)
    }, [columnsLibrary])

    React.useEffect(() => {
        // console.log("rowsLibrary: ", rowsLibrary)
    }, [rowsLibrary])

    React.useEffect(() => {
        // console.log("subDepartmentsForMenu: ", subDepartmentsForMenu)
    }, [subDepartmentsForMenu])

    const userIsAuthenticated = () => {
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
                    var a = {}
                    for (let au of localStorage.getItem("auths").split(',')) {
                        a[au.split(":")[0]] = au.split(":")[1]
                    }
                    setAuths(a)
                    setIsLoading(false)
                }).catch(error => {
                    console.log(error)
                    setUserIsAuthenticatedFlag(false)
                    setIsLoading(false)
                });
            } else {
                setUserIsAuthenticatedFlag(false)
                setIsLoading(false)
            }
        } else {
            setUserIsAuthenticatedFlag(false)
            setIsLoading(false)
        }
    }

    const handleErrorWebCam = (error) => {
        console.log(error);
    }

    const handleScanWebCam = (result) => {
        console.log("prova ", result)
        if (result) {
            setQrData(result);
            console.log("qrData: ", result)
            setOpenQrCode(false)
        }
    }

    const handleChangeAddBook = () => {
        setAddBookFlag((prev) => !prev);
        setUpdateRemoveBookFlag(false);
        setUpdateAddBookFlag(false);
        setUpdateBookFlag(false);
        setDeleteBookFlag(false);
        setGetBookFlag(false);
        setLabel("")
        setCode("")
        setMarca("")
        setQuantity("")
        setPrice("")
        setLowerBound(0)
        setUser("")
        setLabelToUpdate("")
        setMarcaToUpdate("")
        setCodeToUpdate("")
        setDepartmentToUpdate("")
        setSubDepartmentToUpdate("")
        setInheritedLowerBound(-1)
        setInheritedQuantity(-1)
        setInheritedDepartment(-1)
        setInheritedSubDepartment(-1)
        setInheritedLastUpdated(-1)
        setDisabledSDMenu(true)
        setSubDepartmentsForMenu([])
        setShowQuestionDelete(false)
        setToolFound(null)
    };

    const handleChangeGetBook = () => {
        setGetBookFlag((prev) => !prev);
        setUpdateRemoveBookFlag(false);
        setUpdateAddBookFlag(false);
        setUpdateBookFlag(false);
        setDeleteBookFlag(false);
        setAddBookFlag(false);
        setLabel("")
        setQuantity("")
        setPrice("")
        setCode("")
        setMarca("")
        setLowerBound(0)
        setUser("")
        setLabelToUpdate("")
        setMarcaToUpdate("")
        setCodeToUpdate("")
        setDepartmentToUpdate("")
        setSubDepartmentToUpdate("")
        setInheritedLowerBound(-1)
        setInheritedQuantity(-1)
        setInheritedDepartment(-1)
        setInheritedSubDepartment(-1)
        setInheritedLastUpdated(-1)
        setDisabledSDMenu(true)
        setSubDepartmentsForMenu([])
        setShowQuestionDelete(false)
        setToolFound(null)
    };

    const handleChangeUpdateAddBook = () => {
        setUpdateAddBookFlag((prev) => !prev);
        setUpdateRemoveBookFlag(false);
        setUpdateBookFlag(false);
        setAddBookFlag(false);
        setDeleteBookFlag(false);
        setGetBookFlag(false);
        setLabel("")
        setLabelToUpdate("")
        setMarcaToUpdate("")
        setCodeToUpdate("")
        setDepartmentToUpdate("")
        setSubDepartmentToUpdate("")
        setQuantity("")
        setPrice("")
        setCode("")
        setMarca("")
        setLowerBound(0)
        setUser("")
        setInheritedLowerBound(-1)
        setInheritedQuantity(-1)
        setInheritedDepartment(-1)
        setInheritedSubDepartment(-1)
        setInheritedLastUpdated(-1)
        setDisabledSDMenu(true)
        setSubDepartmentsForMenu([])
        setShowQuestionDelete(false)
        setToolFound(null)
    };

    const handleChangeUpdateRemoveBook = () => {
        setUpdateRemoveBookFlag((prev) => !prev);
        setUpdateAddBookFlag(false);
        setUpdateBookFlag(false);
        setAddBookFlag(false);
        setDeleteBookFlag(false);
        setGetBookFlag(false);
        setLabel("")
        setLabelToUpdate("")
        setMarcaToUpdate("")
        setCodeToUpdate("")
        setDepartmentToUpdate("")
        setSubDepartmentToUpdate("")
        setQuantity("")
        setPrice("")
        setCode("")
        setMarca("")
        setLowerBound(0)
        setUser("")
        setInheritedLowerBound(-1)
        setInheritedQuantity(-1)
        setInheritedDepartment(-1)
        setInheritedSubDepartment(-1)
        setInheritedLastUpdated(-1)
        setDisabledSDMenu(true)
        setSubDepartmentsForMenu([])
        setShowQuestionDelete(false)
        setToolFound(null)
    };

    const handleChangeUpdateBook = () => {
        setUpdateBookFlag((prev) => !prev);
        setUpdateAddBookFlag(false);
        setUpdateRemoveBookFlag(false);
        setAddBookFlag(false);
        setDeleteBookFlag(false);
        setGetBookFlag(false);
        setLabel("")
        setLabelToUpdate("")
        setMarcaToUpdate("")
        setCodeToUpdate("")
        setDepartmentToUpdate("")
        setSubDepartmentToUpdate("")
        setQuantity("")
        setPrice("")
        setCode("")
        setMarca("")
        setLowerBound(0)
        setUser("")
        setInheritedLowerBound(-1)
        setInheritedQuantity(-1)
        setInheritedDepartment(-1)
        setInheritedSubDepartment(-1)
        setInheritedLastUpdated(-1)
        setDisabledSDMenu(true)
        setSubDepartmentsForMenu([])
        setShowQuestionDelete(false)
        setToolFound(null)
    };

    const handleChangeDeleteBook = () => {
        setDeleteBookFlag((prev) => !prev);
        setUpdateRemoveBookFlag(false);
        setUpdateAddBookFlag(false);
        setUpdateBookFlag(false);
        setAddBookFlag(false);
        setGetBookFlag(false);
        setLabel("")
        setLabelToUpdate("")
        setMarcaToUpdate("")
        setCodeToUpdate("")
        setDepartmentToUpdate("")
        setSubDepartmentToUpdate("")
        setQuantity("")
        setPrice("")
        setCode("")
        setMarca("")
        setLowerBound(0)
        setUser("")
        setInheritedLowerBound(-1)
        setInheritedQuantity(-1)
        setInheritedDepartment(-1)
        setInheritedSubDepartment(-1)
        setInheritedLastUpdated(-1)
        setDisabledSDMenu(true)
        setSubDepartmentsForMenu([])
        setShowQuestionDelete(false)
        setToolFound(null)
    };

    const handleChangeInheritedQuantity = (event) => {
        setInheritedQuantity(event)
    }

    const handleChangeInheritedLowerBound = (event) => {
        setInheritedLowerBound(event)
    }

    const handleChangeInheritedDepartment = (event) => {
        setInheritedDepartment(event)
    }

    const handleChangeInheritedSubDepartment = (event) => {
        setInheritedSubDepartment(event)
    }

    const handleChangeInheritedLastUpdated = (event) => {
        setInheritedLastUpdated(event)
    }

    const handleChangeSwitch = () => {
        setIsSubDep((prev) => !prev)
    }

    const handleClose = (l) => {
        setOpen(false)
        setUpdateBookListFlag(false)
        setToolInSd({})
        setInheritedDepartment("")
        setInheritedLowerBound(-1)
        setInheritedQuantity(-1)
        setInheritedLastUpdated(-1)
        setInheritedSubDepartment("")
        setLabelToUpdate("")
        setMarcaToUpdate("")
        setCodeToUpdate("")
        setDepartmentToUpdate("")
        setSubDepartmentToUpdate("")
    };

    const handleCloseLibraryUpdate = () => {
        setOpenLibraryAdd(false)
        getTools()
        getDepartments()
        setAddingDepartment("")
        setAddingSubDepartment("")
    };

    const handleCloseQrCode = () => {
        setOpenQrCode(false)
        getTools()
    }

    const handleCloseEditDeps = () => {
        setOpenLibraryAdd(false)
        setOpenEditDeps(false)
        getTools()
        getDepartments()
        setAddingDepartment("")
        setAddingSubDepartment("")
    };

    const showSubDepartment = (sd) => {
        setSdSelected(sd.label)
        var toolsInSdVar = []
        for (var tool of tools) {
            if (tool.subDepartment === sd.label) {
                toolsInSdVar.push(tool)
            }
        }
        toolsInSdVar.sort((a, b) => (a.label.toUpperCase() > b.label.toUpperCase()) ? 1 : -1)
        setToolsInSd(toolsInSdVar)
        updateOpenPapers(sd.label)
        // setOpen(true)
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
                let ts = res.data
                ts.sort((a, b) => (a.label.toUpperCase() > b.label.toUpperCase()) ? 1 : -1)
                setTools(ts)
                setIsLoading(false)
            })
    };

    const getEmployees = async () => {
        axiosInstance.get('employee')
            .then(res => {
                // console.log("Employees: ", res.data)
                setEmployees(res.data)
                setIsLoading(false)
            })
    }
    const getDepartments = async () => {
        axiosInstance.get('structure')
            .then(res => {
                var depts = res.data
                setAllDeps(depts)
                var openDeps = {}
                var subds = depts.filter((d) => (d.father !== undefined && d.father !== ""))
                subds.sort((a, b) => (a.label.toUpperCase() > b.label.toUpperCase()) ? 1 : -1)
                setSubDepartments(subds)
                for (var deps of subds) {
                    openDeps[deps.label] = false
                }
                var ds = depts.filter((d) => d.father === undefined || d.father === "")
                ds.sort((a, b) => (a.label.toUpperCase() > b.label.toUpperCase()) ? 1 : -1)
                setDepartments(ds)
                for (var depd of ds) {
                    openDeps[depd.label] = false
                }
                setOpenPapers(openDeps)
                setIsLoading(false)
            })
    }

    // POST
    let addTool = () => {
        axiosInstance.post('tool', { label: label.toUpperCase(), quantity: quantity, lowerBound: lowerBound, price: price, department: department, subDepartment: subDepartment, lastUser: '', code: code, marca: marca })
            .then(response => {
                setConfermaAdd(true)
                getTools()
                setIsLoading(false)
            }).catch(error => {
                // console.log("error")
                setShowError(true)
                setIsLoading(false)
            });
    }

    let getQuantity = () => {
        var count = 0
        if ((updateAddBookFlag || updateRemoveBookFlag || updateBookFlag || updateBookListFlag) && toolFound !== null && labelToUpdate === "") {
            for (let t of tools) {
                if (t.label.toUpperCase() === toolFound.label.toUpperCase()) {
                    setInheritedQuantity(t.quantity)
                    setInheritedLowerBound(t.lowerBound)
                    count = count + 1
                }
            }
            if (count === 0) {
                setNotFound(true)
                setInheritedQuantity(0)
                setInheritedLowerBound(0)
            }
        }
    }

    let getInheritedDeps = () => {
        var count = 0
        if ((updateAddBookFlag || updateRemoveBookFlag || updateBookFlag || updateBookListFlag) && toolFound !== null && labelToUpdate === "") {
            for (let t of tools) {
                if (t.label.toUpperCase() === toolFound.label.toUpperCase()) {
                    setInheritedDepartment(t.department)
                    setInheritedSubDepartment(t.subDepartment)
                    count = count + 1
                }
            }
            if (count === 0) {
                setNotFound(true)
                setInheritedDepartment(0)
                setInheritedSubDepartment(0)
            }
        }
    }

    let getInheritedLastUpdated = () => {
        var count = 0
        if ((updateAddBookFlag || updateRemoveBookFlag || updateBookFlag || updateBookListFlag) && toolFound !== null && labelToUpdate === "") {
            for (let t of tools) {
                if (t.label.toUpperCase() === toolFound.label.toUpperCase()) {
                    setInheritedLastUpdated(t.updatedAt.replace("T", " ").replace("Z", " "))
                    count = count + 1
                }
            }
            if (count === 0) {
                setNotFound(true)
                setInheritedLastUpdated(0)
            }
        }
    }

    const exportToCSV = () => { // csvData, fileName
        // var csvData = [{ name: 'name1', lastName: 'lastName1' }, { name: 'name2', lastName: 'lastName2' }]
        var csvData = []
        for (let t of tools) {
            var toolForCsv = {}
            toolForCsv.reparto = t.department
            toolForCsv.sottoreparto = t.subDepartment
            toolForCsv.attrezzo = t.label
            toolForCsv.codice = t.code
            toolForCsv.quantita = t.quantity
            toolForCsv.quantita_minima = t.lowerBound
            csvData.push(toolForCsv)
        }
        let fileName = "prodotti_in_magazzino"
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const exportToCSVAlert = () => { // csvData, fileName
        // var csvData = [{ name: 'name1', lastName: 'lastName1' }, { name: 'name2', lastName: 'lastName2' }]
        var csvData = []
        for (let t of tools) {
            if (t.quantity < t.lowerBound) {
                var toolForCsv = {}
                toolForCsv.reparto = t.department
                toolForCsv.sottoreparto = t.subDepartment
                toolForCsv.attrezzo = t.label
                toolForCsv.codice = t.code
                toolForCsv.quantita = t.quantity
                toolForCsv.quantita_minima = t.lowerBound
                csvData.push(toolForCsv)
            }
        }
        let fileName = "prodotti_sotto_soglia_minima"
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    let handleChangeDepMenu = (e, value) => {
        setDepartment(value)
        // console.log(value)
        if (value !== null) {
            let sdMenu = subDepartments.filter((sd) => {
                return sd.father === value.label
            })
            setSubDepartmentsForMenu(sdMenu)
            setDisabledSDMenu(false)
            setDepartment(value.label)
        }
    }

    let handleChangeEditDep = (e, value) => {
        setDepartmentToUpdate(value)
    }

    const editDepartment = () => {
        axiosInstance.put("structure/" + departmentToUpdate._id, { label: editedDepartmentLabel }).then(response => {
            console.log("Reparto aggiornato!")
            handleCloseEditDeps()
            setIsLoading(false)
        }).catch(error => {
            setShowError(true)
            setIsLoading(false)
        });
    }

    let handleChangeDepMenuToUpdate = (e, value) => {
        setDepartmentToUpdate(value)
        // console.log(value)
        if (value !== null) {
            let sdMenu = subDepartments.filter((sd) => {
                return sd.father === value.label
            })
            setSubDepartmentsForMenu(sdMenu)
            setDisabledSDMenu(false)
            setDepartmentToUpdate(value.label)
        }
    }

    // PUT
    let updateBook = (label, q, user, lb) => {
        var employeeIsPresent = false
        var oldQuantity
        if (lb === 0) {
            lb = inheritedLowerBound
        }
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
            var newField = {}
            if (updateAddBookFlag) {
                newField = { label: label.toLowerCase(), quantity: oldQuantity + parseInt(q), lastUser: user.toLowerCase(), lowerBound: parseInt(lb) } //, row: r - 1, column: c
            }
            if (updateRemoveBookFlag) {
                newField = { label: label.toLowerCase(), quantity: oldQuantity - parseInt(q), lastUser: user.toLowerCase(), lowerBound: parseInt(lb) } //, row: r - 1, column: c
            }
            setInheritedLowerBound(parseInt(lb))
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
                    var upds = {}
                    if (updateAddBookFlag) {
                        upds = { user: user.toLowerCase(), tool: label, totalQuantity: oldQuantity + parseInt(q), update: parseInt(q) } //, row: r - 1, column: c
                    }
                    if (updateRemoveBookFlag) {
                        upds = { user: user.toLowerCase(), tool: label, totalQuantity: oldQuantity - parseInt(q), update: -parseInt(q) } //, row: r - 1, column: c
                    }
                    axiosInstance.post('history/' + label, upds)
                        .then(response => {
                            console.log("History added!")
                            setIsLoading(false)
                        }).catch(error => {
                            setShowError(true)
                            setIsLoading(false)
                        });
                }).catch((error) => {
                    // console.log("error: ", error)
                    setShowError(true)
                    setIsLoading(false)
                });
            } else {
                setConfermaUpdate(false)
                setNotFound(label)
                setIsLoading(false)
            }
            getTools()
        } else {
            setNonExistingEmployee(user)
            setIsLoading(false)
        }

    }

    let updateEntireBook = (labelU, lb) => {
        if (lb === 0) {
            lb = inheritedLowerBound
        }
        var bookId = ""
        var newField = {}
        if (lb !== "") {
            newField["lowerBound"] = parseInt(lb)
        }
        if (labelToUpdate !== "") {
            newField["label"] = labelToUpdate.toLowerCase()
        }
        if (marcaToUpdate !== "") {
            newField["marca"] = marcaToUpdate.toLowerCase()
        }
        if (codeToUpdate !== "") {
            newField["code"] = codeToUpdate.toLowerCase()
        }
        if (departmentToUpdate !== "") {
            newField["department"] = departmentToUpdate.toLowerCase()
        }
        if (subDepartmentToUpdate !== "") {
            newField["subDepartment"] = subDepartmentToUpdate.toLowerCase()
        }
        setInheritedLowerBound(parseInt(lb))
        tools.map((b) => {
            if (b.label.toUpperCase() === labelU.toUpperCase()) {
                bookId = b._id
            }
        })
        if (bookId !== "") {
            axiosInstance.put("tool/" + bookId, newField).then(response => {
                // console.log("Fatto!", response)
                if (toolInSd !== null) {
                    closeOpenPaper(toolInSd.subDepartment)
                }
                setConfermaUpdate(true)
                getTools()
                setInheritedDepartment(departmentToUpdate)
                setInheritedSubDepartment(subDepartmentToUpdate)
                setTimeout(() => {
                    setLabelToUpdate("")
                }, 1000)
                setOpen(false)
                setIsLoading(false)
            }).catch((error) => {
                // console.log("error: ", error)
                setIsLoading(false)
                setShowError(true)
            });
        } else {
            setConfermaUpdate(false)
            setNotFound(label)
            setIsLoading(false)
        }
        getTools()

    }

    let addDepartment = () => {
        var name = ""
        var father = ""
        if (addingSubDepartment !== "") {
            name = addingSubDepartment
            father = addingDepartment
        } else {
            name = addingDepartment
        }
        axiosInstance.post('structure', { label: name.toLowerCase(), father: father.toLowerCase() }).then(response => {
            handleCloseLibraryUpdate()
            setIsLoading(false)
        }).catch(error => {
            // console.log("error")
            setShowError(true)
            setIsLoading(false)
        });
    }

    let updateOpenPapers = (dep) => {
        var oD = { ...openPapers }
        oD[dep] = !oD[dep]
        setOpenPapers(oD)
    }

    let closeOpenPaper = (dep) => {
        var oD = { ...openPapers }
        oD[dep] = false
        setOpenPapers(oD)
    }

    // DELETE
    let deleteTool = (label) => {
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
                    setIsLoading(false)
                }).catch(error => {
                    console.log(error)
                    setShowError(true)
                    setIsLoading(false)
                });
        } else {
            setConfermaDelete(false)
            setNotFound(label)
            setIsLoading(false)
        }
        getTools()
    }

    return (
        <div style={{ width: '100vw' }}>
            {
                !userIsAuthenticatedFlag ? <div>
                    <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert>
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}><Button variant="outlined" onClick={() => { window.location.reload(true) }} style={{ color: 'white', backgroundColor: 'green', marginTop: '8rem' }}><Link style={{ color: 'white' }} to={"/login"}>Vai al Login</Link></Button></div>
                </div> :
                    <div>
                        {
                            isLoading ? <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', zIndex: "999" }}>
                                <CircularProgress style={{ position: 'fixed', marginTop: '3rem' }} />
                            </div> :
                                <div style={{ zIndex: '-1', width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                        <h1 style={{ fontFamily: 'times', marginLeft: '1rem', marginRight: 'auto' }}>Magazzino</h1>
                                        {
                                            auths["warehouse"] === "installer" ? "" : <Tooltip style={{ marginRight: '1rem' }} title="Aggiorna struttura magazzino">
                                                <IconButton onClick={() => { setOpenLibraryAdd(true) }}>
                                                    <SettingsIcon />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    </div>
                                    {/* <div style={{ zIndex: '1', width: '50%', height: '100px' }}>
                                    <h3>Scannerizza:</h3>
                                    <IconButton onClick={() => { setOpenQrCode(true) }}>
                                        <PhotoCameraIcon />
                                    </IconButton>
    
                                    <p>{qrData}</p>
                                </div> */}
                                    {/* <div rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}> */}
                                    {/* <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '80%' }}> */}
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" style={{ marginLeft: '1rem', marginRight: '1rem', marginTop: '2rem' }}>
                                        {
                                            auths["warehouse"] === "installer" ? "" :
                                                <Grid item xs={12} sm={2} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '80%' }}>
                                                    <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }} onClick={handleChangeAddBook}>
                                                        Aggiungi nuovo prodotto
                                                    </Button>
                                                </Grid>
                                        }
                                        <Grid item xs={12} sm={2} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '80%' }}>
                                            <Button variant="outlined" style={{ color: 'white', backgroundColor: 'blue' }} onClick={handleChangeGetBook}>
                                                Trova prodotto
                                            </Button>
                                        </Grid>
                                        {
                                            auths["warehouse"] === "installer" ? "" :
                                                <Grid item xs={12} sm={2} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '80%' }}>
                                                    <Button style={{ color: 'white', backgroundColor: '#ffae1b' }} onClick={handleChangeUpdateAddBook}>
                                                        Aumenta quantità prodotto
                                                    </Button>
                                                </Grid>
                                        }
                                        <Grid item xs={12} sm={2} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '80%' }}>
                                            <Button style={{ color: 'white', backgroundColor: '#ffae1b' }} onClick={handleChangeUpdateRemoveBook}>
                                                Diminuisci quantità prodotto
                                            </Button>
                                        </Grid>
                                        {
                                            auths["warehouse"] !== "*" ? "" :
                                                <Grid item xs={12} sm={2} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '80%' }}>
                                                    <Button style={{ color: 'white', backgroundColor: '#ffae1b' }} onClick={handleChangeUpdateBook}>
                                                        Modifica prodotto
                                                    </Button>
                                                </Grid>
                                        }
                                        {
                                            auths["warehouse"] === "installer" ? "" :
                                                <Grid item xs={12} sm={2} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '80%' }}>
                                                    <Button style={{ color: 'white', backgroundColor: 'red' }} onClick={handleChangeDeleteBook}>
                                                        Elimina prodotto
                                                    </Button>
                                                </Grid>
                                        }
                                    </Grid>
                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                        <Grid>
                                            <Tooltip title="Scarica catalogo prodotti">
                                                <IconButton
                                                    onClick={() => { exportToCSV() }}>
                                                    <GetAppIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                        <Grid>
                                            <Tooltip style={{ marginRight: '1rem' }} title="Scarica catalogo prodotti sotto la soglia minima">
                                                <IconButton
                                                    onClick={() => { exportToCSVAlert() }}>
                                                    <GetAppIcon style={{ color: 'red' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </div>

                                    {/* </Grid>
                                    </Grid> */}
                                    {/* </div> */}
                                    {
                                        (!addBookFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                            <Grow
                                                in={addBookFlag}
                                                style={{ transformOrigin: '0 0 0' }}
                                                {...(addBookFlag ? { timeout: 1000 } : {})}
                                            >
                                                <div>
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ marginTop: '2rem' }} justifyContent="center" >
                                                        {/* <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '80%' }}> */}
                                                        {/* <div style={{ marginBottom: '1rem' }}> */}
                                                        <input item xs={12} sm={2} style={{ marginRight: '1rem' }} placeholder="prodotto" onChange={(event) => { setLabel(event.target.value) }} />
                                                        <input item xs={12} sm={2} style={{ marginRight: '1rem' }} placeholder="quantità" onChange={(event) => { setQuantity(event.target.value) }} />
                                                        <input item xs={12} sm={2} style={{ marginRight: '1rem' }} placeholder="quantità minima" onChange={(event) => { setLowerBound(event.target.value) }} />
                                                        {/* </div> */}
                                                        {/* <div style={{ marginBottom: '1rem' }}> */}
                                                        <input item xs={12} sm={2} style={{ marginRight: '1rem' }} placeholder="prezzo/pz" onChange={(event) => { setPrice(event.target.value) }} />
                                                        <input item xs={12} sm={2} style={{ marginRight: '1rem' }} placeholder="codice" onChange={(event) => { setCode(event.target.value) }} />
                                                        <input item xs={12} sm={2} placeholder="marca" onChange={(event) => { setMarca(event.target.value) }} />
                                                        {/* </div> */}
                                                        {/* <div> */}
                                                        {/* <div item xs={12} sm={6} style={{ marginTop: '1rem' }}> */}
                                                        <Autocomplete
                                                            disablePortal
                                                            item xs={12} sm={6}
                                                            id="combo-box-demo"
                                                            options={departments}
                                                            style={{ marginLeft: "auto", marginTop: '1rem' }}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="reparti" />}
                                                            onChange={(event, value) => {
                                                                handleChangeDepMenu(event, value)
                                                            }}
                                                        />
                                                        <Autocomplete
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            item xs={12} sm={6}
                                                            disabled={disabledSDMenu}
                                                            options={subDepartmentsForMenu}
                                                            style={{ marginRight: 'auto', marginTop: '1rem' }}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="sotto-reparti" />}
                                                            onChange={(event, value) => {
                                                                if (value !== null) {
                                                                    setSubDepartment(value.label)
                                                                }
                                                            }}
                                                        />
                                                        {/* </div> */}

                                                        {/* </div> */}
                                                    </Grid>
                                                    <div item xs={12} sm={12} style={{ marginTop: '2rem' }}>
                                                        <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }} onClick={() => {
                                                            addTool()
                                                            setIsLoading(true)
                                                        }}>Conferma</Button>
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
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ marginTop: '2rem' }} justifyContent="center" >
                                                        {/* <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}> */}
                                                        <Autocomplete
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            options={tools}
                                                            item xs={12} sm={6}
                                                            style={{ marginLeft: 'auto', marginRight: "auto" }}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="prodotti (per nome)" />}
                                                            onChange={(event, value) => { showToolFound(event, value) }}
                                                        />
                                                        <Autocomplete
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            options={tools}
                                                            item xs={12} sm={6}
                                                            style={{ marginLeft: 'auto', marginRight: "auto" }}
                                                            sx={{ width: 300 }}
                                                            getOptionLabel={option => option.code}
                                                            renderInput={(params) => <TextField {...params} label="prodotti (per codice)" />}
                                                            onChange={(event, value) => { showToolFound(event, value) }}
                                                        />
                                                        {/* </div> */}
                                                    </Grid>
                                                    {toolFound === null ? "" : <Card style={{ marginTop: '1rem' }}>
                                                        <CardContent style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                            <div style={{ marginRight: '3rem' }}>
                                                                <Typography style={{ marginTop: '1rem' }} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                                    prodotto
                                                                </Typography>
                                                                <Typography variant="h7" component="div">
                                                                    {toolFound.label}
                                                                </Typography>
                                                            </div>
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
                                                                    codice prodotto
                                                                </Typography>
                                                                <Typography variant="h7" component="div">
                                                                    {toolFound.code}
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
                                        (!updateAddBookFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                            <Grow
                                                in={updateAddBookFlag}
                                                style={{ transformOrigin: '0 0 0' }}
                                                {...(updateAddBookFlag ? { timeout: 1000 } : {})}
                                            >
                                                <div style={{ marginTop: '2rem' }}>
                                                    {/* <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}> */}
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ marginTop: '2rem' }} justifyContent="center" >
                                                        {/* <input style={{ marginRight: '2rem' }} placeholder="prodotto" onChange={(event) => {
                                                    clearTimeout(timerUpd)
                                                    setTimeout(() => {
                                                        setLabel(event.target.value)
                                                    }, 1000)
                                                }} /> */}
                                                        <Autocomplete
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            options={tools}
                                                            item xs={12} sm={6}
                                                            style={{ marginLeft: 'auto', marginRight: "2rem" }}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="prodotti" />}
                                                            onChange={(event, value) => {
                                                                clearTimeout(timerUpd)
                                                                setTimeout(() => {
                                                                    // setLabel(value)
                                                                    setToolFound(value)
                                                                }, 1000)
                                                            }}
                                                        />
                                                        {inheritedQuantity === -1 ? <TextField
                                                            disabled
                                                            id="outlined-disabled"
                                                            label="quantità attuale presente"
                                                            value={0}
                                                            item xs={12} sm={6}
                                                            onChange={(event) => { handleChangeInheritedQuantity(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            label="quantità attuale presente"
                                                            value={inheritedQuantity}
                                                            onChange={(event) => { handleChangeInheritedQuantity(event) }}
                                                        />}
                                                        {inheritedLowerBound === -1 ? <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            label="quantità minima attuale richiesta"
                                                            value={0}
                                                            onChange={(event) => { handleChangeInheritedLowerBound(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            label="quantità minima attuale richiesta"
                                                            value={inheritedLowerBound}
                                                            onChange={(event) => { handleChangeInheritedLowerBound(event) }}
                                                        />}
                                                        {inheritedLastUpdated === -1 ? <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            style={{ marginRight: "2rem" }}
                                                            label="ultima modifica"
                                                            value={""}
                                                            onChange={(event) => { handleChangeInheritedLastUpdated(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            style={{ marginRight: "2rem" }}
                                                            id="outlined-disabled"
                                                            label="ultima modifica"
                                                            value={inheritedLastUpdated}
                                                            onChange={(event) => { handleChangeInheritedLastUpdated(event) }}
                                                        />}
                                                    </Grid>
                                                    {/* </div> */}
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1rem' }}>
                                                        {/* <input style={{ marginRight: '2rem' }} placeholder="utente (cognome)" onChange={(event) => { setUser(event.target.value.toLowerCase()) }} /> */}
                                                        <Autocomplete
                                                            disablePortal
                                                            item xs={12} sm={6}
                                                            id="combo-box-demo"
                                                            options={employees}
                                                            style={{ marginLeft: 'auto', marginRight: "2rem" }}
                                                            sx={{ width: 300 }}
                                                            getOptionLabel={option => option.lastName}
                                                            renderInput={(params) => <TextField {...params} label="dipendente" />}
                                                            onChange={(event, value) => { setUser(value.lastName.toLowerCase()) }}
                                                        />
                                                        <TextField
                                                            id="outlined-number"
                                                            item xs={12} sm={6}
                                                            label="quantità"
                                                            type="number"
                                                            style={{ width: '30%' }}
                                                            inputProps={{ min: 0 }}
                                                            onChange={(event) => { setQuantity(event.target.value) }}
                                                        />
                                                        {
                                                            inheritedLowerBound === -1 ? <TextField
                                                                id="outlined-number"
                                                                label="quantità minima"
                                                                item xs={12} sm={6}
                                                                type="number"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                value={0}
                                                                onChange={(event) => { setLowerBound(event.target.value) }}
                                                            /> : <TextField
                                                                id="outlined-number"
                                                                item xs={12} sm={6}
                                                                label="quantità minima"
                                                                type="number"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                value={inheritedLowerBound}
                                                                onChange={(event) => {
                                                                    setLowerBound(event.target.value)
                                                                    setInheritedLowerBound(event.target.value)
                                                                }}
                                                            />
                                                        }

                                                    </Grid>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                                        <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem' }} onClick={() => {
                                                            updateBook(toolFound.label, quantity, user, lowerBound)
                                                            setIsLoading(true)
                                                        }}>Aggiungi quantità inserita</Button>
                                                    </div>
                                                </div>
                                            </Grow>
                                        </Box>)
                                    }
                                    {
                                        (!updateRemoveBookFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                            <Grow
                                                in={updateRemoveBookFlag}
                                                style={{ transformOrigin: '0 0 0' }}
                                                {...(updateRemoveBookFlag ? { timeout: 1000 } : {})}
                                            >
                                                <div style={{ marginTop: '2rem' }}>
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ marginTop: '2rem' }} justifyContent="center" >
                                                        {/* <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}> */}
                                                        {/* <input style={{ marginRight: '2rem' }} placeholder="prodotto" onChange={(event) => {
                                                    clearTimeout(timerUpd)
                                                    setTimeout(() => {
                                                        setLabel(event.target.value)
                                                    }, 1000)
                                                }} /> */}
                                                        <Autocomplete
                                                            disablePortal
                                                            item xs={12} sm={6}
                                                            id="combo-box-demo"
                                                            options={tools}
                                                            style={{ marginLeft: 'auto', marginRight: "2rem" }}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="prodotti" />}
                                                            onChange={(event, value) => {
                                                                clearTimeout(timerUpd)
                                                                setTimeout(() => {
                                                                    // setLabel(value)
                                                                    setToolFound(value)
                                                                }, 1000)
                                                            }}
                                                        />
                                                        {inheritedQuantity === -1 ? <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            label="quantità attuale presente"
                                                            value={0}
                                                            onChange={(event) => { handleChangeInheritedQuantity(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            label="quantità attuale presente"
                                                            value={inheritedQuantity}
                                                            onChange={(event) => { handleChangeInheritedQuantity(event) }}
                                                        />}
                                                        {inheritedLowerBound === -1 ? <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            label="quantità minima attuale richiesta"
                                                            value={0}
                                                            onChange={(event) => { handleChangeInheritedLowerBound(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            label="quantità minima attuale richiesta"
                                                            value={inheritedLowerBound}
                                                            onChange={(event) => { handleChangeInheritedLowerBound(event) }}
                                                        />}
                                                        {inheritedLastUpdated === -1 ? <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            style={{ marginRight: "2rem" }}
                                                            label="ultima modifica"
                                                            value={""}
                                                            onChange={(event) => { handleChangeInheritedLastUpdated(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            style={{ marginRight: "2rem" }}
                                                            id="outlined-disabled"
                                                            label="ultima modifica"
                                                            value={inheritedLastUpdated}
                                                            onChange={(event) => { handleChangeInheritedLastUpdated(event) }}
                                                        />}
                                                        {/* </div> */}
                                                    </Grid>
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ marginTop: '2rem' }} justifyContent="center" >
                                                        {/* <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}> */}
                                                        {/* <input style={{ marginRight: '2rem' }} placeholder="utente (cognome)" onChange={(event) => { setUser(event.target.value.toLowerCase()) }} /> */}
                                                        <Autocomplete
                                                            disablePortal
                                                            item xs={12} sm={6}
                                                            id="combo-box-demo"
                                                            options={employees}
                                                            style={{ marginLeft: 'auto', marginRight: "2rem" }}
                                                            sx={{ width: 300 }}
                                                            getOptionLabel={option => option.lastName}
                                                            renderInput={(params) => <TextField {...params} label="dipendente" />}
                                                            onChange={(event, value) => { setUser(value.lastName.toLowerCase()) }}
                                                        />
                                                        <TextField
                                                            id="outlined-number"
                                                            item xs={12} sm={6}
                                                            label="quantità"
                                                            type="number"
                                                            style={{ width: '30%' }}
                                                            inputProps={{ min: 0 }}
                                                            onChange={(event) => { setQuantity(event.target.value) }}
                                                        />
                                                        {
                                                            inheritedLowerBound === -1 ? <TextField
                                                                id="outlined-number"
                                                                item xs={12} sm={6}
                                                                label="quantità minima"
                                                                type="number"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                value={0}
                                                                onChange={(event) => { setLowerBound(event.target.value) }}
                                                            /> : <TextField
                                                                id="outlined-number"
                                                                item xs={12} sm={6}
                                                                label="quantità minima"
                                                                type="number"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                value={inheritedLowerBound}
                                                                onChange={(event) => {
                                                                    setLowerBound(event.target.value)
                                                                    setInheritedLowerBound(event.target.value)
                                                                }}
                                                            />
                                                        }

                                                        {/* </div> */}
                                                    </Grid>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                                        <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem' }} onClick={() => {
                                                            updateBook(toolFound.label, quantity, user, lowerBound)
                                                            setIsLoading(true)
                                                        }}>Rimuovi quantità inserita</Button>
                                                    </div>
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
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ marginTop: '2rem' }} justifyContent="center" >
                                                        {/* <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}> */}
                                                        <Autocomplete
                                                            disablePortal
                                                            item xs={12} sm={6}
                                                            id="combo-box-demo"
                                                            options={tools}
                                                            style={{ marginRight: "2rem" }}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="prodotti" />}
                                                            onChange={(event, value) => {
                                                                clearTimeout(timerUpd)
                                                                setTimeout(() => {
                                                                    // setLabel(value)
                                                                    setToolFound(value)
                                                                }, 1000)
                                                            }}
                                                        />
                                                        {inheritedLowerBound === -1 ? <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            style={{ marginRight: "2rem" }}
                                                            label="quantità minima attuale richiesta"
                                                            value={0}
                                                            onChange={(event) => { handleChangeInheritedLowerBound(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            style={{ marginRight: "2rem" }}
                                                            id="outlined-disabled"
                                                            label="quantità minima attuale richiesta"
                                                            value={inheritedLowerBound}
                                                            onChange={(event) => { handleChangeInheritedLowerBound(event) }}
                                                        />}
                                                        {inheritedDepartment === -1 ? <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            style={{ marginRight: "2rem" }}
                                                            label="reparto attuale"
                                                            value={""}
                                                            onChange={(event) => { handleChangeInheritedDepartment(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            style={{ marginRight: "2rem" }}
                                                            label="reparto attuale"
                                                            value={inheritedDepartment}
                                                            onChange={(event) => { handleChangeInheritedDepartment(event) }}
                                                        />}
                                                        {inheritedSubDepartment === -1 ? <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            style={{ marginRight: "2rem" }}
                                                            label="sotto-reparto attuale"
                                                            value={""}
                                                            onChange={(event) => { handleChangeInheritedSubDepartment(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            style={{ marginRight: "2rem" }}
                                                            id="outlined-disabled"
                                                            label="sotto-reparto attuale"
                                                            value={inheritedSubDepartment}
                                                            onChange={(event) => { handleChangeInheritedSubDepartment(event) }}
                                                        />}
                                                        {inheritedLastUpdated === -1 ? <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            id="outlined-disabled"
                                                            style={{ marginRight: "2rem" }}
                                                            label="ultima modifica"
                                                            value={""}
                                                            onChange={(event) => { handleChangeInheritedLastUpdated(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            item xs={12} sm={6}
                                                            style={{ marginRight: "2rem" }}
                                                            id="outlined-disabled"
                                                            label="ultima modifica"
                                                            value={inheritedLastUpdated}
                                                            onChange={(event) => { handleChangeInheritedLastUpdated(event) }}
                                                        />}
                                                        {/* </div> */}
                                                    </Grid>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                        <h4>da modificare:</h4>
                                                    </div>
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ marginTop: '2rem' }} justifyContent="center" >
                                                        {/* <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}> */}
                                                        <input style={{ marginRight: '2rem' }} placeholder="nuovo nome (non obbligatorio)" onChange={(event) => { setLabelToUpdate(event.target.value.toLowerCase()) }} />
                                                        <input style={{ marginRight: '2rem' }} placeholder="marca (non obbligatorio)" onChange={(event) => { setMarcaToUpdate(event.target.value.toLowerCase()) }} />
                                                        <input style={{ marginRight: '2rem' }} placeholder="codice (non obbligatorio)" onChange={(event) => { setCodeToUpdate(event.target.value.toLowerCase()) }} />
                                                        <Autocomplete
                                                            disablePortal
                                                            item xs={12} sm={6}
                                                            id="combo-box-demo"
                                                            options={departments}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="reparti (non obbligatorio)" />}
                                                            onChange={(event, value) => {
                                                                handleChangeDepMenuToUpdate(event, value)
                                                            }}
                                                        />
                                                        <Autocomplete
                                                            disablePortal
                                                            item xs={12} sm={6}
                                                            id="combo-box-demo"
                                                            disabled={disabledSDMenu}
                                                            options={subDepartmentsForMenu}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="sotto-reparti (non obbligatorio)" />}
                                                            onChange={(event, value) => {
                                                                if (value !== null) {
                                                                    setSubDepartmentToUpdate(value.label)
                                                                }
                                                            }}
                                                        />
                                                        {
                                                            inheritedLowerBound === -1 ? <TextField
                                                                id="outlined-number"
                                                                label="quantità minima (non obbligatorio)"
                                                                item xs={12} sm={6}
                                                                type="number"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                value={0}
                                                                onChange={(event) => { setLowerBound(event.target.value) }}
                                                            /> : <TextField
                                                                id="outlined-number"
                                                                label="quantità minima (non obbligatorio)"
                                                                item xs={12} sm={6}
                                                                type="number"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                value={inheritedLowerBound}
                                                                onChange={(event) => {
                                                                    setLowerBound(event.target.value)
                                                                    setInheritedLowerBound(event.target.value)
                                                                }}
                                                            />
                                                        }

                                                        {/* </div> */}
                                                    </Grid>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                                        <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem' }} onClick={() => {
                                                            updateEntireBook(toolFound.label, lowerBound)
                                                            setIsLoading(true)
                                                        }}>Modifica prodotto</Button>
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
                                                        {/* <input placeholder="prodotto" onChange={(event) => { setLabel(event.target.value) }} /> */}
                                                        <Autocomplete
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            options={tools}
                                                            style={{ marginLeft: 'auto', marginRight: "auto" }}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="prodotti (per nome)" />}
                                                            onChange={(event, value) => {
                                                                if (value !== null) {
                                                                    setLabel(value.label)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ marginTop: '2rem' }}>
                                                        <Button style={{ color: 'white', backgroundColor: 'red', marginLeft: '1rem' }} onClick={() => { setShowQuestionDelete(true) }}>Conferma</Button>
                                                    </div>
                                                    {
                                                        !showQuestionDelete ? "" : <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1rem' }}>
                                                            <Typography variant="subtitle1" gutterBottom component="div">
                                                                Sei sicuro di voler cancellare il prodotto {label.toLowerCase()}?
                                                            </Typography>
                                                            <Button style={{ color: 'white', backgroundColor: 'red', marginLeft: '1rem' }} onClick={() => {
                                                                deleteTool(label)
                                                                setIsLoading(true)
                                                            }}>Sì</Button>
                                                        </div>
                                                    }
                                                </div>
                                            </Grow>
                                        </Box>)
                                    }

                                    <div>
                                        {
                                            (!confermaAdd) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">prodotto aggiunto correttamente!</Alert>
                                        }
                                        {
                                            (!confermaUpdate) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">prodotto aggiornato correttamente!</Alert>
                                        }
                                        {
                                            (!confermaDelete) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">prodotto eliminato correttamente!</Alert>
                                        }
                                        {
                                            (notFound === "") ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">prodotto {notFound} non trovato! Controlla che il prodotto sia scritto correttamente.</Alert>
                                        }
                                        {
                                            (showError === false) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Errore. Controlla la connessione o i dati inseriti.</Alert>
                                        }
                                        {
                                            (nonExistingEmployee === "") ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Utente inserito non presente.</Alert>
                                        }
                                    </div>

                                    {/* WAREHOUSE */}
                                    <h2 style={{ marginTop: '5rem', fontFamily: 'times', marginLeft: '1rem' }}>Reparti:</h2>
                                    <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', marginTop: '4rem', marginBottom: '4rem' }}>
                                        {
                                            departments.map((d) => {
                                                return <Accordion
                                                    expanded={openPapers[d.label] || false}
                                                    onChange={() => { updateOpenPapers(d.label) }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1bh-content"
                                                    >
                                                        <Typography variant="h4" sx={{ width: "33%", flexShrink: 0 }}>
                                                            {d.label.toUpperCase()}
                                                        </Typography>
                                                        {/* <Typography sx={{ color: "text.secondary" }}>
                                        I am an accordion
                                    </Typography> */}
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {
                                                            subDepartments.map((sd) => {
                                                                if (sd.father === d.label) {
                                                                    return <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                                                        <Accordion
                                                                            expanded={openPapers[sd.label] || false}
                                                                            style={{ width: '80%' }}
                                                                            onChange={() => {
                                                                                showSubDepartment(sd)
                                                                            }}
                                                                        >
                                                                            <AccordionSummary
                                                                                expandIcon={<ExpandMoreIcon />}
                                                                                aria-controls="panel1bh-content"
                                                                            >
                                                                                <Typography variant="h6" sx={{ width: "100%", flexShrink: 0 }}>
                                                                                    {sd.label.toUpperCase()}
                                                                                </Typography>
                                                                            </AccordionSummary>
                                                                            <AccordionDetails>
                                                                                {
                                                                                    toolsInSd.map((t) => {
                                                                                        return <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                                                                            <Typography onClick={() => { console.log(t) }}>
                                                                                                {t.label.toUpperCase()}
                                                                                            </Typography>
                                                                                            <Typography style={{ marginLeft: '2rem' }}>
                                                                                                q: {t.quantity}
                                                                                            </Typography>
                                                                                            <AiOutlineInfoCircle onClick={() => {
                                                                                                setOpen(true)
                                                                                                setUpdateBookListFlag(true)
                                                                                                setToolInSd(t)
                                                                                                setToolFound(t)
                                                                                            }} style={{ marginLeft: '2rem', color: 'green' }} />
                                                                                        </div>
                                                                                    })
                                                                                }
                                                                            </AccordionDetails>
                                                                        </Accordion>
                                                                        {/* <Typography className="hovered" onClick={() => { showSubDepartment(sd) }}>
                                                                    {sd.label.toUpperCase()}
                                                                </Typography> */}
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
                                        onClose={() => { handleClose() }}
                                        aria-labelledby="modal-modal-label"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            {
                                                (toolInSd === undefined || toolInSd === null || toolInSd.label === null || toolInSd.label === undefined) ? "" : <div><Typography style={{ marginBottom: '2rem' }} id="modal-modal-label" variant="h6" component="h2">
                                                    Modifica prodotto: {toolInSd.label.toUpperCase()}
                                                </Typography>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                        {inheritedQuantity === -1 ? <TextField
                                                            disabled
                                                            id="outlined-disabled"
                                                            style={{ marginRight: "2rem" }}
                                                            label="quantità minima attuale richiesta"
                                                            value={0}
                                                            onChange={(event) => { handleChangeInheritedQuantity(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            style={{ marginRight: "2rem" }}
                                                            id="outlined-disabled"
                                                            label="quantità minima attuale richiesta"
                                                            value={inheritedQuantity}
                                                            onChange={(event) => { handleChangeInheritedQuantity(event) }}
                                                        />}
                                                        {inheritedLowerBound === -1 ? <TextField
                                                            disabled
                                                            id="outlined-disabled"
                                                            style={{ marginRight: "2rem" }}
                                                            label="quantità minima attuale richiesta"
                                                            value={0}
                                                            onChange={(event) => { handleChangeInheritedLowerBound(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            style={{ marginRight: "2rem" }}
                                                            id="outlined-disabled"
                                                            label="quantità minima attuale richiesta"
                                                            value={inheritedLowerBound}
                                                            onChange={(event) => { handleChangeInheritedLowerBound(event) }}
                                                        />}
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                        {inheritedDepartment === -1 ? <TextField
                                                            disabled
                                                            id="outlined-disabled"
                                                            style={{ marginRight: "2rem" }}
                                                            label="reparto attuale"
                                                            value={""}
                                                            onChange={(event) => { handleChangeInheritedDepartment(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            id="outlined-disabled"
                                                            style={{ marginRight: "2rem" }}
                                                            label="reparto attuale"
                                                            value={inheritedDepartment}
                                                            onChange={(event) => { handleChangeInheritedDepartment(event) }}
                                                        />}
                                                        {inheritedSubDepartment === -1 ? <TextField
                                                            disabled
                                                            id="outlined-disabled"
                                                            style={{ marginRight: "2rem" }}
                                                            label="sotto-reparto attuale"
                                                            value={""}
                                                            onChange={(event) => { handleChangeInheritedSubDepartment(event) }}
                                                        /> : <TextField
                                                            disabled
                                                            style={{ marginRight: "2rem" }}
                                                            id="outlined-disabled"
                                                            label="sotto-reparto attuale"
                                                            value={inheritedSubDepartment}
                                                            onChange={(event) => { handleChangeInheritedSubDepartment(event) }}
                                                        />}
                                                    </div>
                                                    da modificare:
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1rem' }}>
                                                        <input style={{ marginRight: '2rem' }} placeholder="nuovo nome (non obbligatorio)" onChange={(event) => { setLabelToUpdate(event.target.value.toLowerCase()) }} />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                        <input style={{ marginRight: '2rem' }} placeholder="marca (non obbligatorio)" onChange={(event) => { setMarcaToUpdate(event.target.value.toLowerCase()) }} />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                        <input style={{ marginRight: '2rem' }} placeholder="codice (non obbligatorio)" onChange={(event) => { setCodeToUpdate(event.target.value.toLowerCase()) }} />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                        <Autocomplete
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            options={departments}
                                                            style={{ marginLeft: 'auto', marginRight: "2rem" }}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="reparti (non obbligatorio)" />}
                                                            onChange={(event, value) => {
                                                                handleChangeDepMenuToUpdate(event, value)
                                                            }}
                                                        />
                                                        <Autocomplete
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            disabled={disabledSDMenu}
                                                            options={subDepartmentsForMenu}
                                                            style={{ marginLeft: 'auto', marginRight: "2rem" }}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="sotto-reparti (non obbligatorio)" />}
                                                            onChange={(event, value) => {
                                                                if (value !== null) {
                                                                    setSubDepartmentToUpdate(value.label)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                                        <Button style={{ color: 'white', backgroundColor: '#ffae1b' }} onClick={() => {
                                                            updateEntireBook(toolFound.label, lowerBound)
                                                            setIsLoading(true)
                                                        }}>Modifica prodotto</Button>
                                                    </div>
                                                </div>
                                            }

                                        </Box>
                                    </Modal>

                                    {/* Modal to update library structure */}
                                    <Modal
                                        open={openLibraryAdd}
                                        onClose={() => { handleCloseLibraryUpdate() }}
                                        aria-labelledby="modal-modal-label"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <Typography style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }} id="modal-modal-label" variant="h6" component="h2">
                                                Aggiungi un reparto o sottoreparto:
                                            </Typography>
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={isSubDep} onChange={handleChangeSwitch} name="subdep" />
                                                }
                                                style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
                                                label="Seleziona se è un sottoreparto"
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                {
                                                    isSubDep ? "" : <input style={{ marginTop: '2rem' }} placeholder="reparto" onChange={(event) => { setAddingDepartment(event.target.value) }} />
                                                }
                                                {
                                                    !isSubDep ? "" : <div>
                                                        <input style={{ marginTop: '2rem' }} placeholder="reparto (GIA' ESISTENTE)" onChange={(event) => { setAddingDepartment(event.target.value) }} />
                                                        <input placeholder="sottoreparto" onChange={(event) => { setAddingSubDepartment(event.target.value) }} />
                                                    </div>
                                                }
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                <Button style={{ color: 'white', backgroundColor: 'green', marginLeft: '1rem' }} onClick={() => {
                                                    addDepartment()
                                                    setIsLoading(true)
                                                }}>Conferma</Button>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                <Button style={{ color: 'black', backgroundColor: 'trasnparent', fontSize: 'small' }} onClick={() => { setOpenEditDeps(true) }}>Vuoi modificare un reparto o un sottoreparto già esistente?</Button>
                                            </div>
                                        </Box>

                                    </Modal>

                                    <Modal
                                        open={openQrCode}
                                        onClose={() => { handleCloseQrCode() }}
                                        aria-labelledby="modal-modal-label"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <div style={{ width: "100%", height: "100%", marginLeft: 'auto', marginRight: 'auto' }}>
                                                <QrReader
                                                    delay={500}
                                                    style={{ width: '300px !important', height: "300px !important" }}
                                                    onError={handleErrorWebCam}
                                                    onScan={handleScanWebCam}
                                                />
                                                <h3>Scanned By WebCam Code: {qrData}</h3>
                                            </div>
                                        </Box>
                                    </Modal>

                                    <Modal
                                        open={openEditDeps}
                                        onClose={() => { handleCloseEditDeps() }}
                                        aria-labelledby="modal-modal-label"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <Typography style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }} id="modal-modal-label" variant="h6" component="h2">
                                                Modifica un reparto o sottoreparto:
                                            </Typography>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={allDeps}
                                                style={{ marginLeft: 'auto', marginRight: "auto", marginBottom: "2rem" }}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="tutti i reparti" />}
                                                onChange={(event, value) => {
                                                    handleChangeEditDep(event, value)
                                                }}
                                            />
                                            modifica:
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                <input style={{ marginTop: '2rem' }} placeholder="nuovo nome" onChange={(event) => { seteditedDepartmentLabel(event.target.value) }} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                <Button style={{ color: 'white', backgroundColor: 'green', marginLeft: '1rem' }} onClick={() => { editDepartment() }}>Conferma</Button>
                                            </div>
                                        </Box>
                                    </Modal>
                                </div>
                        }
                    </div>
            }
        </div >
    );
}

export default Warehouse;
