// import axios from "axios";
import { axiosInstance, refFirestore } from "../config.js"
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
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
import BrushIcon from '@material-ui/icons/Brush';
import EditIcon from '@material-ui/icons/Edit';
import ApartmentIcon from '@material-ui/icons/Apartment';
import DescriptionIcon from '@material-ui/icons/Description';
import SettingsIcon from '@material-ui/icons/Settings';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import NotesIcon from '@material-ui/icons/Notes';
import GetAppIcon from '@material-ui/icons/GetApp';
import LinkIcon from '@material-ui/icons/Link';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { AiFillInfoCircle } from "react-icons/ai";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import SimpleImageSlider from "react-simple-image-slider";
import FileBase64 from 'react-file-base64';
import { DataGrid } from '@mui/x-data-grid';
import { SketchPicker } from 'react-color';
import { saveAs } from 'file-saver'
import { storage } from "../firebase";
// import { firebase } from "firebase/compat/app";
import './Classes.css'
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable, getStorage, deleteObject, uploadString } from "firebase/storage";
import { makeStyles } from '@mui/styles';
import { allCustomers } from "../allCustomers"

function Customers(props) {

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
    const [openAccordion, setOpenAccordion] = React.useState(false);
    const [openAccordionManual, setOpenAccordionManual] = React.useState(false);
    const [openAccordionScheda, setOpenAccordionScheda] = React.useState(false);
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
    const [company, setCompany] = React.useState("");
    const [nome_cognome, setNome_cognome] = React.useState("");
    const [telefono, setTelefono] = React.useState("");
    const [indirizzo, setIndirizzo] = React.useState("");
    const [comune, setComune] = React.useState("");
    const [provincia, setProvincia] = React.useState("");
    const [bonus, setBonus] = React.useState("");
    const [termico_elettrico, setTermico_elettrico] = React.useState("");
    const [computo, setComputo] = React.useState("");
    const [data_sopralluogo, setData_sopralluogo] = React.useState("");
    const [data_installazione, setData_installazione] = React.useState("");
    const [installatore, setInstallatore] = React.useState("");
    const [trasferta, setTrasferta] = React.useState("");
    const [collaudo, setCollaudo] = React.useState("");
    const [assistenza, setAssistenza] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [note, setNote] = React.useState("");
    const [genericError, setGenericError] = React.useState("");
    const [pagamenti_testo, setPagamenti_testo] = React.useState("");
    const [auths, setAuths] = React.useState([])
    const [openColorsUpdate, setOpenColorsUpdate] = React.useState(false);
    const [statusToAdd, setStatusToAdd] = React.useState("");
    const [colorToAdd, setColorToAdd] = React.useState("");
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
    const [imagesId, setImagesId] = React.useState(null);
    const [url, setUrl] = React.useState("");
    const [openNote, setOpenNote] = React.useState(false);

    const columns = [
        { field: 'nome_cognome', headerName: 'nome e cognome', flex: 1 },
        { field: 'status', headerName: 'stato', flex: 1 }
    ]

    var JSZip = require("jszip");

    const imageTypes = ["image/png", "image/jpeg"]

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
    };

    React.useEffect(() => {
        userIsAuthenticated()
        getCustomers()
        getStatusColors()
        // console.log(allCustomers)
        // for (let cust of allCustomers) {
        //     console.log(.nome_cognome)
        // var customer = {}
        // var phsss = []
        // customer.foto_fine_installazione = []
        // console.log(allCustomers[7].foto_fine_installazione)
        // for (let sop of allCustomers[7].foto_fine_installazione) {
        //     const now = Date.now()
        //     const storageRef = ref(storage, '/files/' + allCustomers[7].nome_cognome + '/fine_installazione/' + now + "_")
        //     uploadString(storageRef, sop, 'data_url').then((snapshot) => {
        //         getDownloadURL(snapshot.ref).then((fileUrl) => {
        //             console.log("fileUrl: ", fileUrl)
        //             phsss.push(fileUrl)
        //             // console.log("phssss: ", phsss)
        //             customer.foto_fine_installazione.push(fileUrl)
        //             if (customer.foto_fine_installazione.length === allCustomers[7].foto_fine_installazione.length) {
        //                 // console.log("customer: ", customer)
        //                 axiosInstance.put("customer/" + allCustomers[7]._id, customer).then((resp) => {
        //                     // axiosInstance.put("customer/" + allCustomers[0]._id, customer).then((respp) => {
        //                     console.log("done!")
        //                     console.log(resp)
        //                     // }).catch((error) => {
        //                     //     // console.log("error: ", error)
        //                     //     setIsLoading(false)
        //                     //     setShowError(true)
        //                     // });
        //                     setIsLoading(false)
        //                 }).catch((error) => {
        //                     // console.log("error: ", error)
        //                     setIsLoading(false)
        //                     setShowError(true)
        //                 });
        //             }
        //             // console.log("customer: ", customer)
        //             // axiosInstance.put("customer/" + allCustomers[0]._id, customer).then((resp) => {
        //             //     console.log("done!")
        //             //     console.log(allCustomers[0].nome_cognome)
        //             // }).catch((error) => {
        //             //     // console.log("error: ", error)
        //             //     setIsLoading(false)
        //             //     setShowError(true)
        //             // });
        //         })
        //     })
        // }
        // }
        // let s = allCustomers[0].foto_sopralluogo[0]
        // const now = Date.now()
        // const storageRef = ref(storage, '/files/prova/ciao.jpg')
        // uploadString(storageRef, s, 'data_url').then((snapshot) => {
        //     console.log("done!")
        //     getDownloadURL(snapshot.ref).then((fileUrl) => {
        //         console.log("fileUrl: ", fileUrl)
        //     })
        // })
        // const uploadTask = uploadString(storageRef, s, 'data_url')
        // uploadTask.on("state_changed", (snapshot) => {
        //     const progr = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        //     setProgress(progr)
        // }, (error) => console.log("error: ", error),
        //     () => {
        //         //when the file is uploaded we want to download it. uploadTask.snapshot.ref is the reference to the pdf
        //         getDownloadURL(uploadTask.snapshot.ref).then((fileUrl) => {
        //             console.log("fileUrl: ", fileUrl)
        //         })
        //     }
        // )
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
        axiosInstance.get('colorsStatus')
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
            })
    }

    const handleCloseNote = () => {
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
        axiosInstance.get('customer')
            .then(res => {
                // console.log("customers: ", res.data)
                setCustomers(res.data)
                setIsLoading(false)
            }).catch(error => {
                // console.log("error")
                setIsLoading(false)
                setShowError(true)
            });
    }

    let addCustomer = () => {
        setIsLoading(true)
        axiosInstance.post('customer', { company: company, nome_cognome: nome_cognome, telefono: telefono, indirizzo: indirizzo, comune: comune, provincia: provincia, bonus: bonus, termico_elettrico: termico_elettrico, computo: computo, data_sopralluogo: data_sopralluogo, data_installazione: data_installazione, installatore: installatore, trasferta: trasferta, assistenza: assistenza, note: note, pagamenti_testo: pagamenti_testo, status: status })
            .then(response => {
                setConfermaAdd(true)
                getCustomers()
            }).catch(error => {
                // console.log("error")
                setIsLoading(false)
                setShowError(true)
            });
    }

    let addStatusColor = () => {
        axiosInstance.post('colorsStatus', { label: statusToAdd, color: colorToAdd }).then(response => {
            handleCloseColorsUpdate()
            getStatusColors()
        }).catch(error => {
            // console.log("error")
            setShowError(true)
        });
    }

    const handleSubmission = (e) => {
        ExcelRenderer(selectedFile, (err, resp) => {
            if (err) {
                console.log(err);
                setShowError(true)
            }
            else {
                axiosInstance.post('newCustomerFile', {
                    cols: resp.cols,
                    rows: resp.rows
                }).then((response) => {
                    console.log("File uploaded!")
                    setConfermaAdd(true)
                    getCustomers()
                }).catch((e) => {
                    console.log("Error while uploading file: ", e)
                    setShowError(true)
                })
            }
        });
    };

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

    const handleCloseEditStatus = () => {
        setFieldToEdit("")
        setValueToEdit("")
        getCustomers()
        setOpenEditStatus(false)
    };

    const editField = () => {
        var newField = {}
        newField[fieldToEdit] = valueToEdit
        axiosInstance.put("customer/" + customerSelected._id, newField).then((response) => {
            axiosInstance.put("customer/" + customerSelected._id, newField).then((resp) => {
                console.log("aggiornato!")
                setIsLoading(false)
                setCustomerSelected(resp.data)
                handleCloseEditField()
            }).catch((error) => {
                setIsLoading(false)
                console.log("error")
                console.log(error)
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
        axiosInstance.put("customer/" + customerSelected._id, newField).then((response) => {
            axiosInstance.put("customer/" + customerSelected._id, newField).then((resp) => {
                console.log("aggiornato!")
                setIsLoading(false)
                setCustomerSelected(resp.data)
                handleCloseEditStatus()
            }).catch((error) => {
                setIsLoading(false)
                console.log("error")
                console.log(error)
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
                    axiosInstance.put("customer/" + customerSelected._id, newField).then((resp) => {
                        axiosInstance.put("customer/" + customerSelected._id, newField).then((respp) => {
                            setIsLoading(false)
                            console.log("customer updated")
                            setCustomerSelected(respp.data)
                            handleCloseLoadPdf()
                        }).catch((error) => {
                            setIsLoading(false)
                            console.log("error")
                            console.log(error)
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
                axiosInstance.put("customer/" + customerSelected._id, newField).then((resp) => {
                    axiosInstance.get("customer/" + customerSelected._id).then((respp) => {
                        setIsLoading(false)
                        console.log("pdf eliminato!")
                        setCustomerSelected(respp.data)
                    }).catch((error) => {
                        setIsLoading(false)
                        console.log("error")
                        console.log(error)
                    })
                }).catch((error) => {
                    setIsLoading(false)
                    console.log("error")
                    console.log(error)
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
                axiosInstance.put("customer/" + customerSelected._id, newField).then((resp) => {
                    axiosInstance.put("customer/" + customerSelected._id, newField).then((respp) => {
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
                        console.log("error")
                        console.log(error)
                    })
                }).catch((error) => {
                    console.log("error")
                    console.log(error)
                    setIsLoading(false)
                })
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
            });
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
                            axiosInstance.put("customer/" + customerSelected._id, customer).then((resp) => {
                                setConfermaUpdate(true)
                                getCustomers()
                                axiosInstance.put("customer/" + customerSelected._id, customer).then((respp) => {
                                    setIsLoading(false)
                                    console.log("customer updated")
                                    setCustomerSelected(respp.data)
                                }).catch((error) => {
                                    setIsLoading(false)
                                    console.log("error")
                                    console.log(error)
                                })
                            }).catch((error) => {
                                // console.log("error: ", error)
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





        // for (let s of selectedSopralluogo) {
        //     // customer.foto_sopralluogo.push(s.base64)
        //     imgs.images.push(s.base64)

        //     const now = Date.now()
        //     const storageRef = ref(storage, '/files/' + customerSelected.nome_cognome + '/sopralluogo/' + now + "_" + s.name)
        //     // storageRef.put(s).on('state_changed', (snap) => {
        //     //     let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        //     //     setProgress(percentage);
        //     // }, (err) => {
        //     //     setShowError(true)
        //     // }, async () => {
        //     //     const urll = await storageRef.getDownloadURL();
        //     //     setUrl(urll);
        //     // });
        //     const uploadTask = uploadBytesResumable(storageRef, s)
        //     uploadTask.on("state_changed", (snapshot) => {
        //         const progr = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        //         setProgress(progr)
        //         setIsLoading(false)
        //     }, (error) => console.log("error: ", error),
        //         () => {
        //             //when the file is uploaded we want to download it. uploadTask.snapshot.ref is the reference to the pdf
        //             getDownloadURL(uploadTask.snapshot.ref).then((fileUrl) => {
        //                 console.log("fileUrl: ", fileUrl)
        //                 // const image = new Image();
        //                 // image.onload = () => {
        //                 //     setSrc(fileUrl)
        //                 // };
        //                 // image.src = fileUrl;
        //                 // console.log("image", image)
        //                 // customer.foto_sopralluogo.push(image)
        //                 customer.foto_sopralluogo.push(fileUrl)
        //                 // var newField = {}
        //                 // newField[fieldToEdit] = customerSelected[fieldToEdit]
        //                 // if (newField[fieldToEdit] === undefined) {
        //                 //     newField[fieldToEdit] = [fileUrl]
        //                 // } else {
        //                 //     newField[fieldToEdit].push(fileUrl)
        //                 // }
        //                 // axiosInstance.put("customer/" + customerSelected._id, customer).then((resp) => {
        //                 //     setConfermaUpdate(true)
        //                 //     getCustomers()
        //                 //     axiosInstance.put("customer/" + customerSelected._id, customer).then((respp) => {
        //                 //         setIsLoading(false)
        //                 //         console.log("customer updated")
        //                 //         setCustomerSelected(respp.data)
        //                 //     }).catch((error) => {
        //                 //         setIsLoading(false)
        //                 //         console.log("error")
        //                 //         console.log(error)
        //                 //     })
        //                 // }).catch((error) => {
        //                 //     // console.log("error: ", error)
        //                 //     setIsLoading(false)
        //                 //     setShowError(true)
        //                 // });
        //             })
        //         }
        //     )
        // }
        // axiosInstance.put("images/" + imagesId, imgs).then(response => {
        //     // console.log("Fatto!", response)
        //     setConfermaUpdate(true)
        //     getImages("sopralluogo")
        //     setIsLoading(false)
        // }).catch((error) => {
        //     // console.log("error: ", error)
        //     setIsLoading(false)
        //     setShowError(true)
        // });

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
                            axiosInstance.put("customer/" + customerSelected._id, customer).then((resp) => {
                                setConfermaUpdate(true)
                                getCustomers()
                                axiosInstance.put("customer/" + customerSelected._id, customer).then((respp) => {
                                    setIsLoading(false)
                                    console.log("customer updated")
                                    setCustomerSelected(respp.data)
                                }).catch((error) => {
                                    setIsLoading(false)
                                    console.log("error")
                                    console.log(error)
                                })
                            }).catch((error) => {
                                // console.log("error: ", error)
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
                            axiosInstance.put("customer/" + customerSelected._id, customer).then((resp) => {
                                setConfermaUpdate(true)
                                getCustomers()
                                axiosInstance.put("customer/" + customerSelected._id, customer).then((respp) => {
                                    setIsLoading(false)
                                    console.log("customer updated")
                                    setCustomerSelected(respp.data)
                                }).catch((error) => {
                                    setIsLoading(false)
                                    console.log("error")
                                    console.log(error)
                                })
                            }).catch((error) => {
                                // console.log("error: ", error)
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
                    // saveAs(content, customerSelected.nome_cognome.replaceAll(" ", "_") + "_" + typology + ".zip");
                    var link = document.createElement("a")
                    link.href = window.URL.createObjectURL(content)
                    link.download = customerSelected.nome_cognome.replaceAll(" ", "_") + "_" + typology + ".zip"
                    link.click()
                    setIsLoading(false)
                });
        }
    }

    const handleChangeAccordion = () => {
        setOpenAccordion((prev) => !prev)
    }

    const handleChangeAccordionManual = () => {
        setOpenAccordionManual((prev) => !prev)
    }

    const handleChangeAccordionScheda = () => {
        setOpenAccordionScheda((prev) => !prev)
    }

    const handleChangeComplete = (event) => {
        setColorToAdd(event.hex)
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
                !userIsAuthenticatedFlag ? <div>
                    <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10rem' }} severity="error"><h1>UTENTE NON AUTORIZZATO!</h1></Alert>
                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}><Button variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginTop: '8rem' }}><Link style={{ color: 'white' }} to={"/login"}>Vai al Login</Link></Button></div>
                </div> :
                    <div>
                        {
                            isLoading ? <Backdrop className={classes.backdrop} open>
                                <CircularProgress color="inherit" />
                            </Backdrop> :
                                <div>
                                    <div style={{ zIndex: '-1', width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                            <h1 style={{ fontFamily: 'times', marginLeft: '1rem', marginRight: 'auto' }}>Gestione clienti</h1>
                                            {
                                                auths["customers"] !== "*" ? "" : <Tooltip style={{ marginRight: '1rem' }} title="Aggiungi un nuovo stato">
                                                    <IconButton onClick={() => { setOpenColorsUpdate(true) }}>
                                                        <BrushIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                        </div>
                                        {
                                            auths["customers"] === "installer" ? "" : <div>
                                                <Accordion
                                                    expanded={openAccordion || false}
                                                    onChange={handleChangeAccordion}
                                                    style={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1bh-content"
                                                    >
                                                        <Typography variant="h4" sx={{ width: "50%", flexShrink: 0 }}>
                                                            Carica file Excel
                                                        </Typography>
                                                        {/* <Typography sx={{ color: "text.secondary" }}>
                                                I am an accordion
                                            </Typography> */}
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {/* <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '60%', marginTop: '1rem', marginBottom: '1rem' }}>
                                                <Alert severity="warning">Il caricamento di un nuovo file sovrascriverà il precedente!</Alert>
                                            </div> */}
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <input type="file" name="file" onChange={changeHandler} /></div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                {isFilePicked ?
                                                                    <div>
                                                                        <p>Nome file: {selectedFile.name}</p>
                                                                        <p>Tipo di file: {selectedFile.type}</p>
                                                                        <p>Dimensione in bytes: {selectedFile.size}</p>
                                                                        <p>
                                                                            Ultima modifica:{' '}
                                                                            {selectedFile.lastModifiedDate.toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    :
                                                                    <p>Seleziona un file per vederne le specifiche</p>
                                                                }
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <Button disabled={!isFilePicked} onClick={(event) => handleSubmission(event)} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                                {/* onClick={handleSubmission} */}
                                                            </div>
                                                        </div>
                                                    </AccordionDetails>
                                                </Accordion>
                                                <img src={url} />
                                                <Accordion
                                                    expanded={openAccordionManual || false}
                                                    onChange={handleChangeAccordionManual}
                                                    style={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1bh-content"
                                                    >
                                                        <Typography variant="h4" sx={{ width: "50%", flexShrink: 0 }}>
                                                            Carica singolo cliente
                                                        </Typography>
                                                        {/* <Typography sx={{ color: "text.secondary" }}>
                                                I am an accordion
                                            </Typography> */}
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '90%', marginTop: '1rem', marginBottom: '1rem' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '100%' }}>
                                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="company" onChange={(event) => { setCompany(event.target.value) }} />
                                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="nome e cognome" onChange={(event) => { setNome_cognome(event.target.value.toLowerCase()) }} />
                                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="telefono" onChange={(event) => { setTelefono(parseInt(event.target.value)) }} />
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="indirizzo" onChange={(event) => { setIndirizzo(event.target.value) }} />
                                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="comune" onChange={(event) => { setComune(event.target.value) }} />
                                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="provincia" onChange={(event) => { setProvincia(event.target.value) }} />
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="bonus" onChange={(event) => { setBonus(event.target.value.toLowerCase()) }} />
                                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="termico/elettrico" onChange={(event) => { setTermico_elettrico(event.target.value) }} />
                                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="computo" onChange={(event) => { setComputo(event.target.value) }} />
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="data sopralluogo" onChange={(event) => { setData_sopralluogo(event.target.value) }} />
                                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="data installazione" onChange={(event) => { setData_installazione(event.target.value) }} />
                                                                <input style={{ margin: '1rem', width: '33%' }} placeholder="installatore" onChange={(event) => { setInstallatore(event.target.value) }} />
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                <input style={{ margin: '1rem', width: '50%' }} placeholder="trasferta" onChange={(event) => { setTrasferta(event.target.value) }} />
                                                                <input style={{ margin: '1rem', width: '50%' }} placeholder="assistenza" onChange={(event) => { setAssistenza(event.target.value) }} />
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                                {/* <input style={{ margin: '1rem', width: '50%' }} placeholder="stato" onChange={(event) => { setStatus(event.target.value.toLowerCase()) }} /> */}
                                                                <Autocomplete
                                                                    disablePortal
                                                                    id="combo-box-demo"
                                                                    options={possibleStatuses}
                                                                    sx={{ width: 300 }}
                                                                    renderInput={(params) => <TextField {...params} label="stato" />}
                                                                    onChange={(event, value) => { setStatus(value.label) }}
                                                                />
                                                                <input style={{ margin: '1rem', width: '50%' }} placeholder="note" onChange={(event) => { setNote(event.target.value.toLowerCase()) }} />
                                                                <input style={{ margin: '1rem', width: '50%' }} placeholder="pagamenti (testo)" onChange={(event) => { setPagamenti_testo(event.target.value) }} />
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
                                                                <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }} onClick={addCustomer}>Conferma</Button>
                                                            </div>
                                                        </div>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </div>
                                        }
                                        {
                                            (!confermaAdd) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">File aggiunto correttamente!</Alert>
                                        }
                                        {
                                            (showError === false) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Upload fallito. Controlla connessione e formato dei dati.</Alert>
                                        }
                                        {
                                            (genericError === "") ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">{genericError}</Alert>
                                        }
                                        <Accordion
                                            expanded={openAccordionScheda || false}
                                            onChange={handleChangeAccordionScheda}
                                            style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: '2rem' }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1bh-content"
                                            >
                                                <Typography variant="h4" sx={{ width: "33%", flexShrink: 0 }}>
                                                    Scheda cliente
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <div style={{ width: '100%', marginTop: '1rem', marginBottom: '1rem' }}>
                                                    <div style={{ height: 400, width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <DataGrid
                                                            rows={customers}
                                                            columns={columns}
                                                            getRowId={(row) => row._id}
                                                            pageSize={5}
                                                            rowsPerPageOptions={[5]}
                                                            onRowClick={(event, value) => { setCustomerSelected(event.row) }}
                                                        />
                                                    </div>

                                                    {
                                                        (!confermaUpdate) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">cliente aggiornato correttamente!</Alert>
                                                    }
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                        {customerSelected === null ? "" :
                                            // <Card style={{ marginTop: '1rem', overflowX: 'auto', width: "90%", display: 'flex', justifyContent: 'center', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                                            <div style={{ marginTop: '4rem', overflowX: 'auto', width: "90%", marginLeft: 'auto', marginRight: 'auto' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem', overflowX: 'auto' }}>
                                                    <Typography variant="h4" component="div">
                                                        {customerSelected.nome_cognome.toUpperCase()}
                                                    </Typography>
                                                    {
                                                        auths["customers"] !== "*" ? "" : <Tooltip style={{ marginRight: '1rem' }} title={"Modifica"}><IconButton
                                                            onClick={() => {
                                                                setFieldToEdit("nome_cognome")
                                                                setOpenEditStatus(true)
                                                            }}>
                                                            <EditIcon style={{ fontSize: "15px" }} />
                                                        </IconButton></Tooltip>
                                                    }
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem', overflowX: 'auto' }}>
                                                    <div>
                                                        <Tooltip style={{ marginRight: '1rem' }} title={customerSelected.status.toLowerCase()}>
                                                            <IconButton>
                                                                <AiFillInfoCircle style={{ color: statusColors[customerSelected.status.toLowerCase()], fontSize: 'xx-large' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {
                                                            auths["customers"] !== "*" ? "" : <Tooltip style={{ marginRight: '1rem' }} title={"Modifica"}><IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("status")
                                                                    setOpenEditStatus(true)
                                                                }}>
                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                            </IconButton></Tooltip>
                                                        }
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem', overflowX: 'auto' }}>
                                                    <div>
                                                        <Tooltip style={{ marginRight: '1rem' }} title={"note"}>
                                                            <IconButton onClick={() => {
                                                                setOpenNote(true)
                                                            }}>
                                                                <NotesIcon style={{ fontSize: 'xx-large' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {
                                                            auths["customers"] !== "*" ? "" : <Tooltip style={{ marginRight: '1rem' }} title={"Modifica"}><IconButton
                                                                onClick={() => {
                                                                    setFieldToEdit("note")
                                                                    setOpenEditField(true)
                                                                }}>
                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                            </IconButton></Tooltip>
                                                        }
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem', overflowX: 'auto', width: '100%' }}>
                                                    <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black" }} style={{ marginRight: "1rem" }}>
                                                        <CardContent>
                                                            <Typography style={{ fontSize: 24 }} sx={{ fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                                Informazioni cliente
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <ApartmentIcon style={{ marginBottom: '2rem' }} />
                                                            </Typography>
                                                            <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                company
                                                            </Typography>
                                                            <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                {customerSelected.company.toUpperCase()}
                                                            </Typography>
                                                            <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                indirizzo
                                                            </Typography>
                                                            <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                {customerSelected.indirizzo} {bull} {customerSelected.comune} {bull} {customerSelected.provincia}
                                                            </Typography>
                                                            <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                telefono
                                                            </Typography>
                                                            <Typography style={{ fontSize: 18 }} variant="body2">
                                                                {customerSelected.telefono}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                    <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black" }} style={{ marginRight: "1rem" }}>
                                                        <CardContent>
                                                            <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                                Contratto
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <DescriptionIcon style={{ marginBottom: '1rem' }} />
                                                            </Typography>
                                                            <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                bonus
                                                            </Typography>
                                                            <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                {customerSelected.bonus}
                                                                {
                                                                    auths["customers"] !== "*" ? "" : <IconButton
                                                                        onClick={() => {
                                                                            setFieldToEdit("bonus")
                                                                            setOpenEditField(true)
                                                                        }}>
                                                                        <EditIcon style={{ fontSize: "15px" }} />
                                                                    </IconButton>
                                                                }
                                                            </Typography>
                                                            <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                termico/elettrico
                                                            </Typography>
                                                            <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                {customerSelected.termico_elettrico}
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
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem', overflowX: 'auto' }}>
                                                    <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black" }} style={{ marginRight: "1rem" }}>
                                                        <CardContent>
                                                            <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                                Interventi
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <SettingsIcon style={{ marginBottom: '2rem' }} />
                                                            </Typography>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', overflowX: 'auto' }}>
                                                                <div>
                                                                    <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                        data sopralluogo
                                                                    </Typography>
                                                                    <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
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
                                                                </div>
                                                                <div style={{ marginLeft: '5rem' }}>
                                                                    <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                        data installazione
                                                                    </Typography>
                                                                    <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
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
                                                                </div>
                                                                <div style={{ marginLeft: '5rem' }}>
                                                                    <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                        installatore
                                                                    </Typography>
                                                                    <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
                                                                        {customerSelected.installatore}
                                                                        {
                                                                            auths["customers"] !== "*" ? "" : <IconButton
                                                                                onClick={() => {
                                                                                    setFieldToEdit("installatore")
                                                                                    setOpenEditField(true)
                                                                                }}>
                                                                                <EditIcon style={{ fontSize: "15px" }} />
                                                                            </IconButton>
                                                                        }
                                                                    </Typography>
                                                                </div>
                                                                <div style={{ marginLeft: '5rem' }}>
                                                                    <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                        trasferta
                                                                    </Typography>
                                                                    <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
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
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '3rem', marginTop: '3rem', overflowX: 'auto' }}>
                                                    <Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3, border: "1px solid black" }} style={{ marginRight: "1rem" }}>
                                                        <CardContent>
                                                            <Typography sx={{ fontSize: 24, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                                                                PDF
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <PictureAsPdfIcon style={{ marginBottom: '1rem' }} />
                                                            </Typography>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', overflowX: 'auto', marginBottom: "2rem" }}>
                                                                <div style={{ marginRight: '5rem' }}>
                                                                    <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                        di.co
                                                                    </Typography>
                                                                    {
                                                                        customerSelected.di_co.length === 0 || customerSelected.di_co === "" || customerSelected.di_co === null || customerSelected.di_co === undefined ? "" :
                                                                            <Typography variant="h7" component="div">
                                                                                {
                                                                                    customerSelected.di_co.map(pf => {
                                                                                        return <div>
                                                                                            <IconButton>
                                                                                                <a href={pf}><LinkIcon style={{ fontSize: "15px" }} /></a>
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
                                                                </div>
                                                                <div style={{ marginRight: '5rem' }}>
                                                                    <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                        check list
                                                                    </Typography>
                                                                    {
                                                                        customerSelected.check_list.length === 0 || customerSelected.check_list === "" || customerSelected.check_list === null || customerSelected.check_list === undefined ? "" :
                                                                            <Typography variant="h7" component="div">
                                                                                {
                                                                                    customerSelected.check_list.map(pf => {
                                                                                        return <div>
                                                                                            <IconButton>
                                                                                                <a href={pf}><LinkIcon style={{ fontSize: "15px" }} /></a>
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
                                                                </div>
                                                                <div>
                                                                    <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                        fgas
                                                                    </Typography>
                                                                    {
                                                                        customerSelected.fgas.length === 0 || customerSelected.fgas === "" || customerSelected.fgas === null || customerSelected.fgas === undefined ? "" :
                                                                            <Typography variant="h7" component="div">
                                                                                {
                                                                                    customerSelected.fgas.map(pf => {
                                                                                        return <div>
                                                                                            <IconButton>
                                                                                                <a href={pf}><LinkIcon style={{ fontSize: "15px" }} /></a>
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
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', overflowX: 'auto', marginBottom: "2rem" }}>
                                                                <div style={{ marginRight: '5rem' }}>
                                                                    <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                        prova fumi
                                                                    </Typography>
                                                                    {
                                                                        customerSelected.prova_fumi.length === 0 || customerSelected.prova_fumi === "" || customerSelected.prova_fumi === null || customerSelected.prova_fumi === undefined ? "" :
                                                                            <Typography variant="h7" component="div">
                                                                                {
                                                                                    customerSelected.prova_fumi.map(pf => {
                                                                                        return <div>
                                                                                            <IconButton>
                                                                                                <a href={pf}><LinkIcon style={{ fontSize: "15px" }} /></a>
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
                                                                </div>
                                                                <div style={{ marginRight: '5rem' }}>
                                                                    <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                        collaudo
                                                                    </Typography>
                                                                    {
                                                                        customerSelected.collaudo.length === 0 || customerSelected.collaudo === "" || customerSelected.collaudo === null || customerSelected.collaudo === undefined ? "" :
                                                                            <Typography variant="h7" component="div">
                                                                                {
                                                                                    customerSelected.collaudo.map(pf => {
                                                                                        return <div>
                                                                                            <IconButton>
                                                                                                <a href={pf}><LinkIcon style={{ fontSize: "15px" }} /></a>
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
                                                                </div>
                                                                <div>
                                                                    <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                        assistenza
                                                                    </Typography>
                                                                    {
                                                                        customerSelected.assistenza.length === 0 || customerSelected.assistenza === "" || customerSelected.assistenza === null || customerSelected.assistenza === undefined ? "" :
                                                                            <Typography variant="h7" component="div">
                                                                                {
                                                                                    customerSelected.assistenza.map(pf => {
                                                                                        return <div>
                                                                                            <IconButton>
                                                                                                <a href={pf}><LinkIcon style={{ fontSize: "15px" }} /></a>
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
                                                                </div>
                                                            </div>
                                                            {
                                                                auths["customers"] !== "*" ? "" : <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', overflowX: 'auto' }}>
                                                                    <div style={{ marginRight: '5rem' }}>
                                                                        <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                            pagamenti (pdf)
                                                                        </Typography>
                                                                        {
                                                                            customerSelected.pagamenti_pdf.length === 0 || customerSelected.pagamenti_pdf === "" || customerSelected.pagamenti_pdf === null || customerSelected.pagamenti_pdf === undefined ? "" :
                                                                                <Typography variant="h7" component="div">
                                                                                    {
                                                                                        customerSelected.pagamenti_pdf.map(pf => {
                                                                                            return <div>
                                                                                                <IconButton>
                                                                                                    <a href={pf}><LinkIcon style={{ fontSize: "15px" }} /></a>
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
                                                                    </div>
                                                                    <div>
                                                                        <Typography style={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.4)" }} variant="body2">
                                                                            pagamenti (testo)
                                                                        </Typography>
                                                                        <Typography style={{ fontSize: 18, marginBottom: '1rem' }} variant="body2">
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
                                                                    </div>
                                                                </div>
                                                            }

                                                        </CardContent>
                                                    </Card>
                                                </div>
                                                <div style={{ justifyContent: 'left', textAlign: 'left', marginTop: '5rem' }}>
                                                    <div style={{ marginRight: '3rem', marginBottom: '4rem', overflowX: 'auto' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                            <Typography style={{ marginTop: '1rem', marginBottom: '2rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                                FOTO SOPRALLUOGO
                                                            </Typography>
                                                            <IconButton onClick={() => { downloadFolder(customerSelected.foto_sopralluogo, "sopralluogo") }}>
                                                                <GetAppIcon />
                                                            </IconButton>
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
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
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1.5rem' }}>
                                                                <Button disabled={!isSopralluogoPicked} onClick={(event) => {
                                                                    handleSubmissionSopralluogo(event)
                                                                    setIsLoading(true)
                                                                }} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1.5rem' }}>
                                                            <Button onClick={(event) => {
                                                                setOpenSopralluogo(event)
                                                                setPageSopralluogo(1)
                                                            }}
                                                                variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Apri {customerSelected.foto_sopralluogo.length} foto</Button>
                                                        </div>
                                                    </div>
                                                    <div style={{ marginRight: '3rem', marginBottom: '4rem', overflowX: 'auto' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                            <Typography style={{ marginTop: '1rem', marginBottom: '2rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                                FOTO FINE INSTALLAZIONE
                                                            </Typography>
                                                            <IconButton onClick={() => { downloadFolder(customerSelected.foto_fine_installazione, "fine_installazione") }}>
                                                                <GetAppIcon />
                                                            </IconButton>
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
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
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1.5rem' }}>
                                                                <Button disabled={!isInstallazionePicked} onClick={(event) => {
                                                                    handleSubmissionInstallazione(event)
                                                                    setIsLoading(true)
                                                                }} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1.5rem' }}>
                                                            <Button onClick={(event) => {
                                                                setOpenInstallazione(event)
                                                                setPageInstallazione(1)
                                                            }} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Apri {customerSelected.foto_fine_installazione.length} foto</Button>
                                                        </div>
                                                    </div>
                                                    <div style={{ marginRight: '3rem', marginBottom: '4rem', overflowX: 'auto' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                            <Typography style={{ marginTop: '1rem', marginBottom: '2rem' }} sx={{ fontSize: 20, fontWeight: 'bold' }} color="text.primary" gutterBottom>
                                                                FOTO ASSISTENZA
                                                            </Typography>
                                                            <IconButton onClick={() => { downloadFolder(customerSelected.foto_assistenza, "assistenza") }}>
                                                                <GetAppIcon />
                                                            </IconButton>
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
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
                                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1.5rem' }}>
                                                                <Button disabled={!isAssistenzaPicked} onClick={(event) => {
                                                                    handleSubmissionAssistenza(event)
                                                                    setIsLoading(true)
                                                                }} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '1.5rem' }}>
                                                            <Button onClick={(event) => {
                                                                setOpenAssistenza(event)
                                                                setPageAssistenza(1)
                                                            }} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Apri {customerSelected.foto_assistenza.length} foto</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            // </Card>
                                        }
                                    </div>
                                    {
                                        customerSelected === null ? "" : <Dialog onClose={handleCloseNote} open={openNote}>
                                            <DialogTitle>Note:</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    {
                                                        customerSelected.note === "" ? <h4>Vuoto</h4> : <div>
                                                            {customerSelected.note}
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
                                                <Box sx={style} style={{ maxHeight: '80%', overflowY: 'auto', overflowX: 'auto' }}>
                                                    {
                                                        customerSelected.foto_sopralluogo.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> : <div>
                                                            <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Foto sopralluogo</h2>
                                                            {
                                                                customerSelected.foto_sopralluogo.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> :
                                                                    <div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                                                                            <img style={{ maxHeight: '500px', maxWidth: '500px', marginRight: 'auto', marginLeft: 'auto' }} src={customerSelected.foto_sopralluogo[pageSopralluogo - 1]} alt="Logo" />
                                                                        </div>
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
                                                                        <Pagination style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }} count={customerSelected.foto_sopralluogo.length} shape="rounded" page={pageSopralluogo} onChange={handleChangeFotoSopralluogo} />
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
                                                <Box sx={style} style={{ maxHeight: '80%', overflowY: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>
                                                    {
                                                        customerSelected.foto_fine_installazione.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> : <div>
                                                            <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Foto fine installazione</h2>
                                                            {
                                                                customerSelected.foto_fine_installazione.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> :
                                                                    <div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                                                                            <img style={{ maxHeight: '500px', maxWidth: '500px', marginRight: 'auto', marginLeft: 'auto' }} src={customerSelected.foto_fine_installazione[pageInstallazione - 1]} alt="Logo" />
                                                                        </div>
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
                                                                        <Pagination style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }} count={customerSelected.foto_fine_installazione.length} shape="rounded" page={pageInstallazione} onChange={handleChangeFotoInstallazione} />
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
                                                <Box sx={style} style={{ maxHeight: '80%', overflowY: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>
                                                    {
                                                        customerSelected.foto_assistenza.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> : <div>
                                                            <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Foto assistenza</h2>
                                                            {
                                                                customerSelected.foto_assistenza.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>Vuoto</h2> :
                                                                    <div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                                                                            <img style={{ maxHeight: '500px', maxWidth: '500px', marginRight: 'auto', marginLeft: 'auto' }} src={customerSelected.foto_assistenza[pageAssistenza - 1]} alt="Logo" />
                                                                        </div>
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
                                                                        <Pagination style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }} count={customerSelected.foto_assistenza.length} shape="rounded" page={pageAssistenza} onChange={handleChangeFotoAssistenza} />
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
                                                <Box sx={style}>
                                                    <Typography style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h2">
                                                        Aggiorna il campo {fieldToEdit.toUpperCase()}:
                                                    </Typography>
                                                    <TextField style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }} id="filled-basic" label="Nuovo valore:" variant="filled" onChange={(event) => {
                                                        setValueToEdit(event.target.value)
                                                    }} />
                                                    <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                        <Button style={{ color: 'white', backgroundColor: 'green', marginLeft: '1rem' }} onClick={() => {
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
                                                    <Typography style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h2">
                                                        Carica file pdf {fieldToEdit.toUpperCase()}:
                                                    </Typography>
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                            <input type="file" name="file" onChange={changeHandlerPDF} /></div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
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
                                                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                                            <Button disabled={!isFilePDFPicked} onClick={(event) => {
                                                                handleSubmissionPDF()
                                                                setIsLoading(true)
                                                            }} variant="outlined" style={{ color: 'white', backgroundColor: 'green' }}>Carica</Button>
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
                                                    <Typography style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h2">
                                                        Aggiorna il campo {fieldToEdit.toUpperCase()}:
                                                    </Typography>
                                                    <Autocomplete
                                                        disablePortal
                                                        style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', textAlign: 'center', marginRight: 'auto', marginLeft: 'auto' }}
                                                        id="combo-box-demo"
                                                        options={possibleStatuses}
                                                        sx={{ width: 300 }}
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
                                                        <Button style={{ color: 'white', backgroundColor: 'green' }} onClick={() => {
                                                            editStatus()
                                                            setIsLoading(true)
                                                        }}>Conferma</Button>
                                                    </div>
                                                </Box>
                                            </Modal>
                                        </div>
                                    }
                                    {/* Modal to add statuses and colors */}
                                    <Modal
                                        open={openColorsUpdate}
                                        onClose={() => { handleCloseColorsUpdate() }}
                                        aria-labelledby="modal-modal-label"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <Typography style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', textAlign: 'center' }} id="modal-modal-label" variant="h6" component="h2">
                                                Aggiungi uno stato e il suo colore:
                                            </Typography>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                <div>
                                                    <input style={{ marginTop: '2rem', marginBottom: '2rem' }} placeholder="nuovo stato" onChange={(event) => { setStatusToAdd(event.target.value.toLowerCase()) }} />
                                                    <SketchPicker
                                                        color={colorToAdd}
                                                        disableAlpha={true}
                                                        onChangeComplete={handleChangeComplete}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                                                <Button style={{ color: 'white', backgroundColor: 'green', marginLeft: '1rem' }} onClick={() => { addStatusColor() }}>Conferma</Button>
                                            </div>
                                        </Box>
                                    </Modal>
                                </div>
                        }
                    </div>
            }

        </div>
    );
}

export default Customers;
