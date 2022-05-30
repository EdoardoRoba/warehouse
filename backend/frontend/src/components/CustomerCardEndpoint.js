import { axiosInstance, refFirestore } from "../config.js"
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import * as React from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit';
import ApartmentIcon from '@material-ui/icons/Apartment';
import NotesIcon from '@material-ui/icons/Notes';
import GetAppIcon from '@material-ui/icons/GetApp';
import LinkIcon from '@material-ui/icons/Link';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { AiFillInfoCircle } from "react-icons/ai";
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { saveAs } from 'file-saver'
import { storage } from "../firebase";
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
// import { firebase } from "firebase/compat/app";
import './Classes.css'
import { getDownloadURL, ref, uploadBytesResumable, getStorage, deleteObject, uploadString } from "firebase/storage";
import { makeStyles } from '@mui/styles';
import DDT from "./DDT.js";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import Gallery from 'react-grid-gallery';

function CustomerCardEndpoint() {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(true)
    const [selectedFile, setSelectedFile] = React.useState();
    const [selectedFilePDF, setSelectedFilePDF] = React.useState();
    const [selectedSopralluogo, setSelectedSopralluogo] = React.useState([{}]);
    const [selectedInstallazione, setSelectedInstallazione] = React.useState([{}]);
    const [selectedAssistenza, setSelectedAssistenza] = React.useState([{}]);
    const [selectedArgo, setSelectedArgo] = React.useState([{}]);
    const [selectedBuildAutomation, setSelectedBuildAutomation] = React.useState([{}]);
    const [isFilePicked, setIsFilePicked] = React.useState(false);
    const [isFilePDFPicked, setIsFilePDFPicked] = React.useState(false);
    const [isSopralluogoPicked, setIsSopralluogoPicked] = React.useState(false);
    const [isInstallazionePicked, setIsInstallazionePicked] = React.useState(false);
    const [isAssistenzaPicked, setIsAssistenzaPicked] = React.useState(false);
    const [isArgoPicked, setIsArgoPicked] = React.useState(false);
    const [isBuildAutomationPicked, setIsBuildAutomationPicked] = React.useState(false);
    const [excel, setExcel] = React.useState({});
    const [currentImage, setCurrentImage] = React.useState({});
    const [showError, setShowError] = React.useState(false);
    const [confermaAdd, setConfermaAdd] = React.useState(false);
    const [customers, setCustomers] = React.useState([]);
    const [customerSelected, setCustomerSelected] = React.useState(null);
    const [confermaUpdate, setConfermaUpdate] = React.useState(false);
    const [customerSelectedId, setCustomerSelectedId] = React.useState(false);
    const [openSopralluogo, setOpenSopralluogo] = React.useState(false);
    const [openInstallazione, setOpenInstallazione] = React.useState(false);
    const [openAssistenza, setOpenAssistenza] = React.useState(false);
    const [openArgo, setOpenArgo] = React.useState(false);
    const [openBuildAutomation, setOpenBuildAutomation] = React.useState(false);
    const [genericError, setGenericError] = React.useState("");
    const [auths, setAuths] = React.useState([])
    const [openColorsUpdate, setOpenColorsUpdate] = React.useState(false);
    const [statusColors, setStatusColors] = React.useState("");
    const [possibleStatuses, setPossibleStatuses] = React.useState("");
    const [fieldToEdit, setFieldToEdit] = React.useState("");
    const [valueToEdit, setValueToEdit] = React.useState("");
    const [openEditField, setOpenEditField] = React.useState(false);
    const [openLoadPdf, setOpenLoadPdf] = React.useState(false);
    const [openEditStatus, setOpenEditStatus] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [progress, setProgress] = React.useState(0);
    const [pageSopralluogo, setPageSopralluogo] = React.useState(1);
    const [pageInstallazione, setPageInstallazione] = React.useState(1);
    const [pageAssistenza, setPageAssistenza] = React.useState(1);
    const [pageArgo, setPageArgo] = React.useState(1);
    const [pageBuildAutomation, setPageBuildAutomation] = React.useState(1);
    const [imagesToShow, setImagesToShow] = React.useState([]);
    const [openNote, setOpenNote] = React.useState(false);
    const [askDeleteAll, setAskDeleteAll] = React.useState(false);
    const [typeToDeleteAll, setTypeToDeleteAll] = React.useState("");
    const [checkTypologyToDelete, setCheckTypologyToDelete] = React.useState("");
    const [noteType, setNoteType] = React.useState("");
    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);
    const [refSectionState, setRefSectionState] = React.useState();

    const refInfo = React.useRef(null)
    const refSopr = React.useRef(null)
    const refInst = React.useRef(null)
    const refAss = React.useRef(null)
    const refDoc = React.useRef(null)
    const refArgo = React.useRef(null)
    const refBAuto = React.useRef(null)

    const columns = [
        { field: 'nome_cognome', headerName: 'nome e cognome', flex: 1 },
        { field: 'status', headerName: 'stato', flex: 1 }
    ]
    const hasWindow = typeof window !== 'undefined';
    var JSZip = require("jszip");

    const imageTypes = ["image/png", "image/jpeg"]
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const bull = (
        <Box
            component="span"
            sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
            •
        </Box>
    );

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
        width: "80%",
        height: "80%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        maxHeight: '80%',
        overflowY: 'auto',
        // overflowX: 'auto'
    };

    const location = useLocation();

    React.useEffect(() => {
        userIsAuthenticated()
        getStatusColors()
        checkUserExternal()
        axiosInstance.get("customer/" + location.state.customerSelected._id, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
            setCustomerSelected(resp.data)
        }).catch(error => {
            // console.log("error")
            if (error.response && error.response.status === 401) {
                userIsAuthenticated()
            }
            setIsLoading(false)
            setShowError(true)
        });
    }, [])

    React.useEffect(() => {
        // console.log("file: ", selectedFile)
    }, [selectedFile])

    React.useEffect(() => {
        // console.log("customers: ", customers)
    }, [customers])

    React.useEffect(() => {
        // console.log("customerSelected: ", customerSelected)
    }, [customerSelected])

    React.useEffect(() => {
        // console.log("openColorsUpdate: ", openColorsUpdate)
    }, [openColorsUpdate])

    React.useEffect(() => {
        // console.log("excel: ", excel)
    }, [excel])

    React.useEffect(() => {
        // console.log("statusColors: ", statusColors)
    }, [statusColors])

    React.useEffect(() => {
        // console.log("valueToEdit: ", valueToEdit)
    }, [valueToEdit])

    React.useEffect(() => {
        // console.log("customerSelected: ", customerSelected)
    }, [customerSelected])

    React.useEffect(() => {
        // console.log("selectedSopralluogo: ", selectedSopralluogo)
    }, [selectedSopralluogo])

    React.useEffect(() => {
        // console.log("valueToEdit: ", valueToEdit)
    }, [valueToEdit])

    React.useEffect(() => {
        if (customerSelected !== null) {
            setCustomerSelectedId(customerSelected._id)
        }
        // console.log("customerSelected: ", customerSelected)
    }, [customerSelected])

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowError(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [showError]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setGenericError("")
        }, 5000);
        return () => clearTimeout(timer);
    }, [genericError]);

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

    const getStatusColors = () => {
        axiosInstance.get('colorsStatus', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(res => {
                var scs = {}
                var pss = []
                var ps = {}
                for (let sc of res.data) {
                    ps = {}
                    scs[sc.label] = sc.color
                    ps["id"] = sc.label
                    ps["label"] = sc.label
                    pss.push(ps)
                }
                setPossibleStatuses(pss)
                setStatusColors(scs)
            }).catch(error => {
                // console.log("error")
                if (error.response && error.response.status === 401) {
                    userIsAuthenticated()
                }
                setIsLoading(false)
                setShowError(true)
            });
    }

    const handleCloseNote = () => {
        setNoteType("")
        setOpenNote(false);
        setRefSectionState()
    };

    const changeHandlerPDF = (event) => {
        setSelectedFilePDF(event.target.files);
        setIsFilePDFPicked(true);
    };

    const getCustomers = (user) => {
        // console.log(user) // undefined
        if (user === undefined) {
            axiosInstance.get('customer', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
                .then(res => {
                    // console.log("customers: ", res.data)
                    setCustomers(res.data)
                    setIsLoading(false)
                }).catch(error => {
                    // console.log("error")
                    if (error.response && error.response.status === 401) {
                        userIsAuthenticated()
                    }
                    setIsLoading(false)
                    setShowError(true)
                });
        } else {
            axiosInstance.get('customer', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { user: user } })
                .then(res => {
                    // console.log("customers: ", res.data)
                    setCustomers(res.data)
                    setIsLoading(false)
                }).catch(error => {
                    // console.log("error")
                    if (error.response && error.response.status === 401) {
                        userIsAuthenticated()
                    }
                    setIsLoading(false)
                    setShowError(true)
                });
        }
    }

    const handleCloseEditField = () => {
        setFieldToEdit("")
        setValueToEdit("")
        getCustomers()
        setOpenEditField(false)
        setRefSectionState()
    };

    const handleCloseLoadPdf = () => {
        setFieldToEdit("")
        setValueToEdit("")
        setSelectedFilePDF({})
        getCustomers()
        setOpenLoadPdf(false)
        setRefSectionState()
    };

    const handleCloseAskDeleteAll = () => {
        getCustomers()
        setTypeToDeleteAll("")
        setCheckTypologyToDelete("")
        setAskDeleteAll(false)
        setRefSectionState()
    }

    const handleCloseEditStatus = () => {
        setFieldToEdit("")
        setValueToEdit("")
        getCustomers()
        setOpenEditStatus(false)
        setRefSectionState()
    };

    const editField = () => {
        var newField = {}
        newField[fieldToEdit] = valueToEdit
        axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((response) => {
            axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                console.log("aggiornato!")
                setIsLoading(false)
                setCustomerSelected(resp.data)
                handleCloseEditField()
                refSectionState.current.scrollIntoView()
            }).catch((error) => {
                setIsLoading(false)
                if (error.response && error.response.status === 401) {
                    userIsAuthenticated()
                }
                refSectionState.current.scrollIntoView()
            })
        }).catch((error) => {
            console.log("error")
            console.log(error)
            setIsLoading(false)
            refSectionState.current.scrollIntoView()
        })
    }

    const editStatus = () => {
        var newField = {}
        newField[fieldToEdit] = valueToEdit
        axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((response) => {
            axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                console.log("aggiornato!")
                setIsLoading(false)
                setCustomerSelected(resp.data)
                handleCloseEditStatus()
            }).catch((error) => {
                setIsLoading(false)
                if (error.response && error.response.status === 401) {
                    userIsAuthenticated()
                }
            })
        }).catch((error) => {
            console.log("error")
            console.log(error)
            setIsLoading(false)
        })
    }

    const checkUserExternal = () => {
        setIsLoading(true)
        if (localStorage.getItem("user") !== "admin") {
            axiosInstance.get('employeeIsExternal', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { user: localStorage.getItem("user").replaceAll(".", " ") } }) // { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
                .then(res => {
                    if (res.data) {
                        getCustomers(localStorage.getItem("user").replaceAll(".", " "))
                    } else {
                        getCustomers()
                    }
                }).catch(error => {
                    // console.log("error")
                    if (error.response && error.response.status === 401) {
                        userIsAuthenticated()
                    }
                    setIsLoading(false)
                    setShowError(true)
                });
        } else {
            getCustomers()
        }
    }

    const handleSubmissionPDF = () => {
        if (!selectedFilePDF) return;
        for (let pdf of selectedFilePDF) {
            // const now = Date.now()
            const storageRef = ref(storage, '/files/' + customerSelected.nome_cognome + '/' + pdf.name) //.replace(".pdf", ""))
            const uploadTask = uploadBytesResumable(storageRef, pdf)
            uploadTask.on("state_changed", (snapshot) => {
                const progr = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setProgress(progr)
                setIsLoading(false)
            }, (error) => console.log("error: ", error),
                () => {
                    //when the file is uploaded we want to download it. uploadTask.snapshot.ref is the reference to the pdf
                    getDownloadURL(uploadTask.snapshot.ref).then((fileUrl) => {
                        console.log("fileUrl: ", fileUrl)

                        var newField = {}
                        newField[fieldToEdit] = customerSelected[fieldToEdit]
                        if (newField[fieldToEdit] === undefined) {
                            newField[fieldToEdit] = [fileUrl]
                        } else {
                            newField[fieldToEdit].push(fileUrl)
                        }
                        axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                            axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                                setIsLoading(false)
                                console.log("customer updated")
                                setCustomerSelected(respp.data)
                                handleCloseLoadPdf()
                                refSectionState.current.scrollIntoView()
                            }).catch((error) => {
                                setIsLoading(false)
                                if (error.response && error.response.status === 401) {
                                    userIsAuthenticated()
                                }
                                refSectionState.current.scrollIntoView()
                            })
                        })
                    })
                }
            )
        }
    };

    const deletePdf = (pdf, pdfType, refSection) => {
        // refSopr.current.scrollIntoView()
        let pdfRef = ref(storage, pdf);
        deleteObject(pdfRef)
            .then(() => {
                console.log("Firebase clean!")
                var new_pdf_array = customerSelected[pdfType].filter((p) => p !== pdf)
                var newField = {}
                newField[pdfType] = new_pdf_array
                axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                    axiosInstance.get("customer/" + customerSelected._id, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                        setIsLoading(false)
                        console.log("pdf eliminato!")
                        setCustomerSelected(respp.data)
                        refSection.current.scrollIntoView()
                    }).catch((error) => {
                        setIsLoading(false)
                        refSection.current.scrollIntoView()
                        if (error.response && error.response.status === 401) {
                            userIsAuthenticated()
                        }
                    })
                }).catch((error) => {
                    setIsLoading(false)
                    refSection.current.scrollIntoView()
                    if (error.response && error.response.status === 401) {
                        userIsAuthenticated()
                    }
                })
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
                refSection.current.scrollIntoView()
            });

    }

    const deleteImage = (ph, phType) => {
        setIsLoading(true)
        var new_ph_array = customerSelected[phType].filter((p) => p !== ph)
        var newField = {}
        newField[phType] = new_ph_array
        let phRef = ref(storage, ph);
        deleteObject(phRef)
            .then(() => {
                console.log("Firebase clean!")
                var new_pdf_array = customerSelected[phType].filter((p) => p !== ph)
                var newField = {}
                newField[phType] = new_pdf_array
                axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                    axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                        console.log("foto eliminata!")
                        setIsLoading(false)
                        setCustomerSelected(respp.data)
                        setOpenSopralluogo(false)
                        setOpenInstallazione(false)
                        setOpenAssistenza(false)
                        setOpenArgo(false)
                        setOpenBuildAutomation(false)
                        setPageSopralluogo(1)
                        setPageInstallazione(1)
                        setPageAssistenza(1)
                        setPageArgo(1)
                        setPageBuildAutomation(1)
                        window.location.reload(false)
                    }).catch((error) => {
                        setIsLoading(false)
                        if (error.response && error.response.status === 401) {
                            userIsAuthenticated()
                        }
                    })
                }).catch((error) => {
                    if (error.response && error.response.status === 401) {
                        userIsAuthenticated()
                    }
                    setIsLoading(false)
                })
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
            });
    }

    const deleteImageOnFirebase = (ph) => {
        return new Promise(function (resolve, reject) {
            let phRef = ref(storage, ph);
            deleteObject(phRef)
                .then(() => {
                    resolve(phRef)
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false)
                });
        })
    }

    const deleteAllImages = async () => {
        let ok = []
        const oldPhLen = customerSelected["foto_" + typeToDeleteAll].length
        for (let i of customerSelected["foto_" + typeToDeleteAll]) {
            ok.push(deleteImageOnFirebase(i))
        }

        ok = await Promise.allSettled(ok)
        let isOk = ok.filter((e) => e.status === "fulfilled").map((e) => e.value)
        let isNotOk = ok.filter((e) => e.status !== "fulfilled").map((e) => e.value)
        if (isNotOk.length > 0) {
            setIsLoading(false)
            handleCloseAskDeleteAll()
        }

        if (isOk.length === oldPhLen) {
            let newField = {}
            newField["foto_" + typeToDeleteAll] = []
            axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                axiosInstance.get("customer/" + customerSelected._id, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                    setIsLoading(false)
                    console.log("phs eliminate!")
                    setCustomerSelected(respp.data)
                    refSectionState.current.scrollIntoView()
                    handleCloseAskDeleteAll()
                }).catch((error) => {
                    setIsLoading(false)
                    if (error.response && error.response.status === 401) {
                        userIsAuthenticated()
                    }
                    refSectionState.current.scrollIntoView()
                    handleCloseAskDeleteAll()
                })
            }).catch((error) => {
                setIsLoading(false)
                if (error.response && error.response.status === 401) {
                    userIsAuthenticated()
                }
                refSectionState.current.scrollIntoView()
                handleCloseAskDeleteAll()
            })
        }
    }

    const assistCustomer = (flag, key, action) => {
        let newField = {}
        newField[key] = flag
        if (key === "isAssisted" && action !== "remove") {
            newField.status = "in attesa di assistenza"
        }
        axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
            axiosInstance.get("customer/" + customerSelected._id, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                setIsLoading(false)
                setCustomerSelected(respp.data)
            }).catch((error) => {
                setIsLoading(false)
                if (error.response && error.response.status === 401) {
                    userIsAuthenticated()
                }
            })
        }).catch((error) => {
            setIsLoading(false)
            console.log("error")
            console.log(error)
        })
    }

    const handleSubmissionSopralluogo = (e) => {
        var imgs = {}
        imgs.images = imagesToShow
        var customer = {}
        customer.foto_sopralluogo = customerSelected.foto_sopralluogo
        if (imageTypes.includes(selectedSopralluogo[0].type)) {
            for (let s of selectedSopralluogo) {
                // customer.foto_sopralluogo.push(s.base64)
                // imgs.images.push(s.base64)

                const now = Date.now()
                const storageRef = ref(storage, '/files/' + customerSelected.nome_cognome + '/sopralluogo/' + now + "_" + s.name)
                const uploadTask = uploadBytesResumable(storageRef, s)
                uploadTask.on("state_changed", (snapshot) => {
                    const progr = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setProgress(progr)
                }, (error) => console.log("error: ", error),
                    () => {
                        //when the file is uploaded we want to download it. uploadTask.snapshot.ref is the reference to the pdf
                        getDownloadURL(uploadTask.snapshot.ref).then((fileUrl) => {
                            console.log("fileUrl: ", fileUrl)
                            customer.foto_sopralluogo.push(fileUrl)
                            axiosInstance.put("customer/" + customerSelected._id, customer, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                                setConfermaUpdate(true)
                                getCustomers()
                                axiosInstance.put("customer/" + customerSelected._id, customer, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                                    setIsLoading(false)
                                    console.log("customer updated")
                                    setCustomerSelected(respp.data)
                                    refSopr.current.scrollIntoView()
                                }).catch((error) => {
                                    setIsLoading(false)
                                    if (error.response && error.response.status === 401) {
                                        userIsAuthenticated()
                                        refSopr.current.scrollIntoView()
                                    }
                                })
                            }).catch((error) => {
                                // console.log("error: ", error)
                                if (error.response && error.response.status === 401) {
                                    userIsAuthenticated()
                                }
                                setIsLoading(false)
                                setShowError(true)
                                refSopr.current.scrollIntoView()
                            });
                        })
                    }
                )
            }
        } else {
            setGenericError("Tipo file non riconosciuto.")
        }

    };

    const updateCustomerStatus = (newStatus) => {
        setIsLoading(true)
        var customer = {}
        customer.status = newStatus
        axiosInstance.put("customer/" + customerSelected._id, customer, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
            setConfermaUpdate(true)
            axiosInstance.put("customer/" + customerSelected._id, customer, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                getCustomers()
                setIsLoading(false)
                console.log("customer updated")
                setCustomerSelected(respp.data)
            }).catch((error) => {
                setIsLoading(false)
                if (error.response && error.response.status === 401) {
                    userIsAuthenticated()
                }
            })
        }).catch((error) => {
            // console.log("error: ", error)
            if (error.response && error.response.status === 401) {
                userIsAuthenticated()
            }
            setIsLoading(false)
            setShowError(true)
        });
    }

    const onCurrentImageChange = (index) => {
        setCurrentImage(index);
    }

    const handleSubmissionInstallazione = (e) => {
        var imgs = {}
        imgs.images = imagesToShow
        var customer = {}
        customer.foto_fine_installazione = customerSelected.foto_fine_installazione
        if (imageTypes.includes(selectedInstallazione[0].type)) {
            for (let s of selectedInstallazione) {
                // customer.foto_fine_installazione.push(s.base64)
                // imgs.images.push(s.base64)

                const now = Date.now()
                const storageRef = ref(storage, '/files/' + customerSelected.nome_cognome + '/fine_installazione/' + now + "_" + s.name)
                const uploadTask = uploadBytesResumable(storageRef, s)
                uploadTask.on("state_changed", (snapshot) => {
                    const progr = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setProgress(progr)
                }, (error) => console.log("error: ", error),
                    () => {
                        //when the file is uploaded we want to download it. uploadTask.snapshot.ref is the reference to the pdf
                        getDownloadURL(uploadTask.snapshot.ref).then((fileUrl) => {
                            console.log("fileUrl: ", fileUrl)
                            customer.foto_fine_installazione.push(fileUrl)
                            axiosInstance.put("customer/" + customerSelected._id, customer, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                                setConfermaUpdate(true)
                                getCustomers()
                                axiosInstance.put("customer/" + customerSelected._id, customer, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                                    setIsLoading(false)
                                    console.log("customer updated")
                                    setCustomerSelected(respp.data)
                                    refInst.current.scrollIntoView()
                                }).catch((error) => {
                                    setIsLoading(false)
                                    if (error.response && error.response.status === 401) {
                                        userIsAuthenticated()
                                    }
                                })
                                refInst.current.scrollIntoView()
                            }).catch((error) => {
                                // console.log("error: ", error)
                                if (error.response && error.response.status === 401) {
                                    userIsAuthenticated()
                                }
                                setIsLoading(false)
                                setShowError(true)
                                refInst.current.scrollIntoView()
                            });
                        })
                    }
                )
            }
        } else {
            setGenericError("Tipo file non riconosciuto.")
        }
    };

    const handleSubmissionAssistenza = (e) => {
        var imgs = {}
        imgs.images = imagesToShow
        var customer = {}
        customer.foto_assistenza = customerSelected.foto_assistenza
        if (imageTypes.includes(selectedAssistenza[0].type)) {
            for (let s of selectedAssistenza) {
                // customer.foto_assistenza.push(s.base64)
                // imgs.images.push(s.base64)

                const now = Date.now()
                const storageRef = ref(storage, '/files/' + customerSelected.nome_cognome + '/assistenza/' + now + "_" + s.name)
                const uploadTask = uploadBytesResumable(storageRef, s)
                uploadTask.on("state_changed", (snapshot) => {
                    const progr = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setProgress(progr)
                }, (error) => console.log("error: ", error),
                    () => {
                        //when the file is uploaded we want to download it. uploadTask.snapshot.ref is the reference to the pdf
                        getDownloadURL(uploadTask.snapshot.ref).then((fileUrl) => {
                            console.log("fileUrl: ", fileUrl)
                            customer.foto_assistenza.push(fileUrl)
                            axiosInstance.put("customer/" + customerSelected._id, customer, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                                setConfermaUpdate(true)
                                getCustomers()
                                axiosInstance.put("customer/" + customerSelected._id, customer, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                                    setIsLoading(false)
                                    console.log("customer updated")
                                    setCustomerSelected(respp.data)
                                    refAss.current.scrollIntoView()
                                }).catch((error) => {
                                    setIsLoading(false)
                                    if (error.response && error.response.status === 401) {
                                        userIsAuthenticated()
                                    }
                                })
                                refAss.current.scrollIntoView()
                            }).catch((error) => {
                                // console.log("error: ", error)
                                if (error.response && error.response.status === 401) {
                                    userIsAuthenticated()
                                }
                                setIsLoading(false)
                                setShowError(true)
                                refAss.current.scrollIntoView()
                            });
                        })
                    }
                )
            }
        } else {
            setGenericError("Tipo file non riconosciuto.")
        }
    };

    const handleSubmissionArgo = (e) => {
        var imgs = {}
        imgs.images = imagesToShow
        var customer = {}
        customer.foto_argo = customerSelected.foto_argo
        if (imageTypes.includes(selectedArgo[0].type)) {
            for (let s of selectedArgo) {
                // customer.foto_argo.push(s.base64)
                // imgs.images.push(s.base64)

                const now = Date.now()
                const storageRef = ref(storage, '/files/' + customerSelected.nome_cognome + '/argo/' + now + "_" + s.name)
                const uploadTask = uploadBytesResumable(storageRef, s)
                uploadTask.on("state_changed", (snapshot) => {
                    const progr = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setProgress(progr)
                }, (error) => console.log("error: ", error),
                    () => {
                        //when the file is uploaded we want to download it. uploadTask.snapshot.ref is the reference to the pdf
                        getDownloadURL(uploadTask.snapshot.ref).then((fileUrl) => {
                            console.log("fileUrl: ", fileUrl)
                            customer.foto_argo.push(fileUrl)
                            axiosInstance.put("customer/" + customerSelected._id, customer, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                                setConfermaUpdate(true)
                                getCustomers()
                                axiosInstance.put("customer/" + customerSelected._id, customer, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                                    setIsLoading(false)
                                    console.log("customer updated")
                                    setCustomerSelected(respp.data)
                                    refArgo.current.scrollIntoView()
                                }).catch((error) => {
                                    setIsLoading(false)
                                    if (error.response && error.response.status === 401) {
                                        userIsAuthenticated()
                                    }
                                })
                                refArgo.current.scrollIntoView()
                            }).catch((error) => {
                                // console.log("error: ", error)
                                if (error.response && error.response.status === 401) {
                                    userIsAuthenticated()
                                }
                                setIsLoading(false)
                                setShowError(true)
                                refArgo.current.scrollIntoView()
                            });
                        })
                    }
                )
            }
        } else {
            setGenericError("Tipo file non riconosciuto.")
        }
    };

    const handleSubmissionBuildAutomation = (e) => {
        var imgs = {}
        imgs.images = imagesToShow
        var customer = {}
        customer.foto_buildAutomation = customerSelected.foto_buildAutomation
        if (imageTypes.includes(selectedBuildAutomation[0].type)) {
            for (let s of selectedBuildAutomation) {
                // customer.foto_buildAutomation.push(s.base64)
                // imgs.images.push(s.base64)

                const now = Date.now()
                const storageRef = ref(storage, '/files/' + customerSelected.nome_cognome + '/buildAutomation/' + now + "_" + s.name)
                const uploadTask = uploadBytesResumable(storageRef, s)
                uploadTask.on("state_changed", (snapshot) => {
                    const progr = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setProgress(progr)
                }, (error) => console.log("error: ", error),
                    () => {
                        //when the file is uploaded we want to download it. uploadTask.snapshot.ref is the reference to the pdf
                        getDownloadURL(uploadTask.snapshot.ref).then((fileUrl) => {
                            console.log("fileUrl: ", fileUrl)
                            customer.foto_buildAutomation.push(fileUrl)
                            axiosInstance.put("customer/" + customerSelected._id, customer, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
                                setConfermaUpdate(true)
                                getCustomers()
                                axiosInstance.put("customer/" + customerSelected._id, customer, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                                    setIsLoading(false)
                                    console.log("customer updated")
                                    setCustomerSelected(respp.data)
                                    refBAuto.current.scrollIntoView()
                                }).catch((error) => {
                                    setIsLoading(false)
                                    if (error.response && error.response.status === 401) {
                                        userIsAuthenticated()
                                    }
                                })
                                refBAuto.current.scrollIntoView()
                            }).catch((error) => {
                                // console.log("error: ", error)
                                if (error.response && error.response.status === 401) {
                                    userIsAuthenticated()
                                }
                                setIsLoading(false)
                                setShowError(true)
                                refBAuto.current.scrollIntoView()
                            });
                        })
                    }
                )
            }
        } else {
            setGenericError("Tipo file non riconosciuto.")
        }
    };

    const downloadImage = async (image, filename) => {
        let blob = await fetch(image).then((r) => r.blob());
        saveAs(blob, filename + ".jpg")
        setIsLoading(false)
    }

    const convertToBase64 = (u) => {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    // return reader.result
                    resolve(reader.result)
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', u);
            xhr.responseType = 'blob';
            xhr.send();
        })
    }

    const downloadFolder = async (urlss, typology) => {
        var is = []
        setIsLoading(true)
        for (let u of urlss) {
            // console.log(urlss)
            // let pp = await convertToBase64(u)
            is.push(convertToBase64(u))
        }
        is = await Promise.allSettled(is)
        let isOk = is.filter((e) => e.status === "fulfilled").map((e) => e.value)
        let isNotOk = is.filter((e) => e.status !== "fulfilled").map((e) => e.value)
        // console.log("finito", is)
        // const timer = setTimeout(() => {
        //     console.log("finito", is)
        print64(isOk, typology)
    }

    const print64 = (images, typology) => {
        if (images.length === customerSelected["foto_" + typology].length) {
            let zip = new JSZip();
            // console.log('fatto!', images)
            for (let i = 0; i < images.length; i++) {
                // let files = customerSelected.foto_sopralluogo;
                // for (let file = 0; file < customerSelected.foto_sopralluogo.length; file++) {
                // Zip file with the file name.
                zip.file((i + 1).toString() + ".jpg", images[i].split(",")[1], { base64: true });
                // }
            }
            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                    // see FileSaver.js
                    saveAs(content, customerSelected.nome_cognome.replaceAll(" ", "_") + "_" + typology + ".zip");

                    // var link = document.createElement("a")
                    // link.href = window.URL.createObjectURL(content)
                    // link.download = customerSelected.nome_cognome.replaceAll(" ", "_") + "_" + typology + ".zip"
                    // link.click()

                    // refSectionState.current.scrollIntoView()
                    setIsLoading(false)
                });
        }
    }

    const userIsAuthenticated = () => {
        if (localStorage.getItem("auths") !== null) {
            if (localStorage.getItem("auths").includes("customers")) {
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

    const captionStyle = {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        maxHeight: "240px",
        overflow: "hidden",
        position: "absolute",
        bottom: "0",
        width: "100%",
        color: "white",
        padding: "2px",
        fontSize: "90%"
    };

    const convertToGallery = (images, type) => {
        let imagesForGallery = images.map((i) => {
            return {
                src: i, thumbnail: i
            }
        })
        return imagesForGallery
        // , customOverlay: (
        //     <div style={captionStyle}>
        //         <div>
        //             <IconButton color="error" onClick={() => {
        //                 deleteImage(i, type)
        //                 setIsLoading(true)
        //             }}>
        //                 <DeleteIcon />
        //             </IconButton>
        //         </div>
        //         {/* {i.hasOwnProperty('tags') &&
        //             this.setCustomTags(i)} */}
        //     </div>
        // )
    }

    return (
        <div style={{ width: "90%", marginLeft: 'auto', marginRight: 'auto' }}>
            {
                !userIsAuthenticatedFlag ? <div>
                    <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert>
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}><Button variant="outlined" onClick={() => { window.location.reload(true) }} style={{ color: 'white', backgroundColor: 'green', marginTop: '8rem' }}><Link style={{ color: 'white' }} to={"/login"}>Vai al Login</Link></Button></div>
                </div> : <div>
                    {
                        customerSelected === null ? "" :
                            <div style={{ width: "90%", minWidth: 300, marginLeft: 'auto', marginRight: 'auto', marginTop: '4rem' }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={customers}
                                    getOptionLabel={(option) => option.nome_cognome}
                                    style={{ marginLeft: 'auto', marginRight: "auto", marginBottom: "3rem" }}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="clienti" />}
                                    onChange={(event, value) => {
                                        setCustomerSelected(value)
                                    }}
                                />
                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ marginBottom: "2rem" }} justifyContent="center" >
                                    <Grid onClick={() => refInfo.current.scrollIntoView()} item xs={12} md={1}>
                                        <Button variant="text">info</Button>
                                    </Grid>
                                    <Grid onClick={() => refSopr.current.scrollIntoView()} item xs={12} md={2}>
                                        <Button variant="text">sopralluogo</Button>
                                    </Grid>
                                    <Grid onClick={() => refInst.current.scrollIntoView()} item xs={12} md={2}>
                                        <Button variant="text">installazione</Button>
                                    </Grid>
                                    {
                                        !customerSelected.isAssisted ? "" : <Grid onClick={() => refAss.current.scrollIntoView()} item xs={12} md={2}>
                                            <Button variant="text">assistenza</Button>
                                        </Grid>
                                    }
                                    {
                                        auths["customers"] !== "*" ? "" : <Grid onClick={() => refDoc.current.scrollIntoView()} item xs={12} md={2}>
                                            <Button variant="text">documenti</Button>
                                        </Grid>
                                    }
                                    {
                                        !customerSelected.isArgo ? "" : <Grid onClick={() => refArgo.current.scrollIntoView()} item xs={12} md={1}>
                                            <Button variant="text">argo</Button>
                                        </Grid>
                                    }
                                    {
                                        !customerSelected.isBuildAutomation ? "" : <Grid onClick={() => refBAuto.current.scrollIntoView()} item xs={12} md={2}>
                                            <Button variant="text">building automation</Button>
                                        </Grid>
                                    }
                                </Grid>
                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                    <Typography variant="h4" component="div">
                                        {customerSelected.nome_cognome.toUpperCase()}
                                        {
                                            auths["customers"] !== "*" ? "" : <Tooltip sx={{ marginRight: '1rem' }} title={"Modifica"}><IconButton
                                                onClick={() => {
                                                    setFieldToEdit("nome_cognome")
                                                    setOpenEditField(true)
                                                }}>
                                                <EditIcon style={{ fontSize: "15px" }} />
                                            </IconButton></Tooltip>
                                        }
                                    </Typography>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                    <div>
                                        <Tooltip style={{ marginRight: '1rem' }} title={customerSelected.status.toLowerCase()}>
                                            <IconButton>
                                                <AiFillInfoCircle style={{ color: statusColors[customerSelected.status.toLowerCase()], fontSize: 'xx-large' }} />
                                            </IconButton>
                                        </Tooltip>
                                        {
                                            auths["customers"] !== "*" ? "" : <Tooltip sx={{ marginRight: '1rem' }} title={"Modifica"}><IconButton
                                                onClick={() => {
                                                    setFieldToEdit("status")
                                                    setOpenEditStatus(true)
                                                }}>
                                                <EditIcon style={{ fontSize: "15px" }} />
                                            </IconButton></Tooltip>
                                        }
                                    </div>
                                </div>
                                {
                                    isLoading ? <Backdrop className={classes.backdrop} open>
                                        <CircularProgress color="inherit" />
                                    </Backdrop> : <div>

                                        <div id="info" ref={refInfo} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '100%', marginBottom: '3rem', marginTop: '3rem' }}>
                                            <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black", marginRight: "1rem" }}>
                                                <CardContent>
                                                    <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                        <div>
                                                            Informazioni cliente
                                                            <Tooltip sx={{ marginRight: '1rem' }} title={"note informazioni"}>
                                                                <IconButton onClick={() => {
                                                                    setNoteType("note_info")
                                                                    setOpenNote(true)
                                                                }}>
                                                                    <NotesIcon sx={{ fontSize: 'xx-large' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            {
                                                                auths["customers"] !== "*" ? "" : <Tooltip sx={{ marginRight: '1rem' }} title={"Modifica"}><IconButton
                                                                    onClick={() => {
                                                                        setFieldToEdit("note_info")
                                                                        setOpenEditField(true)
                                                                    }}>
                                                                    <EditIcon style={{ fontSize: "15px" }} />
                                                                </IconButton></Tooltip>
                                                            }
                                                        </div>
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <ApartmentIcon sx={{ marginBottom: '2rem' }} />
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                        company
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                        {customerSelected.company.toUpperCase()}
                                                        {
                                                            auths["customers"] !== "*" ? "" : <IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("company")
                                                                    setOpenEditField(true)
                                                                }}>
                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                            </IconButton>
                                                        }
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                        indirizzo
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                        {customerSelected.indirizzo}
                                                        {
                                                            auths["customers"] !== "*" ? "" : <IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("indirizzo")
                                                                    setOpenEditField(true)
                                                                }}>
                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                            </IconButton>
                                                        } - {customerSelected.comune}
                                                        {
                                                            auths["customers"] !== "*" ? "" : <IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("comune")
                                                                    setOpenEditField(true)
                                                                }}>
                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                            </IconButton>
                                                        } - {customerSelected.provincia}
                                                        {
                                                            auths["customers"] !== "*" ? "" : <IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("provincia")
                                                                    setOpenEditField(true)
                                                                }}>
                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                            </IconButton>
                                                        } - {customerSelected.cap}
                                                        {
                                                            auths["customers"] !== "*" ? "" : <IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("cap")
                                                                    setOpenEditField(true)
                                                                }}>
                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                            </IconButton>
                                                        }
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                        CF
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 18 }} variant="body2">
                                                        {customerSelected.cf}
                                                        {
                                                            auths["customers"] !== "*" ? "" : <IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("cf")
                                                                    setOpenEditField(true)
                                                                }}>
                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                            </IconButton>
                                                        }
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                        telefono
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 18 }} variant="body2">
                                                        {customerSelected.telefono}
                                                        {
                                                            auths["customers"] !== "*" ? "" : <IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("telefono")
                                                                    setOpenEditField(true)
                                                                }}>
                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                            </IconButton>
                                                        }
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                        bonus
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                        {customerSelected.bonus}
                                                        {
                                                            auths["customers"] !== "*" ? "" : <IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("bonus")
                                                                    setOpenEditField(true)
                                                                }}>
                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                            </IconButton>
                                                        } - {customerSelected.termico_elettrico}
                                                        {
                                                            auths["customers"] !== "*" ? "" : <IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("termico_elettrico")
                                                                    setOpenEditField(true)
                                                                }}>
                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                            </IconButton>
                                                        }
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        {
                                            customerSelected.isSopralluogo === false && customerSelected.isSopralluogo !== null && customerSelected.isSopralluogo !== undefined ? <div style={{ justifyContent: 'center', textAlign: 'center', marginBottom: "8rem" }}>
                                                <IconButton onClick={() => {
                                                    assistCustomer(true, "isSopralluogo")
                                                }}>
                                                    <AddCircleIcon />
                                                </IconButton>
                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                    aggiungi sopralluogo
                                                </Typography></div> : <div id="sopralluogo" ref={refSopr} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
                                                <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black", marginRight: "1rem" }}>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <CardHeader
                                                            action={
                                                                <Tooltip sx={{ marginRight: '1rem' }} title={"rimuovi sopralluogo"}>
                                                                    <IconButton onClick={() => { assistCustomer(false, "isSopralluogo") }} aria-label="settings">
                                                                        <RemoveCircleIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }
                                                        />
                                                    }
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                            <div>
                                                                Sopralluogo
                                                            </div>
                                                        </Typography>
                                                        {
                                                            customerSelected.status !== "sopralluogo programmato" ? "" : <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                                <Grid item xs={12} sm={12}>
                                                                    <FormControlLabel
                                                                        label="Sopralluogo terminato?"
                                                                        control={<Checkbox onChange={() => updateCustomerStatus("in attesa di installazione")} />}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        }
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                            {/* <div> */}
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    data sopralluogo
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.data_sopralluogo}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("data_sopralluogo")
                                                                                setOpenEditField(true)
                                                                                setRefSectionState(refSopr)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    tecnico sopralluogo
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.tecnico_sopralluogo}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("tecnico_sopralluogo")
                                                                                setOpenEditField(true)
                                                                                setRefSectionState(refSopr)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    pdf
                                                                </Typography>
                                                                {
                                                                    customerSelected.pdf_sopralluogo.length === 0 && customerSelected.pdf_sopralluogo === "" || customerSelected.pdf_sopralluogo === null || customerSelected.pdf_sopralluogo === undefined ? "" :
                                                                        <Typography variant="h7" component="div">
                                                                            {
                                                                                customerSelected.pdf_sopralluogo.map(pf => {
                                                                                    return <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                                                                        <IconButton item xs={12} sm={6}>
                                                                                            <a style={{ fontSize: "15px" }} href={pf} target="_blank">{pf.split("%2F")[2].split("?alt")[0].replaceAll("%20", " ")}</a>
                                                                                        </IconButton>
                                                                                        {
                                                                                            auths["customers"] !== "*" ? "" : <IconButton item xs={12} sm={6} onClick={() => {
                                                                                                deletePdf(pf, "pdf_sopralluogo", refSopr)
                                                                                                setIsLoading(true)
                                                                                            }}>
                                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                            </IconButton>
                                                                                        }
                                                                                    </Grid >
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("pdf_sopralluogo")
                                                                            setRefSectionState(refSopr)
                                                                            setOpenLoadPdf(true)
                                                                        }}>
                                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                                    </IconButton>
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                            <div style={{ marginTop: '3rem' }}>
                                                                <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                    <Typography sx={{ color: "rgba(0, 0, 0, 0.4)", fontSize: 20, fontWeight: 'bold' }} style={{ marginTop: '1rem' }} color="text.primary" gutterBottom>
                                                                        foto
                                                                    </Typography>
                                                                    <IconButton onClick={() => {
                                                                        setRefSectionState(refSopr)
                                                                        downloadFolder(customerSelected.foto_sopralluogo, "sopralluogo")
                                                                    }}>
                                                                        <GetAppIcon />
                                                                    </IconButton>
                                                                    {
                                                                        auths["customers"] !== "*" ? "" :
                                                                            <IconButton onClick={() => {
                                                                                setAskDeleteAll(true)
                                                                                setRefSectionState(refSopr)
                                                                                setTypeToDeleteAll("sopralluogo")
                                                                            }}>
                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                            </IconButton>
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                        {/* <FileBase64
                                                                            multiple={true}
                                                                            onDone={(event) => {
                                                                                setSelectedSopralluogo(event)
                                                                                setIsSopralluogoPicked(true)
                                                                            }}
                                                                        /> */}
                                                                        <input type="file" multiple onChange={(event) => {
                                                                            setSelectedSopralluogo(event.target.files)
                                                                            setIsSopralluogoPicked(true)
                                                                        }} />
                                                                    </div>
                                                                    <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} style={{ marginTop: '1.5rem' }}>
                                                                        <Button disabled={!isSopralluogoPicked} onClick={(event) => {
                                                                            handleSubmissionSopralluogo(event)
                                                                            setIsLoading(true)
                                                                        }} variant="outlined" sx={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                                    </div>
                                                                </div>
                                                                <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} style={{ marginTop: '1.5rem' }}>
                                                                    <Button onClick={(event) => {
                                                                        setOpenSopralluogo(event)
                                                                        setPageSopralluogo(1)
                                                                    }}
                                                                        variant="outlined" sx={{ color: 'white', backgroundColor: 'green' }}>Apri {customerSelected.foto_sopralluogo.length} foto</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" style={{ marginTop: '2rem' }} >
                                                            <Grid item xs={12} sm={6} style={{ marginTop: '1rem' }}>
                                                                <Typography display="inline-block" style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    note sopralluogo
                                                                </Typography>
                                                                <Typography style={{ fontSize: 18, marginBottom: '1rem', whiteSpace: "pre-line" }} variant="body2">
                                                                    {customerSelected.note_sopralluogo}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("note_sopralluogo")
                                                                                setOpenEditField(true)
                                                                                setRefSectionState(refSopr)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        }
                                        {
                                            customerSelected.isInstallazione === false && customerSelected.isInstallazione !== null && customerSelected.isInstallazione !== undefined ? <div style={{ justifyContent: 'center', textAlign: 'center', marginBottom: "8rem" }}>
                                                <IconButton onClick={() => {
                                                    assistCustomer(true, "isInstallazione")
                                                }}>
                                                    <AddCircleIcon />
                                                </IconButton>
                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                    aggiungi installazione
                                                </Typography></div> : <div id="installazione" ref={refInst} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
                                                <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black", marginRight: "1rem" }}>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <CardHeader
                                                            action={
                                                                <Tooltip sx={{ marginRight: '1rem' }} title={"rimuovi installazione"}>
                                                                    <IconButton onClick={() => { assistCustomer(false, "isInstallazione") }} aria-label="settings">
                                                                        <RemoveCircleIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }
                                                        />
                                                    }
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                            <div>
                                                                Installazione
                                                            </div>
                                                        </Typography>
                                                        {
                                                            customerSelected.status !== "installazione programmata" ? "" : <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                                <Grid item xs={12} sm={12}>
                                                                    <FormControlLabel
                                                                        label="Installazione terminata? Vai allo stato di fatturazione."
                                                                        control={<Checkbox onChange={() => updateCustomerStatus("da fatturare")} />}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        }
                                                        {
                                                            customerSelected.status !== "da fatturare" ? "" : <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                                <Grid item xs={12} sm={12}>
                                                                    <FormControlLabel
                                                                        label="Fatturazione terminata?"
                                                                        control={<Checkbox onChange={() => updateCustomerStatus("in attesa di pagamento")} />}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        }
                                                        {
                                                            customerSelected.status !== "in attesa di pagamento" ? "" : <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                                <Grid item xs={12} sm={12}>
                                                                    <FormControlLabel
                                                                        label="Pagato?"
                                                                        control={<Checkbox onChange={() => updateCustomerStatus("pagato")} />}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        }
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                            {/* <div> */}
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    computo
                                                                </Typography>
                                                                <Typography style={{ fontSize: 18, marginBottom: '1rem', whiteSpace: "pre-line", textAlign: "left" }} variant="body2">
                                                                    {customerSelected.computo}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("computo")
                                                                                setRefSectionState(refInst)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    data installazione
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.data_installazione}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("data_installazione")
                                                                                setRefSectionState(refInst)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    tecnico installazione
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.tecnico_installazione}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("tecnico_installazione")
                                                                                setRefSectionState(refInst)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        {/* </div> */}
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                            {/* <div> */}
                                                            {/* <div> */}
                                                        </Grid>
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    computo (pdf)
                                                                </Typography>
                                                                {
                                                                    customerSelected.pdf_computo.length === 0 || customerSelected.pdf_computo === "" || customerSelected.pdf_computo === null || customerSelected.pdf_computo === undefined ? "" :
                                                                        <Typography variant="h7" component="div">
                                                                            {
                                                                                customerSelected.pdf_computo.map(pf => {
                                                                                    return <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                                                                        {/* <p item xs={12} sm={6}></p> */}
                                                                                        <IconButton item xs={12} sm={6}>
                                                                                            <a style={{ fontSize: "15px" }} href={pf} target="_blank">{pf.split("%2F")[2].split("?alt")[0].replaceAll("%20", " ")}</a>
                                                                                        </IconButton>
                                                                                        {
                                                                                            auths["customers"] !== "*" ? "" : <IconButton item xs={12} sm={6} onClick={() => {
                                                                                                deletePdf(pf, "pdf_computo", refInst)
                                                                                                setIsLoading(true)
                                                                                            }}>
                                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                            </IconButton>
                                                                                        }
                                                                                    </Grid>
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("pdf_computo")
                                                                            setRefSectionState(refInst)
                                                                            setOpenLoadPdf(true)
                                                                        }}>
                                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                                    </IconButton>
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        {/* <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                            </Grid> */}
                                                        <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                            <div>
                                                                <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                    <Typography sx={{ color: "rgba(0, 0, 0, 0.4)", fontSize: 20, fontWeight: 'bold' }} style={{ marginTop: '1rem' }} color="text.primary" gutterBottom>
                                                                        foto
                                                                    </Typography>
                                                                    <IconButton onClick={() => {
                                                                        setRefSectionState(refInst)
                                                                        downloadFolder(customerSelected.foto_fine_installazione, "fine_installazione")
                                                                    }}>
                                                                        <GetAppIcon />
                                                                    </IconButton>
                                                                    {
                                                                        auths["customers"] !== "*" ? "" :
                                                                            <IconButton onClick={() => {
                                                                                setAskDeleteAll(true)
                                                                                setRefSectionState(refInst)
                                                                                setTypeToDeleteAll("fine_installazione")
                                                                            }}>
                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                            </IconButton>
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                        {/* <FileBase64
                                                                            multiple={true}
                                                                            onDone={(event) => {
                                                                                setSelectedInstallazione(event)
                                                                                setIsInstallazionePicked(true)
                                                                            }}
                                                                        /> */}
                                                                        <input type="file" multiple onChange={(event) => {
                                                                            setSelectedInstallazione(event.target.files)
                                                                            setIsInstallazionePicked(true)
                                                                        }} />
                                                                    </div>
                                                                    <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} style={{ marginTop: '1.5rem' }}>
                                                                        <Button disabled={!isInstallazionePicked} onClick={(event) => {
                                                                            handleSubmissionInstallazione(event)
                                                                            setIsLoading(true)
                                                                        }} variant="outlined" sx={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                                    </div>
                                                                </div>
                                                                <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} style={{ marginTop: '1.5rem' }}>
                                                                    <Button onClick={(event) => {
                                                                        setOpenInstallazione(event)
                                                                        setPageInstallazione(1)
                                                                    }} variant="outlined" sx={{ color: 'white', backgroundColor: 'green' }}>Apri {customerSelected.foto_fine_installazione.length} foto</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" style={{ marginTop: '2rem' }} >
                                                            <Grid item xs={12} sm={6} style={{ marginTop: '1rem' }}>
                                                                <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    note installazione
                                                                </Typography>
                                                                <Typography style={{ fontSize: 18, marginBottom: '1rem', whiteSpace: "pre-line" }} variant="body2">
                                                                    {customerSelected.note_installazione}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("note_installazione")
                                                                                setOpenEditField(true)
                                                                                setRefSectionState(refInst)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        }
                                        {
                                            auths["customers"] !== "*" ? "" : <div ref={refDoc} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
                                                <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black", marginRight: "1rem" }}>
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                            <div>
                                                                Documenti
                                                            </div>
                                                        </Typography>
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                            {/* <div> */}
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    pagamenti (testo)
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.pagamenti_testo}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("pagamenti_testo")
                                                                                setRefSectionState(refDoc)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    pagamenti (pdf)
                                                                </Typography>
                                                                {
                                                                    customerSelected.pagamenti_pdf.length === 0 || customerSelected.pagamenti_pdf === "" || customerSelected.pagamenti_pdf === null || customerSelected.pagamenti_pdf === undefined ? "" :
                                                                        <Typography variant="h7" component="div">
                                                                            {
                                                                                customerSelected.pagamenti_pdf.map(pf => {
                                                                                    return <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                                                                        <IconButton item xs={12} sm={6}>
                                                                                            <a style={{ fontSize: "15px" }} href={pf} target="_blank">{pf.split("%2F")[2].split("?alt")[0].replaceAll("%20", " ")}</a>
                                                                                        </IconButton>
                                                                                        {
                                                                                            auths["customers"] !== "*" ? "" : <IconButton item xs={12} sm={6} onClick={() => {
                                                                                                deletePdf(pf, "pagamenti_pdf", refDoc)
                                                                                                setIsLoading(true)
                                                                                            }}>
                                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                            </IconButton>
                                                                                        }
                                                                                    </Grid >
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("pagamenti_pdf")
                                                                            setRefSectionState(refDoc)
                                                                            setOpenLoadPdf(true)
                                                                        }}>
                                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                                    </IconButton>
                                                                }
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    trasferta
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.trasferta}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("trasferta")
                                                                                setRefSectionState(refDoc)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    collaudo
                                                                </Typography>
                                                                {
                                                                    customerSelected.collaudo.length === 0 || customerSelected.collaudo === "" || customerSelected.collaudo === null || customerSelected.collaudo === undefined ? "" :
                                                                        <Typography variant="h7" component="div">
                                                                            {
                                                                                customerSelected.collaudo.map(pf => {
                                                                                    return <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                                                                        <IconButton item xs={12} sm={6}>
                                                                                            <a style={{ fontSize: "15px" }} href={pf} target="_blank">{pf.split("%2F")[2].split("?alt")[0].replaceAll("%20", " ")}</a>
                                                                                        </IconButton>
                                                                                        {
                                                                                            auths["customers"] !== "*" ? "" : <IconButton item xs={12} sm={6} onClick={() => {
                                                                                                deletePdf(pf, "collaudo", refDoc)
                                                                                                setIsLoading(true)
                                                                                            }}>
                                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                            </IconButton>
                                                                                        }
                                                                                    </Grid >
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("collaudo")
                                                                            setRefSectionState(refDoc)
                                                                            setOpenLoadPdf(true)
                                                                        }}>
                                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                                    </IconButton>
                                                                }
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    check list
                                                                </Typography>
                                                                {
                                                                    customerSelected.check_list.length === 0 || customerSelected.check_list === "" || customerSelected.check_list === null || customerSelected.check_list === undefined ? "" :
                                                                        <Typography variant="h7" component="div">
                                                                            {
                                                                                customerSelected.check_list.map(pf => {
                                                                                    return <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                                                                        <IconButton item xs={12} sm={6}>
                                                                                            <a style={{ fontSize: "15px" }} href={pf} target="_blank">{pf.split("%2F")[2].split("?alt")[0].replaceAll("%20", " ")}</a>
                                                                                        </IconButton>
                                                                                        {
                                                                                            auths["customers"] !== "*" ? "" : <IconButton item xs={12} sm={6} onClick={() => {
                                                                                                deletePdf(pf, "check_list", refDoc)
                                                                                                setIsLoading(true)
                                                                                            }}>
                                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                            </IconButton>
                                                                                        }
                                                                                    </Grid >
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("check_list")
                                                                            setRefSectionState(refDoc)
                                                                            setOpenLoadPdf(true)
                                                                        }}>
                                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                                    </IconButton>
                                                                }
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    fgas
                                                                </Typography>
                                                                {
                                                                    customerSelected.fgas.length === 0 || customerSelected.fgas === "" || customerSelected.fgas === null || customerSelected.fgas === undefined ? "" :
                                                                        <Typography variant="h7" component="div">
                                                                            {
                                                                                customerSelected.fgas.map(pf => {
                                                                                    return <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                                                                        <IconButton item xs={12} sm={6}>
                                                                                            <a style={{ fontSize: "15px" }} href={pf} target="_blank">{pf.split("%2F")[2].split("?alt")[0].replaceAll("%20", " ")}</a>
                                                                                        </IconButton>
                                                                                        {
                                                                                            auths["customers"] !== "*" ? "" : <IconButton item xs={12} sm={6} onClick={() => {
                                                                                                deletePdf(pf, "fgas", refDoc)
                                                                                                setIsLoading(true)
                                                                                            }}>
                                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                            </IconButton>
                                                                                        }
                                                                                    </Grid >
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("fgas")
                                                                            setRefSectionState(refDoc)
                                                                            setOpenLoadPdf(true)
                                                                        }}>
                                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                                    </IconButton>
                                                                }
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    prova fumi
                                                                </Typography>
                                                                {
                                                                    customerSelected.prova_fumi.length === 0 || customerSelected.prova_fumi === "" || customerSelected.prova_fumi === null || customerSelected.prova_fumi === undefined ? "" :
                                                                        <Typography variant="h7" component="div">
                                                                            {
                                                                                customerSelected.prova_fumi.map(pf => {
                                                                                    return <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                                                                        <IconButton item xs={12} sm={6}>
                                                                                            <a style={{ fontSize: "15px" }} href={pf} target="_blank">{pf.split("%2F")[2].split("?alt")[0].replaceAll("%20", " ")}</a>
                                                                                        </IconButton>
                                                                                        {
                                                                                            auths["customers"] !== "*" ? "" : <IconButton item xs={12} sm={6} onClick={() => {
                                                                                                deletePdf(pf, "prova_fumi", refDoc)
                                                                                                setIsLoading(true)
                                                                                            }}>
                                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                            </IconButton>
                                                                                        }
                                                                                    </Grid >
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("prova_fumi")
                                                                            setRefSectionState(refDoc)
                                                                            setOpenLoadPdf(true)
                                                                        }}>
                                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                                    </IconButton>
                                                                }
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    di.co
                                                                </Typography>
                                                                {
                                                                    customerSelected.di_co.length === 0 || customerSelected.di_co === "" || customerSelected.di_co === null || customerSelected.di_co === undefined ? "" :
                                                                        <Typography variant="h7" component="div">
                                                                            {
                                                                                customerSelected.di_co.map(pf => {
                                                                                    return <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                                                                        <IconButton item xs={12} sm={6}>
                                                                                            <a style={{ fontSize: "15px" }} href={pf} target="_blank">{pf.split("%2F")[2].split("?alt")[0].replaceAll("%20", " ")}</a>
                                                                                        </IconButton>
                                                                                        {
                                                                                            auths["customers"] !== "*" ? "" : <IconButton item xs={12} sm={6} onClick={() => {
                                                                                                deletePdf(pf, "di_co", refDoc)
                                                                                                setIsLoading(true)
                                                                                            }}>
                                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                            </IconButton>
                                                                                        }
                                                                                    </Grid >
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("di_co")
                                                                            setRefSectionState(refDoc)
                                                                            setOpenLoadPdf(true)
                                                                        }}>
                                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                                    </IconButton>
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" style={{ marginTop: '2rem' }} >
                                                            <Grid item xs={12} sm={6} style={{ marginTop: '1rem' }}>
                                                                <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    note documenti
                                                                </Typography>
                                                                <Typography style={{ fontSize: 18, marginBottom: '1rem', whiteSpace: "pre-line" }} variant="body2">
                                                                    {customerSelected.note_pagamenti}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("note_pagamenti")
                                                                                setRefSectionState(refDoc)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        }
                                        {
                                            !customerSelected.isAssisted ? <div style={{ justifyContent: 'center', textAlign: 'center', marginBottom: "8rem" }}>
                                                <IconButton onClick={() => {
                                                    assistCustomer(true, "isAssisted")
                                                }}>
                                                    <AddCircleIcon />
                                                </IconButton>
                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                    aggiungi assistenza
                                                </Typography></div> : <div id="assistenza" ref={refAss} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
                                                <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black", marginRight: "1rem" }} style={{ marginBottom: '3rem' }}>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <CardHeader
                                                            action={
                                                                <Tooltip sx={{ marginRight: '1rem' }} title={"rimuovi assistenza"}>
                                                                    <IconButton onClick={() => { assistCustomer(false, "isAssisted", "remove") }} aria-label="settings">
                                                                        <RemoveCircleIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }
                                                        />
                                                    }
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                            <div>
                                                                Assistenza
                                                            </div>
                                                        </Typography>
                                                        {
                                                            customerSelected.status !== "assistenza in corso" ? "" : <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                                <Grid item xs={12} sm={12}>
                                                                    <FormControlLabel
                                                                        label="Assistenza terminata?"
                                                                        control={<Checkbox onChange={() => updateCustomerStatus("assistenza terminata")} />}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        }
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                            <Grid item xs={12} sm={4}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    assistenza (pdf)
                                                                </Typography>
                                                                {
                                                                    customerSelected.assistenza.length === 0 || customerSelected.assistenza === "" || customerSelected.assistenza === null || customerSelected.assistenza === undefined ? "" :
                                                                        <Typography variant="h7" component="div">
                                                                            {
                                                                                customerSelected.assistenza.map(pf => {
                                                                                    return <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                                                                        <IconButton item xs={12} sm={6}>
                                                                                            <a style={{ fontSize: "15px" }} href={pf} target="_blank">{pf.split("%2F")[2].split("?alt")[0].replaceAll("%20", " ")}</a>
                                                                                        </IconButton>
                                                                                        {
                                                                                            auths["customers"] !== "*" ? "" : <IconButton item xs={12} sm={6} onClick={() => {
                                                                                                deletePdf(pf, "assistenza", refAss)
                                                                                                setIsLoading(true)
                                                                                            }}>
                                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                            </IconButton>
                                                                                        }
                                                                                    </Grid >
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("assistenza")
                                                                            setRefSectionState(refAss)
                                                                            setOpenLoadPdf(true)
                                                                        }}>
                                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                                    </IconButton>
                                                                }
                                                            </Grid>
                                                            <Grid item xs={12} sm={4}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    data assistenza
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.data_assistenza}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("data_assistenza")
                                                                                setRefSectionState(refAss)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={4}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    tecnico di assistenza
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.tecnico_assistenza}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("tecnico_assistenza")
                                                                                setRefSectionState(refAss)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <div>
                                                                <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                    <Typography sx={{ color: "rgba(0, 0, 0, 0.4)", fontSize: 20, fontWeight: 'bold' }} style={{ marginTop: '1rem' }} color="text.primary" gutterBottom>
                                                                        foto
                                                                    </Typography>
                                                                    <IconButton onClick={() => {
                                                                        setRefSectionState(refAss)
                                                                        downloadFolder(customerSelected.foto_assistenza, "assistenza")
                                                                    }}>
                                                                        <GetAppIcon />
                                                                    </IconButton>
                                                                    {
                                                                        auths["customers"] !== "*" ? "" :
                                                                            <IconButton onClick={() => {
                                                                                setAskDeleteAll(true)
                                                                                setRefSectionState(refAss)
                                                                                setTypeToDeleteAll("assistenza")
                                                                            }}>
                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                            </IconButton>
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                        <input type="file" multiple onChange={(event) => {
                                                                            setSelectedAssistenza(event.target.files)
                                                                            setIsAssistenzaPicked(true)
                                                                        }} />
                                                                    </div>
                                                                    <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} style={{ marginTop: '1.5rem' }}>
                                                                        <Button disabled={!isAssistenzaPicked} onClick={(event) => {
                                                                            handleSubmissionAssistenza(event)
                                                                            setIsLoading(true)
                                                                        }} variant="outlined" sx={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                                    </div>
                                                                </div>
                                                                <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} style={{ marginTop: '1.5rem' }}>
                                                                    <Button onClick={(event) => {
                                                                        setOpenAssistenza(event)
                                                                        setPageAssistenza(1)
                                                                    }} variant="outlined" sx={{ color: 'white', backgroundColor: 'green' }}>Apri {customerSelected.foto_assistenza.length} foto</Button>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" style={{ marginTop: '2rem' }} >
                                                            <Grid item xs={12} sm={6} style={{ marginTop: '1rem' }}>
                                                                <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    note assistenza
                                                                </Typography>
                                                                <Typography style={{ fontSize: 18, marginBottom: '1rem', whiteSpace: "pre-line" }} variant="body2">
                                                                    {customerSelected.note_assistenza}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("note_assistenza")
                                                                                setRefSectionState(refAss)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        }
                                        {
                                            !customerSelected.isArgo ? <div style={{ justifyContent: 'center', textAlign: 'center', marginBottom: "8rem" }}>
                                                <IconButton onClick={() => {
                                                    assistCustomer(true, "isArgo")
                                                }}>
                                                    <AddCircleIcon />
                                                </IconButton>
                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                    aggiungi ARGO
                                                </Typography></div> : <div id="argo" ref={refArgo} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
                                                <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black", marginRight: "1rem" }} style={{ marginBottom: '3rem' }}>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <CardHeader
                                                            action={
                                                                <Tooltip sx={{ marginRight: '1rem' }} title={"rimuovi argo"}>
                                                                    <IconButton onClick={() => { assistCustomer(false, "isArgo") }} aria-label="settings">
                                                                        <RemoveCircleIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }
                                                        />
                                                    }
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                            <div>
                                                                ARGO
                                                            </div>
                                                        </Typography>
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                            <Grid item xs={12} sm={4}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    ARGO (pdf)
                                                                </Typography>
                                                                {
                                                                    !(customerSelected.argo_pdf && !(customerSelected.argo_pdf.length === 0 || customerSelected.argo_pdf === "" || customerSelected.argo_pdf === null || customerSelected.argo_pdf === undefined)) ? "" :
                                                                        <Typography variant="h7" component="div">
                                                                            {
                                                                                customerSelected.argo_pdf.map(pf => {
                                                                                    return <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                                                                        <IconButton item xs={12} sm={6}>
                                                                                            <a style={{ fontSize: "15px" }} href={pf} target="_blank">{pf.split("%2F")[2].split("?alt")[0].replaceAll("%20", " ")}</a>
                                                                                        </IconButton>
                                                                                        {
                                                                                            auths["customers"] !== "*" ? "" : <IconButton item xs={12} sm={6} onClick={() => {
                                                                                                deletePdf(pf, "argo_pdf", refArgo)
                                                                                                setIsLoading(true)
                                                                                            }}>
                                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                            </IconButton>
                                                                                        }
                                                                                    </Grid >
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("argo_pdf")
                                                                            setRefSectionState(refArgo)
                                                                            setOpenLoadPdf(true)
                                                                        }}>
                                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                                    </IconButton>
                                                                }
                                                            </Grid>
                                                            <Grid item xs={12} sm={4}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    data ARGO
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.data_argo}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("data_argo")
                                                                                setRefSectionState(refArgo)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={4}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    tecnico ARGO
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.tecnico_argo}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("tecnico_argo")
                                                                                setRefSectionState(refArgo)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <div>
                                                                <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                    <Typography sx={{ color: "rgba(0, 0, 0, 0.4)", fontSize: 20, fontWeight: 'bold' }} style={{ marginTop: '1rem' }} color="text.primary" gutterBottom>
                                                                        foto
                                                                    </Typography>
                                                                    <IconButton onClick={() => {
                                                                        setRefSectionState(refArgo)
                                                                        downloadFolder(customerSelected.foto_argo, "argo")
                                                                    }}>
                                                                        <GetAppIcon />
                                                                    </IconButton>
                                                                    {
                                                                        auths["customers"] !== "*" ? "" :
                                                                            <IconButton onClick={() => {
                                                                                setAskDeleteAll(true)
                                                                                setRefSectionState(refArgo)
                                                                                setTypeToDeleteAll("argo")
                                                                            }}>
                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                            </IconButton>
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                        <input type="file" multiple onChange={(event) => {
                                                                            setSelectedArgo(event.target.files)
                                                                            setIsArgoPicked(true)
                                                                        }} />
                                                                    </div>
                                                                    <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} style={{ marginTop: '1.5rem' }}>
                                                                        <Button disabled={!isArgoPicked} onClick={(event) => {
                                                                            handleSubmissionArgo(event)
                                                                            setIsLoading(true)
                                                                        }} variant="outlined" sx={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                                    </div>
                                                                </div>
                                                                <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} style={{ marginTop: '1.5rem' }}>
                                                                    <Button onClick={(event) => {
                                                                        setOpenArgo(event)
                                                                        setPageArgo(1)
                                                                    }} variant="outlined" sx={{ color: 'white', backgroundColor: 'green' }}>Apri {!customerSelected.foto_argo ? "0" : customerSelected.foto_argo.length} foto</Button>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" style={{ marginTop: '2rem' }} >
                                                            <Grid item xs={12} sm={6} style={{ marginTop: '1rem' }}>
                                                                <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    note argo
                                                                </Typography>
                                                                <Typography style={{ fontSize: 18, marginBottom: '1rem', whiteSpace: "pre-line" }} variant="body2">
                                                                    {customerSelected.note_argo}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("note_argo")
                                                                                setRefSectionState(refArgo)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        }
                                        {
                                            !customerSelected.isBuildAutomation ? <div style={{ justifyContent: 'center', textAlign: 'center', marginBottom: "8rem" }}>
                                                <IconButton onClick={() => {
                                                    assistCustomer(true, "isBuildAutomation")
                                                }}>
                                                    <AddCircleIcon />
                                                </IconButton>
                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                    aggiungi BUILDING AUTOMATION
                                                </Typography></div> : <div id="buildAutomation" ref={refBAuto} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
                                                <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black", marginRight: "1rem" }} style={{ marginBottom: '3rem' }}>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <CardHeader
                                                            action={
                                                                <Tooltip sx={{ marginRight: '1rem' }} title={"rimuovi building automation"}>
                                                                    <IconButton onClick={() => { assistCustomer(false, "isBuildAutomation") }} aria-label="settings">
                                                                        <RemoveCircleIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }
                                                        />
                                                    }
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                            <div>
                                                                BUILDING AUTOMATION
                                                            </div>
                                                        </Typography>
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                            <Grid item xs={12} sm={4}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    building automation (pdf)
                                                                </Typography>
                                                                {
                                                                    !(customerSelected.buildAutomation_pdf && !(customerSelected.buildAutomation_pdf.length === 0 || customerSelected.buildAutomation_pdf === "" || customerSelected.buildAutomation_pdf === null || customerSelected.buildAutomation_pdf === undefined)) ? "" :
                                                                        <Typography variant="h7" component="div">
                                                                            {
                                                                                customerSelected.buildAutomation_pdf.map(pf => {
                                                                                    return <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                                                                        <IconButton item xs={12} sm={6}>
                                                                                            <a style={{ fontSize: "15px" }} href={pf} target="_blank">{pf.split("%2F")[2].split("?alt")[0].replaceAll("%20", " ")}</a>
                                                                                        </IconButton>
                                                                                        {
                                                                                            auths["customers"] !== "*" ? "" : <IconButton item xs={12} sm={6} onClick={() => {
                                                                                                deletePdf(pf, "buildAutomation_pdf", refBAuto)
                                                                                                setIsLoading(true)
                                                                                            }}>
                                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                            </IconButton>
                                                                                        }
                                                                                    </Grid >
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("buildAutomation_pdf")
                                                                            setRefSectionState(refBAuto)
                                                                            setOpenLoadPdf(true)
                                                                        }}>
                                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                                    </IconButton>
                                                                }
                                                            </Grid>
                                                            <Grid item xs={12} sm={4}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    data building automation
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.data_buildAutomation}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("data_buildAutomation")
                                                                                setRefSectionState(refBAuto)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={4}>
                                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    tecnico di building automation
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.tecnico_buildAutomation}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("tecnico_buildAutomation")
                                                                                setRefSectionState(refBAuto)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <div>
                                                                <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                    <Typography sx={{ color: "rgba(0, 0, 0, 0.4)", fontSize: 20, fontWeight: 'bold' }} style={{ marginTop: '1rem' }} color="text.primary" gutterBottom>
                                                                        foto
                                                                    </Typography>
                                                                    <IconButton onClick={() => {
                                                                        setRefSectionState(refBAuto)
                                                                        downloadFolder(customerSelected.foto_buildAutomation, "buildAutomation")
                                                                    }}>
                                                                        <GetAppIcon />
                                                                    </IconButton>
                                                                    {
                                                                        auths["customers"] !== "*" ? "" :
                                                                            <IconButton onClick={() => {
                                                                                setAskDeleteAll(true)
                                                                                setRefSectionState(refBAuto)
                                                                                setTypeToDeleteAll("buildAutomation")
                                                                            }}>
                                                                                <DeleteIcon style={{ fontSize: "15px" }} />
                                                                            </IconButton>
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                        <input type="file" multiple onChange={(event) => {
                                                                            setSelectedBuildAutomation(event.target.files)
                                                                            setIsBuildAutomationPicked(true)
                                                                        }} />
                                                                    </div>
                                                                    <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} style={{ marginTop: '1.5rem' }}>
                                                                        <Button disabled={!isBuildAutomationPicked} onClick={(event) => {
                                                                            handleSubmissionBuildAutomation(event)
                                                                            setIsLoading(true)
                                                                        }} variant="outlined" sx={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                                    </div>
                                                                </div>
                                                                <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} style={{ marginTop: '1.5rem' }}>
                                                                    <Button onClick={(event) => {
                                                                        setOpenBuildAutomation(event)
                                                                        setPageBuildAutomation(1)
                                                                    }} variant="outlined" sx={{ color: 'white', backgroundColor: 'green' }}>Apri {!customerSelected.foto_buildAutomation ? "0" : customerSelected.foto_buildAutomation.length} foto</Button>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" style={{ marginTop: '2rem' }} >
                                                            <Grid item xs={12} sm={6} style={{ marginTop: '1rem' }}>
                                                                <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                    note buildAutomation
                                                                </Typography>
                                                                <Typography style={{ fontSize: 18, marginBottom: '1rem', whiteSpace: "pre-line" }} variant="body2">
                                                                    {customerSelected.note_buildAutomation}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("note_buildAutomation")
                                                                                setRefSectionState(refBAuto)
                                                                                setOpenEditField(true)
                                                                            }}>
                                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                                        </IconButton>
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        }
                                        {
                                            customerSelected === null ? "" : <Dialog onClose={handleCloseNote} open={openNote}>
                                                <DialogTitle>{noteType.toUpperCase().replace("_", " ")}:</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        {
                                                            customerSelected[noteType] === "" || customerSelected[noteType] === null || customerSelected[noteType] === undefined ? <h4>Vuoto</h4> : <div>
                                                                {customerSelected[noteType]}
                                                            </div>
                                                        }
                                                    </DialogContentText>
                                                </DialogContent>
                                            </Dialog>
                                        }
                                        {
                                            customerSelected === null ? "" : <div>
                                                <Modal
                                                    open={openSopralluogo}
                                                    onClose={() => { setOpenSopralluogo(false) }}
                                                    aria-labelledby="modal-modal-label"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        {
                                                            customerSelected.foto_sopralluogo.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> : <div>
                                                                <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Foto sopralluogo</h2>
                                                                {
                                                                    customerSelected.foto_sopralluogo.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> :
                                                                        <div>
                                                                            <Gallery
                                                                                images={convertToGallery(customerSelected.foto_sopralluogo, "foto_sopralluogo")}
                                                                                currentImageWillChange={onCurrentImageChange}
                                                                                customControls={[
                                                                                    <IconButton color="error" onClick={(event) => {
                                                                                        deleteImage(customerSelected.foto_sopralluogo[currentImage], "foto_sopralluogo")
                                                                                        setIsLoading(true)
                                                                                    }}>
                                                                                        <DeleteIcon />
                                                                                    </IconButton>,
                                                                                    <IconButton color="primary" onClick={(event) => {
                                                                                        setIsLoading(true)
                                                                                        downloadImage(customerSelected.foto_sopralluogo[currentImage], "foto_sopralluogo")
                                                                                    }}>
                                                                                        <GetAppIcon />
                                                                                    </IconButton>
                                                                                ]}
                                                                            />
                                                                        </div>
                                                                }
                                                            </div>
                                                        }
                                                    </Box>
                                                </Modal>
                                                <Modal
                                                    open={openInstallazione}
                                                    onClose={() => { setOpenInstallazione(false) }}
                                                    aria-labelledby="modal-modal-label"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        {
                                                            customerSelected.foto_fine_installazione.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> : <div>
                                                                <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Foto fine installazione</h2>
                                                                {
                                                                    customerSelected.foto_fine_installazione.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> :
                                                                        <div>
                                                                            <Gallery
                                                                                images={convertToGallery(customerSelected.foto_fine_installazione, "foto_fine_installazione")}
                                                                                currentImageWillChange={onCurrentImageChange}
                                                                                customControls={[
                                                                                    <IconButton color="error" onClick={(event) => {
                                                                                        deleteImage(customerSelected.foto_fine_installazione[currentImage], "foto_fine_installazione")
                                                                                        setIsLoading(true)
                                                                                    }}>
                                                                                        <DeleteIcon />
                                                                                    </IconButton>,
                                                                                    <IconButton color="primary" onClick={(event) => {
                                                                                        setIsLoading(true)
                                                                                        downloadImage(customerSelected.foto_fine_installazione[currentImage], "foto_fine_installazione")
                                                                                    }}>
                                                                                        <GetAppIcon />
                                                                                    </IconButton>
                                                                                ]} />
                                                                        </div>
                                                                }
                                                            </div>
                                                        }

                                                    </Box>
                                                </Modal>
                                                <Modal
                                                    open={openAssistenza}
                                                    onClose={() => { setOpenAssistenza(false) }}
                                                    aria-labelledby="modal-modal-label"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        {
                                                            customerSelected.foto_assistenza.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> : <div>
                                                                <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Foto assistenza</h2>
                                                                {
                                                                    customerSelected.foto_assistenza.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> :
                                                                        <div>
                                                                            <Gallery
                                                                                images={convertToGallery(customerSelected.foto_assistenza, "foto_assistenza")}
                                                                                currentImageWillChange={onCurrentImageChange}
                                                                                customControls={[
                                                                                    <IconButton color="error" onClick={(event) => {
                                                                                        deleteImage(customerSelected.foto_assistenza[currentImage], "foto_assistenza")
                                                                                        setIsLoading(true)
                                                                                    }}>
                                                                                        <DeleteIcon />
                                                                                    </IconButton>,
                                                                                    <IconButton color="primary" onClick={(event) => {
                                                                                        setIsLoading(true)
                                                                                        downloadImage(customerSelected.foto_assistenza[currentImage], "foto_assistenza")
                                                                                    }}>
                                                                                        <GetAppIcon />
                                                                                    </IconButton>
                                                                                ]} />
                                                                        </div>
                                                                }
                                                            </div>
                                                        }
                                                    </Box>
                                                </Modal>
                                                <Modal
                                                    open={openArgo}
                                                    onClose={() => { setOpenArgo(false) }}
                                                    aria-labelledby="modal-modal-label"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        {
                                                            !(customerSelected.foto_argo && customerSelected.foto_argo.length !== 0) ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> : <div>
                                                                <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Foto argo</h2>
                                                                {
                                                                    customerSelected.foto_argo.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> :
                                                                        <div>
                                                                            <Gallery
                                                                                images={convertToGallery(customerSelected.foto_argo, "foto_argo")}
                                                                                currentImageWillChange={onCurrentImageChange}
                                                                                customControls={[
                                                                                    <IconButton color="error" onClick={(event) => {
                                                                                        deleteImage(customerSelected.foto_argo[currentImage], "foto_argo")
                                                                                        setIsLoading(true)
                                                                                    }}>
                                                                                        <DeleteIcon />
                                                                                    </IconButton>,
                                                                                    <IconButton color="primary" onClick={(event) => {
                                                                                        setIsLoading(true)
                                                                                        downloadImage(customerSelected.foto_argo[currentImage], "foto_argo")
                                                                                    }}>
                                                                                        <GetAppIcon />
                                                                                    </IconButton>
                                                                                ]} />
                                                                        </div>
                                                                }
                                                            </div>
                                                        }
                                                    </Box>
                                                </Modal>
                                                <Modal
                                                    open={openBuildAutomation}
                                                    onClose={() => { setOpenBuildAutomation(false) }}
                                                    aria-labelledby="modal-modal-label"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        {
                                                            !(customerSelected.foto_argo && customerSelected.foto_buildAutomation.length !== 0) ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> : <div>
                                                                <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Foto buildAutomation</h2>
                                                                {
                                                                    customerSelected.foto_buildAutomation.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> :
                                                                        <div>
                                                                            <Gallery
                                                                                images={convertToGallery(customerSelected.foto_buildAutomation, "foto_buildAutomation")}
                                                                                currentImageWillChange={onCurrentImageChange}
                                                                                customControls={[
                                                                                    <IconButton color="error" onClick={(event) => {
                                                                                        deleteImage(customerSelected.foto_buildAutomation[currentImage], "foto_buildAutomation")
                                                                                        setIsLoading(true)
                                                                                    }}>
                                                                                        <DeleteIcon />
                                                                                    </IconButton>,
                                                                                    <IconButton color="primary" onClick={(event) => {
                                                                                        setIsLoading(true)
                                                                                        downloadImage(customerSelected.foto_buildAutomation[currentImage], "foto_buildAutomation")
                                                                                    }}>
                                                                                        <GetAppIcon />
                                                                                    </IconButton>
                                                                                ]} />
                                                                        </div>
                                                                }
                                                            </div>
                                                        }
                                                    </Box>
                                                </Modal>


                                                {/* Modal to edit field */}
                                                <Modal
                                                    open={openEditField}
                                                    onClose={() => { handleCloseEditField() }}
                                                    aria-labelledby="modal-modal-label"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                                        <TextField label={"Aggiorna il campo " + fieldToEdit.toUpperCase().replace("_", " ") + ":"} item xs={12} sm={12} multiline maxRows={20} defaultValue={customerSelected[fieldToEdit]} style={{ marginBottom: '2rem', marginLeft: 'auto', marginRight: 'auto', display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }} id="outlined-basic" variant="outlined" onChange={(event) => {
                                                            setValueToEdit(event.target.value)
                                                        }} />
                                                        <div item xs={12} sm={12} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                            <Button sx={{ color: 'white', backgroundColor: 'green', marginLeft: '1rem' }} onClick={() => {
                                                                editField()
                                                                setIsLoading(true)
                                                            }}>Conferma</Button>
                                                        </div>
                                                    </Box>
                                                </Modal>

                                                <Modal
                                                    open={openLoadPdf}
                                                    onClose={() => { handleCloseLoadPdf() }}
                                                    aria-labelledby="modal-modal-label"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        <Typography sx={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h2">
                                                            Carica file pdf {fieldToEdit.toUpperCase()}:
                                                        </Typography>
                                                        {/* <div> */}
                                                        <div style={{ marginRight: 'auto', marginLeft: 'auto', justifyContent: 'center', textAlign: 'center' }} >
                                                            <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <input multiple type="file" name="file" onChange={changeHandlerPDF} /></div>
                                                            <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <Button disabled={!isFilePDFPicked} onClick={(event) => {
                                                                    handleSubmissionPDF()
                                                                    setIsLoading(true)
                                                                }} variant="outlined" sx={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                            </div>
                                                            <h1>Uploaded {progress} %</h1>
                                                        </div>
                                                    </Box>
                                                </Modal>
                                                {/* Modal to edit status */}
                                                <Modal
                                                    open={openEditStatus}
                                                    onClose={() => { handleCloseEditStatus() }}
                                                    aria-labelledby="modal-modal-label"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        <Typography sx={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h2">
                                                            Aggiorna il campo {fieldToEdit.toUpperCase()}:
                                                        </Typography>
                                                        <Autocomplete
                                                            disablePortal
                                                            sx={{ width: 300, marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center', marginRight: 'auto', marginLeft: 'auto' }}
                                                            id="combo-box-demo"
                                                            options={possibleStatuses}
                                                            renderInput={(params) => <TextField {...params} label="stato" />}
                                                            onChange={(event, value) => {
                                                                if (value !== null) {
                                                                    setValueToEdit(value.label)
                                                                }
                                                            }}
                                                        />
                                                        {
                                                            (valueToEdit === "" || valueToEdit === null || valueToEdit === undefined) ? "" : <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                                <AiFillInfoCircle style={{ color: statusColors[valueToEdit.toLowerCase()], fontSize: 'xx-large' }} />
                                                            </div>
                                                        }
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                            <Button sx={{ color: 'white', backgroundColor: 'green' }} onClick={() => {
                                                                editStatus()
                                                                setIsLoading(true)
                                                            }}>Conferma</Button>
                                                        </div>
                                                    </Box>
                                                </Modal>

                                                {/* Delete all images */}
                                                <Modal
                                                    open={askDeleteAll}
                                                    onClose={() => { handleCloseAskDeleteAll() }}
                                                    aria-labelledby="modal-modal-label"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        <Typography sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h2">
                                                            <p>Inserisci <em>{typeToDeleteAll.replace("fine_", "")}</em> per confermare:</p>
                                                        </Typography>
                                                        <TextField sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }} id="filled-basic" label="Digita qui:" variant="filled" onChange={(event) => {
                                                            setCheckTypologyToDelete(event.target.value)
                                                        }} />
                                                        <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                            <Button disabled={checkTypologyToDelete !== typeToDeleteAll.replace("fine_", "")} sx={{ color: 'white', backgroundColor: 'green', marginLeft: '1rem' }} onClick={() => {
                                                                deleteAllImages()
                                                                setIsLoading(true)
                                                            }}>Conferma</Button>
                                                        </div>
                                                    </Box>
                                                </Modal>
                                            </div>
                                        }
                                    </div>
                                }

                            </div>
                    }
                </div>
            }

        </div >
    );
}

export default CustomerCardEndpoint;
