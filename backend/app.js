const express = require('express')
const mongoose = require('mongoose')
const xlsx = require('xlsx')
const upload = require('express-fileupload')
var fs = require('fs')
var excel = require('excel4node');
const Excel = require('exceljs');
var excelbuilder = require('msexcel-builder');
var Workbook = require('xlsx-workbook').Workbook;
const Structure = require('./models/structure')
const Tool = require('./models/tool')
const EmailTemplate = require('./models/emailTemplate')
const History = require('./models/history')
const Employee = require('./models/employee')
const Profile = require('./models/profile')
const Customer = require('./models/customer')
const Auth = require('./models/auth')
const Color = require('./models/color')
const Images = require('./models/images')
// const bodyParser = require('body-parser')
require('dotenv').config();
var nodemailer = require('nodemailer');
const multer = require("multer");
const path = require('path');
var cron = require('node-cron');
var cors = require('cors')
const jwt = require("jsonwebtoken")
const app = express();
const feUrl = "http://localhost:3000"
// const feUrl = "https://my-warehouse-app-heroku.herokuapp.com"
const port = process.env.PORT || 8050
// const idEmailAlert = '62086ab09422a5466157fe5a'

// COMMENT WHEN RUNNING LOCALLY
// app.use(express.static(path.join(__dirname, "/frontend/build")));
// app.use(cors())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
});

// app.use(bodyParser.json())

// COMMENT WHEN BUILDING TO HEROKU next 13 lines
const whitelist = [feUrl]
// enable CORS policy
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions))



app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb' }));
app.use(upload())

// Connect to server
const dbUri = process.env.MONGO_URL //'mongodb+srv://admin:bYn3epDI1YwiENB6@cluster0.61jsm.mongodb.net/warehouse?retryWrites=true&w=majority'
// console.log("dbUri: " + dbUri)
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected")
    app.listen(port)
}).catch((error) => { console.log(error) })

// SCHEDULED
cron.schedule('00 15 * * 5', () => {
    EmailTemplate.findOne({ use: "weeklyReport" }).then((emailWeeklyReport) => {
        EmailTemplate.findOne({ use: "singleToolReport" }).then((emailSingleTool) => {
            Tool.find().then((tools) => {
                var listToolEmail = ""
                var allAlertTool = []
                var singleTool = {}
                for (let t of tools) {
                    if (t.quantity < t.lowerBound) {
                        singleTool = {}
                        listToolEmail = listToolEmail + emailSingleTool.template.replace("{label}", t.label).replace("{label}", t.label).replace("{quantity}", t.quantity).replace("{lowerBound}", t.lowerBound).replace("{price}", t.price).replace("{department}", t.department).replace("{subDepartment}", t.subDepartment).replace("{marca}", t.marca).replace("{code}", t.code)
                        singleTool.prodotto = t.label
                        singleTool.quantita = t.quantity
                        singleTool.quantita_minima = t.lowerBound
                        singleTool.prezzo = t.price
                        singleTool.reparto = t.department
                        singleTool.sotto_reparto = t.subDepartment
                        singleTool.marca = t.marca
                        singleTool.code = t.code
                        allAlertTool.push(singleTool)
                    }
                }
                const workSheet = xlsx.utils.json_to_sheet(allAlertTool)
                const workBook = xlsx.utils.book_new()

                xlsx.utils.book_append_sheet(workBook, workSheet, "report")

                let data = xlsx.write(workBook, { type: 'buffer', bookType: 'xlsx', bookSST: false });
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'idroaltech.bot@gmail.com',
                        // pass: 'owgjqqmbvuzkprtw'
                        pass: 'qvysuihwjoiaawuj'
                    }
                });

                var mailOptions = {
                    from: 'idroaltech.bot@gmail.com',
                    to: 'roba.edoardo@gmail.com, logistica@idroaltech.it',
                    subject: 'Report settimanale - catalogo prodotti',
                    html: emailWeeklyReport.template.replace("{list of tools}", listToolEmail),
                    attachments: {
                        filename: "weekly_report.xlsx",
                        content: data
                    }
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send('Email sent: ' + info.response)
                    }
                });
            }).catch((error) => { console.log("error: ", error) })

        });
    });
});
//EMAIL
// app.post('/api/sendEmail', (req, res) => {

//     EmailTemplate.findOne({ use: "weeklyReport" }).then((emailWeeklyReport) => {
//         EmailTemplate.findOne({ use: "singleToolReport" }).then((emailSingleTool) => {
//             Tool.find().then((tools) => {
//                 var listToolEmail = ""
//                 var allAlertTool = []
//                 var singleTool = {}
//                 for (let t of tools) {
//                     if (t.quantity < t.lowerBound) {
//                         singleTool = {}
//                         listToolEmail = listToolEmail + emailSingleTool.template.replace("{label}", t.label).replace("{label}", t.label).replace("{quantity}", t.quantity).replace("{lowerBound}", t.lowerBound).replace("{price}", t.price).replace("{department}", t.department).replace("{subDepartment}", t.subDepartment)
//                         singleTool.prodotto = t.label
//                         singleTool.quantita = t.quantity
//                         singleTool.quantita_minima = t.lowerBound
//                         singleTool.prezzo = t.price
//                         singleTool.reparto = t.department
//                         singleTool.sotto_reparto = t.subDepartment
//                         allAlertTool.push(singleTool)
//                     }
//                 }
//                 const workSheet = xlsx.utils.json_to_sheet(allAlertTool)
//                 const workBook = xlsx.utils.book_new()

//                 xlsx.utils.book_append_sheet(workBook, workSheet, "report")

//                 let data = xlsx.write(workBook, { type: 'buffer', bookType: 'xlsx', bookSST: false });
//                 var transporter = nodemailer.createTransport({
//                     service: 'gmail',
//                     auth: {
//                         user: 'idroaltech.bot@gmail.com',
//                         pass: 'owgjqqmbvuzkprtw'
//                     }
//                 });

//                 var mailOptions = {
//                     from: 'idroaltech.bot@gmail.com',
//                     to: 'roba.edoardo@gmail.com',
//                     subject: 'Report settimanale - catalogo prodotti',
//                     html: emailWeeklyReport.template.replace("{list of tools}", listToolEmail),
//                     attachments: {
//                         filename: "weekly_report.xlsx",
//                         content: data
//                     }
//                 };
//                 transporter.sendMail(mailOptions, function (error, info) {
//                     if (error) {
//                         console.log(error);
//                     } else {
//                         res.send('Email sent: ' + info.response)
//                     }
//                 });
//             }).catch((error) => { console.log("error: ", error) })

//         });
//     });
// })


//AUTHS
// POST
// app.post('/api/auth', (req, res) => {
//     const auth = new Auth({
//         code: "base",
//         permissions: ["warehouse"]
//     })
//     auth.save().then((result) => {
//         res.send(result)
//     }).catch((error) => {
//         console.log("error:", error)
//     })
// })

// GET
app.get('/api/auth', (req, res) => {
    // it gets all the element in that document
    Auth.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})

// GET SINGLE
app.get('/api/auth/:id', (req, res) => {
    // it gets all the element in that document
    Auth.findById(req.params.id).then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})




// STRUCTURE OF THE WAREHOUSE:
// POST
app.post('/api/structure', (req, res) => {
    const structure = new Structure({
        label: req.body.label,
        father: req.body.father
    })
    structure.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error:", error)
    })
})

// GET
app.get('/api/structure', (req, res) => {
    // it gets all the element in that document
    Structure.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})

//GET SINGLE
// app.get('/getSingleStructure', (req, res) => {
//     // it gets all the element in that document
//     Structure.findById('62040f12443a3b4085cf4a03').then((result) => {
//         res.send(result);
//     }).catch((error) => { console.log("error: ", error) })
// })

// PUT
app.put('/api/structure/:id', (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    Structure.findByIdAndUpdate(
        { _id: id },
        body
    ).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error: ", error)
    })
})

//DELETE
app.delete('/api/structure/:id', (req, res) => {
    const id = req.params.id;
    Structure.deleteOne(
        { _id: id }
    ).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error: ", error)
    })
})

// app.delete('/api/customer/:id', (req, res) => {
//     const id = "620fe7a16ddd9d1a6d5acadf"
//     Customer.deleteOne(
//         { _id: id }
//     ).then((result) => {
//         res.send(result)
//     }).catch((error) => {
//         console.log("error: ", error)
//     })
// })



// TOOLS
// POST
app.post('/api/tool', (req, res) => {
    const tool = new Tool({
        label: req.body.label,
        quantity: req.body.quantity,
        lowerBound: req.body.lowerBound,
        department: req.body.department,
        subDepartment: req.body.subDepartment,
        price: req.body.price,
        lastUser: req.body.lastUser,
        code: req.body.code,
        marca: req.body.marca
    })
    // console.log("tool: ", tool)
    tool.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error:", error)
        res.status(400).send(new Error('description'));
    })
})

// GET
app.get('/api/tool', (req, res) => {
    // it gets all the element in that document
    Tool.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})
//GET SINGLE
app.get('/api/tool/:id', (req, res) => {
    // it gets all the element in that document
    Tool.findById(req.params.id).then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})

// PUT
app.put('/api/tool/:id', (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    const quantity = req.body.quantity
    const label = req.body.label
    Tool.findById(id).then((result) => {
        if (parseInt(quantity) < result.lowerBound) {
            EmailTemplate.findOne({ use: "alertLowerBound" }).then((resultEmail) => {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'idroaltech.bot@gmail.com',
                        // pass: 'owgjqqmbvuzkprtw'
                        pass: 'qvysuihwjoiaawuj'
                    }
                });

                var mailOptions = {
                    from: 'idroaltech.bot@gmail.com',
                    to: 'roba.edoardo@gmail.com, logistica@idroaltech.it', // info@idroaltech.it',
                    subject: 'NOTIFICA QUANTITA\' LIMITE - ' + label.toUpperCase(),
                    html: resultEmail.template.replace("{label}", result.label).replace("{label}", result.label).replace("{quantity}", quantity).replace("{lowerBound}", result.lowerBound).replace("{price}", result.price).replace("{department}", result.department).replace("{subDepartment}", result.subDepartment).replace("{marca}", result.marca).replace("{code}", result.code)
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send('Email sent: ' + info.response)
                    }
                });
            }).catch((error) => { console.log("error: ", error) })
        }
        Tool.findByIdAndUpdate(
            { _id: id },
            body
        ).then((resultTool) => {
            res.send(resultTool)
        }).catch((error) => {
            console.log("error: ", error)
        })
    }).catch((error) => { console.log("error: ", error) })

})

//DELETE
app.delete('/api/tool/:id', (req, res) => {
    const id = req.params.id;
    Tool.findByIdAndRemove(
        id
    ).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error: ", error)
    })
})


// HISTORY
// POST
app.post('/api/history/:tool', (req, res) => {
    const history = new History({
        user: req.body.user,
        tool: req.params.tool,
        totalQuantity: req.body.totalQuantity,
        update: req.body.update
    })
    // console.log("history: ", history)
    history.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error:", error)
    })
})

// GET
app.get('/api/history', (req, res) => {
    if (req.query.type !== undefined) {
        if (req.query.type === "user") {
            History.find({ user: req.query.data }).then((result) => {
                res.send(result);
            }).catch((error) => { console.log("error: ", error) })
        } else {
            History.find({ tool: req.query.data }).then((result) => {
                res.send(result);
            }).catch((error) => { console.log("error: ", error) })
        }
    } else {
        // it gets all the element in that document
        History.find().then((result) => {
            res.send(result);
        }).catch((error) => { console.log("error: ", error) })
    }
})



// EMPLOYEE
// POST
app.post('/api/employee', (req, res) => {
    const employee = new Employee({
        label: req.body.label,
        name: req.body.name,
        lastName: req.body.lastName,
        birth: req.body.birth,
        fiscalCode: req.body.fiscalCode
    })
    // console.log("employee: ", employee)
    employee.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error:", error)
    })
})

// GET
app.get('/api/employee', (req, res) => {
    // it gets all the element in that document
    Employee.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})

//DELETE
app.delete('/api/employee/:id', (req, res) => {
    const id = req.params.id;
    Employee.findByIdAndRemove(
        id
    ).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error: ", error)
    })
})



// PROFILE
// POST
app.post('/api/profile', (req, res) => {

    const username = req.body.username
    const password = req.body.password
    Profile.find().then((result) => {
        var profile = result.filter((ress) => ress.password === password && ress.username === username)
        if (profile.length > 0) {
            const id = res.id
            const token = jwt.sign({ id }, "jwtSecret", {
                expiresIn: 3600
            })
            Auth.findOne({ code: profile[0].code }).then((resAuth) => {
                res.json({ auth: true, token: token, auths: resAuth.permissions, profile: profile[0].code })
            }).catch((error) => { console.log("error: ", error) })
            // console.log(token)
        } else {
            res.status(404).send({ auth: false, message: "user does not exist." })
            console.log("user does not exist.")
        }
    }).catch((error) => { console.log("error: ", error) })

})

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]
    const profile = req.headers["profile"]
    const auths = req.headers["auths"] //.split(',')
    if (!token) {
        res.status(406).send("The user is not authenticated.")
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                res.status(406).send("The user is not authenticated.")
                // res.json({ auth: false, message: "You failed to authenticate." })
            } else {
                Auth.findOne({ code: profile }).then((resAuth) => {
                    if (auths.replace(":*", "") === resAuth.permissions.replace(":*", "")) {
                        req.userId = decoded.id;
                        next();
                    } else {
                        res.status(406).send({ message: "permissions changed" })
                    }
                }).catch((error) => { console.log("error: ", error) })
            }
        })
    }
}

app.get('/api/authenticated', verifyJWT, (req, res) => {
    res.send("You are authenticated!")
})




// FILE UPLOADER
app.post('/api/newCustomerFile', (req, res) => {
    // console.log(req.body)
    if (req.body.rows) {
        // console.log(req.body.rows)
        var customer = {}
        var columns = req.body.rows[0]
        var rows = req.body.rows
        var i = 1, len = req.body.rows.length
        var j = 0, lenCol = columns.length
        var customerMongo
        while (i < len) {
            customer = {}
            j = 0
            while (j < lenCol) {
                customer[columns[j].toLowerCase()] = rows[i][j]
                j++
            }
            i++
            customerMongo = new Customer(customer)
            console.log(customerMongo)
            customerMongo.save().then((result) => {
                console.log("File aggiunto!")
                res.status(200).json({ message: 'File aggiunto!' })
            }).catch((error) => {
                console.log("error:", error)
                res.status(500).json({ message: 'Errore' })
            })
        }
        // console.log(customer)
    }
    // else {
    //     return res.status(500).json({ message: 'no file selected' })
    // }
})



// CUSTOMERS
// POST
app.post('/api/customer', (req, res) => {
    const customer = new Customer({
        company: req.body.company,
        nome_cognome: req.body.nome_cognome,
        telefono: req.body.telefono,
        indirizzo: req.body.indirizzo,
        comune: req.body.comune,
        provincia: req.body.provincia,
        bonus: req.body.bonus,
        status: req.body.status,
        termico_elettrico: req.body.termico_elettrico,
        computo: req.body.computo,
        data_sopralluogo: req.body.data_sopralluogo,
        data_installazione: req.body.data_installazione,
        installatore: req.body.installatore,
        trasferta: req.body.trasferta,
        assistenza: req.body.assistenza,
        note: req.body.note,
        pagamenti_testo: req.body.pagamenti_testo
    })
    // console.log("customer: ", customer)
    customer.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error:", error)
    })
})

// GET
app.get('/api/customer', (req, res) => {
    // it gets all the element in that document
    Customer.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})

// PUT
app.put('/api/customer/:id', (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    Customer.findByIdAndUpdate(
        { _id: id },
        body
    ).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error: ", error)
    })
})

// GET SINGLE
app.get('/api/customer/:id', (req, res) => {
    const id = req.params.id;
    // console.log(id)
    // it gets all the element in that document
    Customer.findById(id).then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})

// DELETE
app.delete('/api/customer/:id', (req, res) => {
    const id = req.params.id;
    Customer.deleteOne(
        { _id: id }
    ).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error: ", error)
    })
})



// COLORS
// POST
app.post('/api/colorsStatus', (req, res) => {
    const color = new Color({
        label: req.body.label,
        color: req.body.color
    })
    // console.log("color: ", color)
    color.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error:", error)
    })
})

// GET
app.get('/api/colorsStatus', (req, res) => {
    // it gets all the element in that document
    Color.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})



// COMMENT WHEN RUNNING LOCALLY
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
// });