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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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

function CustomerCardEndpoint() {

    const [userIsAuthenticatedFlag, setUserIsAuthenticatedFlag] = React.useState(true)
    const [selectedFile, setSelectedFile] = React.useState();
    const [selectedFilePDF, setSelectedFilePDF] = React.useState();
    const [selectedSopralluogo, setSelectedSopralluogo] = React.useState([{}]);
    const [selectedInstallazione, setSelectedInstallazione] = React.useState([{}]);
    const [selectedAssistenza, setSelectedAssistenza] = React.useState([{}]);
    const [isFilePicked, setIsFilePicked] = React.useState(false);
    const [isFilePDFPicked, setIsFilePDFPicked] = React.useState(false);
    const [isSopralluogoPicked, setIsSopralluogoPicked] = React.useState(false);
    const [isInstallazionePicked, setIsInstallazionePicked] = React.useState(false);
    const [isAssistenzaPicked, setIsAssistenzaPicked] = React.useState(false);
    const [excel, setExcel] = React.useState({});
    const [showError, setShowError] = React.useState(false);
    const [confermaAdd, setConfermaAdd] = React.useState(false);
    const [customers, setCustomers] = React.useState([]);
    const [customerSelected, setCustomerSelected] = React.useState(null);
    const [confermaUpdate, setConfermaUpdate] = React.useState(false);
    const [customerSelectedId, setCustomerSelectedId] = React.useState(false);
    const [openSopralluogo, setOpenSopralluogo] = React.useState(false);
    const [openInstallazione, setOpenInstallazione] = React.useState(false);
    const [openAssistenza, setOpenAssistenza] = React.useState(false);
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
    const [imagesToShow, setImagesToShow] = React.useState([]);
    const [openNote, setOpenNote] = React.useState(false);
    const [askDeleteAll, setAskDeleteAll] = React.useState(false);
    const [typeToDeleteAll, setTypeToDeleteAll] = React.useState("");
    const [checkTypologyToDelete, setCheckTypologyToDelete] = React.useState("");
    const [noteType, setNoteType] = React.useState("");
    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);

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
        setCustomerSelected(location.state.customerSelected)
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

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };

    const handleChangeFotoSopralluogo = (event, value) => {
        setPageSopralluogo(value);
    };

    const handleChangeFotoInstallazione = (event, value) => {
        setPageInstallazione(value);
    };

    const handleChangeFotoAssistenza = (event, value) => {
        setPageAssistenza(value);
    };

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
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
                setIsLoading(false)
                setShowError(true)
            });
    }

    const handleCloseNote = () => {
        setNoteType("")
        setOpenNote(false);
    };

    const changeHandlerPDF = (event) => {
        setSelectedFilePDF(event.target.files[0]);
        setIsFilePDFPicked(true);
    };

    const changeHandlerPhotoSopralluogo = (event) => {
        setSelectedSopralluogo(event.target.files[0]);
        setIsSopralluogoPicked(true);
    };

    const getCustomers = () => {
        axiosInstance.get('customer', { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            .then(res => {
                // console.log("customers: ", res.data)
                setCustomers(res.data)
                setIsLoading(false)
            }).catch(error => {
                console.log(error)
                if (error.status === 401) {
                    console.log("errorrrrrrrrrrrr")
                }
                setIsLoading(false)
                setShowError(true)
            });
    }

    const handleCloseColorsUpdate = () => {
        setOpenColorsUpdate(false)
        getCustomers()
    };

    const handleCloseEditField = () => {
        setFieldToEdit("")
        setValueToEdit("")
        getCustomers()
        setOpenEditField(false)
    };

    const handleCloseLoadPdf = () => {
        setFieldToEdit("")
        setValueToEdit("")
        setSelectedFilePDF({})
        getCustomers()
        setOpenLoadPdf(false)
    };

    const handleCloseAskDeleteAll = () => {
        getCustomers()
        setTypeToDeleteAll("")
        setCheckTypologyToDelete("")
        setAskDeleteAll(false)
    }

    const handleCloseEditStatus = () => {
        setFieldToEdit("")
        setValueToEdit("")
        getCustomers()
        setOpenEditStatus(false)
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
            }).catch((error) => {
                setIsLoading(false)
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
            })
        }).catch((error) => {
            console.log("error")
            console.log(error)
            setIsLoading(false)
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
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
            })
        }).catch((error) => {
            console.log("error")
            console.log(error)
            setIsLoading(false)
        })
    }

    const handleSubmissionPDF = () => {
        if (!selectedFilePDF) return;
        const now = Date.now()
        const storageRef = ref(storage, '/files/' + customerSelected.nome_cognome + '/' + fieldToEdit + "_" + now)
        const uploadTask = uploadBytesResumable(storageRef, selectedFilePDF)
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
                        }).catch((error) => {
                            setIsLoading(false)
                            if (error.response.status === 401) {
                                userIsAuthenticated()
                            }
                        })
                    })
                })
            }
        )
    };

    const deletePdf = (pdf, pdfType) => {
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
                    }).catch((error) => {
                        setIsLoading(false)
                        if (error.response.status === 401) {
                            userIsAuthenticated()
                        }
                    })
                }).catch((error) => {
                    setIsLoading(false)
                    if (error.response.status === 401) {
                        userIsAuthenticated()
                    }
                })
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
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
                        setPageSopralluogo(1)
                        setPageInstallazione(1)
                        setPageAssistenza(1)
                    }).catch((error) => {
                        setIsLoading(false)
                        if (error.response.status === 401) {
                            userIsAuthenticated()
                        }
                    })
                }).catch((error) => {
                    if (error.response.status === 401) {
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
                    handleCloseAskDeleteAll()
                }).catch((error) => {
                    setIsLoading(false)
                    if (error.response.status === 401) {
                        userIsAuthenticated()
                    }
                    handleCloseAskDeleteAll()
                })
            }).catch((error) => {
                setIsLoading(false)
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
                handleCloseAskDeleteAll()
            })
        }
    }

    const assistCustomer = (flag) => {
        let newField = {}
        newField.isAssisted = flag
        axiosInstance.put("customer/" + customerSelected._id, newField, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((resp) => {
            axiosInstance.get("customer/" + customerSelected._id, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }).then((respp) => {
                setIsLoading(false)
                console.log("phs eliminate!")
                setCustomerSelected(respp.data)
            }).catch((error) => {
                setIsLoading(false)
                if (error.response.status === 401) {
                    userIsAuthenticated()
                }
            })
        }).catch((error) => {
            setIsLoading(false)
            console.log("error")
            console.log(error)
        })
    }

    // const getImages = (type) => {
    //     setIsLoading(true)
    //     axiosInstance.get('images', { params: { type: type, customer: customerSelected.nome_cognome } })
    //         .then(response => {
    //             // console.log("images: ", response)
    //             setImagesToShow(response.data[0].images)
    //             setIsLoading(false)
    //             setImagesId(response.data[0]._id)
    //         }).catch(error => {
    //             setIsLoading(false)
    //             setShowError(true)
    //         });
    // }

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
                                }).catch((error) => {
                                    setIsLoading(false)
                                    if (error.response.status === 401) {
                                        userIsAuthenticated()
                                    }
                                })
                            }).catch((error) => {
                                // console.log("error: ", error)
                                if (error.response.status === 401) {
                                    userIsAuthenticated()
                                }
                                setIsLoading(false)
                                setShowError(true)
                            });
                        })
                    }
                )
            }
        } else {
            setGenericError("Tipo file non riconosciuto.")
        }

    };

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
                                }).catch((error) => {
                                    setIsLoading(false)
                                    if (error.response.status === 401) {
                                        userIsAuthenticated()
                                    }
                                })
                            }).catch((error) => {
                                // console.log("error: ", error)
                                if (error.response.status === 401) {
                                    userIsAuthenticated()
                                }
                                setIsLoading(false)
                                setShowError(true)
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
                                }).catch((error) => {
                                    setIsLoading(false)
                                    if (error.response.status === 401) {
                                        userIsAuthenticated()
                                    }
                                })
                            }).catch((error) => {
                                // console.log("error: ", error)
                                if (error.response.status === 401) {
                                    userIsAuthenticated()
                                }
                                setIsLoading(false)
                                setShowError(true)
                            });
                        })
                    }
                )
            }
        } else {
            setGenericError("Tipo file non riconosciuto.")
        }
    };

    const downloadCustomers = () => { // csvData, fileName
        // var csvData = [{ name: 'name1', lastName: 'lastName1' }, { name: 'name2', lastName: 'lastName2' }]
        // var csvData = []
        // for (let c of customers) {
        //     var customerForCsv = {}
        //     customerForCsv.company = c.company
        //     customerForCsv.nome_cognome = c.nome
        //     customerForCsv.attrezzo = c.label
        //     customerForCsv.codice = c.code
        //     customerForCsv.quantita = c.quantity
        //     customerForCsv.quantita_minima = c.lowerBound
        //     csvData.push(customerForCsv)
        // }
        let fileName = "clienti"
        const ws = XLSX.utils.json_to_sheet(customers);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        saveAs(data, fileName + fileExtension);
    }

    const downloadImage = async (image, filename) => {
        let blob = await fetch(image).then((r) => r.blob());
        saveAs(blob, filename + ".jpg")
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
        //     clearTimeout(timer)
        // }, 5000);



        // zip.generateAsync({ type: "blob" }).then(content => {
        //     saveAs(content, customer.replaceAll(" ", "_") + "_" + typology + ".zip");
        // });


        // const folder = refFirestore + customer.replaceAll(" ", "%20") + "%2F" + typology
        // let blob = await fetch(folder).then((r) => r.blob());
        // saveAs(blob, customer.replaceAll(" ", "_") + "_" + typology + ".zip")
        // https://firebasestorage.googleapis.com/v0/b/magazzino-2a013.appspot.com/o/files%2Ftizio%20caio%2Fsopralluogo%2F1647786582758_arance.jpg?alt=media&token=f74260c5-b676-48c1-bfb4-148db33a1e73
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

                    setIsLoading(false)
                });
        }
    }

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    }

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    }

    const handleTouchEnd = (type) => {
        if (touchStart - touchEnd > 75) {
            if (type === "sopralluogo" && pageSopralluogo < customerSelected.foto_sopralluogo.length) {
                setPageSopralluogo(pageSopralluogo + 1)
            }
            if (type === "installazione" && pageInstallazione < customerSelected.foto_fine_installazione.length) {
                setPageInstallazione(pageInstallazione + 1)
            }
            if (type === "assistenza" && pageAssistenza < customerSelected.foto_fine_assistenza.length) {
                setPageAssistenza(pageAssistenza + 1)
            }
        }

        if (touchStart - touchEnd < -75) {
            if (type === "sopralluogo" && pageSopralluogo > 1) {
                setPageSopralluogo(pageSopralluogo - 1)
            }
            if (type === "installazione" && pageInstallazione > 1) {
                setPageInstallazione(pageInstallazione - 1)
            }
            if (type === "assistenza" && pageAssistenza > 1) {
                setPageAssistenza(pageAssistenza - 1)
            }
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
                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem' }}>
                                    <Typography variant="h4" component="div">
                                        {customerSelected.nome_cognome.toUpperCase()}
                                        {
                                            auths["customers"] !== "*" ? "" : <Tooltip sx={{ marginRight: '1rem' }} title={"Modifica"}><IconButton
                                                onClick={() => {
                                                    setFieldToEdit("nome_cognome")
                                                    setOpenEditStatus(true)
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
                                                <AiFillInfoCircle sx={{ color: statusColors[customerSelected.status.toLowerCase()], fontSize: 'xx-large' }} />
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

                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '100%', marginBottom: '3rem', marginTop: '3rem' }}>
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
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                        indirizzo
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                        {customerSelected.indirizzo} - {customerSelected.comune} - {customerSelected.provincia} - {customerSelected.cap}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                        telefono
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 18 }} variant="body2">
                                                        {customerSelected.telefono}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                        bonus
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                        {customerSelected.bonus} - {customerSelected.termico_elettrico}
                                                        {/* {
                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                        onClick={() => {
                                                            setFieldToEdit("bonus")
                                                            setOpenEditField(true)
                                                        }}>
                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                    </IconButton>
                                                } */}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
                                            <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black", marginRight: "1rem" }}>
                                                <CardContent>
                                                    <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                        <div>
                                                            Sopralluogo
                                                        </div>
                                                    </Typography>
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
                                                                customerSelected.pdf_sopralluogo.length === 0 || customerSelected.pdf_sopralluogo === "" || customerSelected.pdf_sopralluogo === null || customerSelected.pdf_sopralluogo === undefined ? "" :
                                                                    <Typography variant="h7" component="div">
                                                                        {
                                                                            customerSelected.pdf_sopralluogo.map(pf => {
                                                                                return <div>
                                                                                    <IconButton>
                                                                                        <a href={pf} target="_blank"><LinkIcon style={{ fontSize: "15px" }} /></a>
                                                                                    </IconButton>
                                                                                    <IconButton onClick={() => {
                                                                                        deletePdf(pf, "pdf_sopralluogo")
                                                                                        setIsLoading(true)
                                                                                    }}>
                                                                                        <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                    </IconButton>
                                                                                </div>
                                                                            })
                                                                        }
                                                                    </Typography>
                                                            }
                                                            {
                                                                auths["customers"] !== "*" ? "" : <IconButton
                                                                    onClick={() => {
                                                                        setFieldToEdit("pdf_sopralluogo")
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
                                                                <IconButton onClick={() => { downloadFolder(customerSelected.foto_sopralluogo, "sopralluogo") }}>
                                                                    <GetAppIcon />
                                                                </IconButton>
                                                                {
                                                                    auths["customers"] !== "*" ? "" :
                                                                        <IconButton onClick={() => {
                                                                            setAskDeleteAll(true)
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
                                                            <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                {customerSelected.note_sopralluogo}
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("note_sopralluogo")
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
                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
                                            <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black", marginRight: "1rem" }}>
                                                <CardContent>
                                                    <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                        <div>
                                                            Installazione
                                                            {/* <Tooltip sx={{ marginRight: '1rem' }} title={"note installazione"}>
                                                        <IconButton onClick={() => {
                                                            setNoteType("note_installazione")
                                                            setOpenNote(true)
                                                        }}>
                                                            <NotesIcon sx={{ fontSize: 'xx-large' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <Tooltip sx={{ marginRight: '1rem' }} title={"Modifica"}><IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("note_installazione")
                                                                setOpenEditField(true)
                                                            }}>
                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                        </IconButton></Tooltip>
                                                    } */}
                                                        </div>
                                                    </Typography>
                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" >
                                                        {/* <div> */}
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                computo
                                                            </Typography>
                                                            <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                {customerSelected.computo}
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("computo")
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
                                                                                return <div>
                                                                                    <IconButton>
                                                                                        <a href={pf} target="_blank"><LinkIcon style={{ fontSize: "15px" }} /></a>
                                                                                    </IconButton>
                                                                                    <IconButton onClick={() => {
                                                                                        deletePdf(pf, "pdf_computo")
                                                                                        setIsLoading(true)
                                                                                    }}>
                                                                                        <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                    </IconButton>
                                                                                </div>
                                                                            })
                                                                        }
                                                                    </Typography>
                                                            }
                                                            {
                                                                auths["customers"] !== "*" ? "" : <IconButton
                                                                    onClick={() => {
                                                                        setFieldToEdit("pdf_computo")
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
                                                                <IconButton onClick={() => { downloadFolder(customerSelected.foto_fine_installazione, "fine_installazione") }}>
                                                                    <GetAppIcon />
                                                                </IconButton>
                                                                {
                                                                    auths["customers"] !== "*" ? "" :
                                                                        <IconButton onClick={() => {
                                                                            setAskDeleteAll(true)
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
                                                            <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                {customerSelected.note_installazione}
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("note_installazione")
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
                                        {
                                            auths["customers"] !== "*" ? "" : <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
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
                                                                                    return <div>
                                                                                        <IconButton>
                                                                                            <a href={pf} target="_blank"><LinkIcon style={{ fontSize: "15px" }} /></a>
                                                                                        </IconButton>
                                                                                        <IconButton onClick={() => {
                                                                                            deletePdf(pf, "pagamenti_pdf")
                                                                                            setIsLoading(true)
                                                                                        }}>
                                                                                            <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                        </IconButton>
                                                                                    </div>
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("pagamenti_pdf")
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
                                                                                    return <div>
                                                                                        <IconButton>
                                                                                            <a href={pf} target="_blank"><LinkIcon style={{ fontSize: "15px" }} /></a>
                                                                                        </IconButton>
                                                                                        <IconButton onClick={() => {
                                                                                            deletePdf(pf, "collaudo")
                                                                                            setIsLoading(true)
                                                                                        }}>
                                                                                            <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                        </IconButton>
                                                                                    </div>
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("collaudo")
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
                                                                                    return <div>
                                                                                        <IconButton>
                                                                                            <a href={pf} target="_blank"><LinkIcon style={{ fontSize: "15px" }} /></a>
                                                                                        </IconButton>
                                                                                        <IconButton onClick={() => {
                                                                                            deletePdf(pf, "check_list")
                                                                                            setIsLoading(true)
                                                                                        }}>
                                                                                            <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                        </IconButton>
                                                                                    </div>
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("check_list")
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
                                                                                    return <div>
                                                                                        <IconButton>
                                                                                            <a href={pf} target="_blank"><LinkIcon style={{ fontSize: "15px" }} /></a>
                                                                                        </IconButton>
                                                                                        <IconButton onClick={() => {
                                                                                            deletePdf(pf, "fgas")
                                                                                            setIsLoading(true)
                                                                                        }}>
                                                                                            <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                        </IconButton>
                                                                                    </div>
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("fgas")
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
                                                                                    return <div>
                                                                                        <IconButton>
                                                                                            <a href={pf} target="_blank"><LinkIcon style={{ fontSize: "15px" }} /></a>
                                                                                        </IconButton>
                                                                                        <IconButton onClick={() => {
                                                                                            deletePdf(pf, "prova_fumi")
                                                                                            setIsLoading(true)
                                                                                        }}>
                                                                                            <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                        </IconButton>
                                                                                    </div>
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("prova_fumi")
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
                                                                                    return <div>
                                                                                        <IconButton>
                                                                                            <a href={pf} target="_blank"><LinkIcon style={{ fontSize: "15px" }} /></a>
                                                                                        </IconButton>
                                                                                        <IconButton onClick={() => {
                                                                                            deletePdf(pf, "di_co")
                                                                                            setIsLoading(true)
                                                                                        }}>
                                                                                            <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                        </IconButton>
                                                                                    </div>
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("di_co")
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
                                                                <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.note_pagamenti}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("note_pagamenti")
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
                                                    assistCustomer(true)
                                                }}>
                                                    <AddCircleIcon />
                                                </IconButton>
                                                <Typography sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                    aggiungi assistenza
                                                </Typography></div> : <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
                                                <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black", marginRight: "1rem" }} style={{ marginBottom: '3rem' }}>
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                            <div>
                                                                Assistenza
                                                                {/* <Tooltip sx={{ marginRight: '1rem' }} title={"note assistenza"}>
                                                            <IconButton onClick={() => {
                                                                setNoteType("note_assistenza")
                                                                setOpenNote(true)
                                                            }}>
                                                                <NotesIcon sx={{ fontSize: 'xx-large' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {
                                                            auths["customers"] !== "*" ? "" : <Tooltip sx={{ marginRight: '1rem' }} title={"Modifica"}><IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("note_assistenza")
                                                                    setOpenEditField(true)
                                                                }}>
                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                            </IconButton></Tooltip>
                                                        } */}
                                                            </div>
                                                        </Typography>
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
                                                                                    return <div>
                                                                                        <IconButton>
                                                                                            <a href={pf} target="_blank"><LinkIcon style={{ fontSize: "15px" }} /></a>
                                                                                        </IconButton>
                                                                                        <IconButton onClick={() => {
                                                                                            deletePdf(pf, "assistenza")
                                                                                            setIsLoading(true)
                                                                                        }}>
                                                                                            <DeleteIcon style={{ fontSize: "15px" }} />
                                                                                        </IconButton>
                                                                                    </div>
                                                                                })
                                                                            }
                                                                        </Typography>
                                                                }
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("assistenza")
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
                                                                    <IconButton onClick={() => { downloadFolder(customerSelected.foto_assistenza, "assistenza") }}>
                                                                        <GetAppIcon />
                                                                    </IconButton>
                                                                    {
                                                                        auths["customers"] !== "*" ? "" :
                                                                            <IconButton onClick={() => {
                                                                                setAskDeleteAll(true)
                                                                                setTypeToDeleteAll("assistenza")
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
                                                                                setSelectedAssistenza(event)
                                                                                setIsAssistenzaPicked(true)
                                                                            }}
                                                                        /> */}
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
                                                                <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                    {customerSelected.assistenza}
                                                                    {
                                                                        auths["customers"] !== "*" ? "" : <IconButton
                                                                            onClick={() => {
                                                                                setFieldToEdit("assistenza")
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
                                    </div>
                                }

                            </div>
                    }
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
                                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                                                    <IconButton item xs={12} sm={6} onClick={() => {
                                                        if (pageSopralluogo > 1) {
                                                            setPageSopralluogo(pageSopralluogo - 1)
                                                        }
                                                    }}>
                                                        <ArrowBackIosIcon />
                                                    </IconButton>
                                                    <IconButton item xs={12} sm={6} onClick={() => {
                                                        if (pageSopralluogo < customerSelected.foto_sopralluogo.length) {
                                                            setPageSopralluogo(pageSopralluogo + 1)
                                                        }
                                                    }}>
                                                        <ArrowForwardIosIcon />
                                                    </IconButton>
                                                </Grid>
                                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                                                    <img
                                                        onTouchStart={(e) => { handleTouchStart(e) }}
                                                        onTouchMove={(e) => { handleTouchMove(e) }}
                                                        onTouchEnd={() => handleTouchEnd("sopralluogo")}
                                                        item xs={12} sm={6}
                                                        style={{ maxHeight: '600px', maxWidth: window.innerWidth, marginRight: 'auto', marginLeft: 'auto' }}
                                                        src={customerSelected.foto_sopralluogo[pageSopralluogo - 1]} ù
                                                        alt="Logo" />
                                                </Grid>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                                    <IconButton onClick={() => {
                                                        deleteImage(customerSelected.foto_sopralluogo[pageSopralluogo - 1], "foto_sopralluogo")
                                                        setIsLoading(true)
                                                    }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => { downloadImage(customerSelected.foto_sopralluogo[pageSopralluogo - 1], customerSelected.nome_cognome.replace(" ", "_") + "_sopralluogo_" + customerSelected.createdAt.slice(0, 10).replace("-", "_").replace("-", "_")) }}>
                                                        <GetAppIcon />
                                                    </IconButton>
                                                </div>
                                                {/* <Pagination style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }} count={customerSelected.foto_sopralluogo.length} shape="rounded" page={pageSopralluogo} onChange={handleChangeFotoSopralluogo} /> */}
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
                                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                                                    <IconButton item xs={12} sm={6} onClick={() => {
                                                        if (pageInstallazione > 1) {
                                                            setPageInstallazione(pageInstallazione - 1)
                                                        }
                                                    }}>
                                                        <ArrowBackIosIcon />
                                                    </IconButton>
                                                    <IconButton item xs={12} sm={6} onClick={() => {
                                                        if (pageInstallazione < customerSelected.foto_fine_installazione.length) {
                                                            setPageInstallazione(pageInstallazione + 1)
                                                        }
                                                    }}>
                                                        <ArrowForwardIosIcon />
                                                    </IconButton>
                                                </Grid>
                                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                                                    <img
                                                        onTouchStart={(e) => { handleTouchStart(e) }}
                                                        onTouchMove={(e) => { handleTouchMove(e) }}
                                                        onTouchEnd={() => handleTouchEnd("installazione")}
                                                        style={{ maxHeight: '600px', maxWidth: window.innerWidth, marginRight: 'auto', marginLeft: 'auto' }}
                                                        src={customerSelected.foto_fine_installazione[pageInstallazione - 1]}
                                                        alt="Logo" />
                                                </Grid>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                                    <IconButton onClick={() => {
                                                        deleteImage(customerSelected.foto_fine_installazione[pageInstallazione - 1], "foto_fine_installazione")
                                                        setIsLoading(true)
                                                    }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => { downloadImage(customerSelected.foto_fine_installazione[pageInstallazione - 1], customerSelected.nome_cognome.replace(" ", "_") + "_fine_installazione_" + customerSelected.createdAt.slice(0, 10).replace("-", "_").replace("-", "_")) }}>
                                                        <GetAppIcon />
                                                    </IconButton>
                                                </div>
                                                {/* <Pagination style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }} count={customerSelected.foto_fine_installazione.length} shape="rounded" page={pageInstallazione} onChange={handleChangeFotoInstallazione} /> */}
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
                                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                                                    <IconButton item xs={12} sm={6} onClick={() => {
                                                        if (pageAssistenza > 1) {
                                                            setPageAssistenza(pageAssistenza - 1)
                                                        }
                                                    }}>
                                                        <ArrowBackIosIcon />
                                                    </IconButton>
                                                    <IconButton item xs={12} sm={6} onClick={() => {
                                                        if (pageAssistenza < customerSelected.foto_assistenza.length) {
                                                            setPageAssistenza(pageAssistenza + 1)
                                                        }
                                                    }}>
                                                        <ArrowForwardIosIcon />
                                                    </IconButton>
                                                </Grid>
                                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                                                    <img
                                                        onTouchStart={(e) => { handleTouchStart(e) }}
                                                        onTouchMove={(e) => { handleTouchMove(e) }}
                                                        onTouchEnd={() => handleTouchEnd("assistenza")}
                                                        style={{ maxHeight: '600px', maxWidth: window.innerWidth, marginRight: 'auto', marginLeft: 'auto' }}
                                                        src={customerSelected.foto_assistenza[pageAssistenza - 1]}
                                                        alt="Logo" />
                                                </Grid>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                                    <IconButton onClick={() => {
                                                        deleteImage(customerSelected.foto_assistenza[pageAssistenza - 1], "foto_assistenza")
                                                        setIsLoading(true)
                                                    }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => { downloadImage(customerSelected.foto_assistenza[pageAssistenza - 1], customerSelected.nome_cognome.replace(" ", "_") + "_assistenza_" + customerSelected.createdAt.slice(0, 10).replace("-", "_").replace("-", "_")) }}>
                                                        <GetAppIcon />
                                                    </IconButton>
                                                </div>
                                                {/* <Pagination style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }} count={customerSelected.foto_assistenza.length} shape="rounded" page={pageAssistenza} onChange={handleChangeFotoAssistenza} /> */}
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
                            {/* <Typography item xs={12} sm={12} sx={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h2">
                                Aggiorna il campo {fieldToEdit.toUpperCase().replace("_", " ")}:
                            </Typography> */}
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
                                    <input type="file" name="file" onChange={changeHandlerPDF} /></div>
                                <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                    {isFilePDFPicked ?
                                        <div>
                                            <p>Nome file: {selectedFilePDF.name}</p>
                                            <p>Tipo di file: {selectedFilePDF.type}</p>
                                            <p>Dimensione in bytes: {selectedFilePDF.size}</p>
                                        </div>
                                        :
                                        <p>Seleziona un file per vederne le specifiche</p>
                                    }
                                </div>
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
                                (valueToEdit === "" || valueToEdit === null || valueToEdit === undefined) ? "" : <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                    <AiFillInfoCircle sx={{ color: statusColors[valueToEdit.toLowerCase()], fontSize: 'xx-large' }} />
                                </div>
                            }
                            <div sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
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
        </div >
    );
}

export default CustomerCardEndpoint;
