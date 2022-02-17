const express = require('express')
const mongoose = require('mongoose')
const Structure = require('./models/structure')
const Tool = require('./models/tool')
const EmailTemplate = require('./models/emailTemplate')
const History = require('./models/history')
const Employee = require('./models/employee')
const Profile = require('./models/profile')
const bodyParser = require('body-parser')
require('dotenv').config();
var nodemailer = require('nodemailer');
const path = require('path');
var cron = require('node-cron');
var cors = require('cors')
const jwt = require("jsonwebtoken")
const app = express();
// const feUrl = "http://localhost:3000"
const feUrl = "https://my-warehouse-app-heroku.herokuapp.com"
const port = process.env.PORT || 8050
const idEmailAlert = '62086ab09422a5466157fe5a'

// COMMENT WHEN RUNNING LOCALLY
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.use(cors())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
});

app.use(bodyParser.json())
// COMMENT WHEN BUILDING TO HEROKU next 13 lines
// const whitelist = [feUrl]
// // enable CORS policy
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin || whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error("Not allowed by CORS"))
//         }
//     },
//     credentials: true,
// }
// app.use(cors(corsOptions))

// Connect to server
const dbUri = process.env.MONGO_URL //'mongodb+srv://admin:bYn3epDI1YwiENB6@cluster0.61jsm.mongodb.net/warehouse?retryWrites=true&w=majority'
// console.log("dbUri: " + dbUri)
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected")
    app.listen(port)
}).catch((error) => { console.log(error) })

// SCHEDULED
cron.schedule('00 21 * * 5', () => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'idroaltech.bot@gmail.com',
            pass: 'owgjqqmbvuzkprtw'
        }
    });

    var mailOptions = {
        from: 'idroaltech.bot@gmail.com',
        to: 'roba.edoardo@gmail.com',
        subject: 'NOTIFICA from website',
        text: 'Prova email schedulata'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            res.send('Email sent: ' + info.response)
        }
    });
});


//EMAIL
app.post('/api/sendEmail', (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'idroaltech.bot@gmail.com',
            pass: 'owgjqqmbvuzkprtw'
        }
    });

    var mailOptions = {
        from: 'idroaltech.bot@gmail.com',
        to: 'roba.edoardo@gmail.com',
        subject: 'NOTIFICA',
        text: 'Prova'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            res.send('Email sent: ' + info.response)
        }
    });
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
        lastUser: req.body.lastUser
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
            EmailTemplate.findById(idEmailAlert).then((resultEmail) => {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'idroaltech.bot@gmail.com',
                        pass: 'owgjqqmbvuzkprtw'
                    }
                });

                var mailOptions = {
                    from: 'idroaltech.bot@gmail.com',
                    to: 'roba.edoardo@gmail.com', // info@idroaltech.it',
                    subject: 'NOTIFICA QUANTITA\' LIMITE - ' + label.toUpperCase(),
                    html: resultEmail.template.replace("{label}", result.label).replace("{label}", result.label).replace("{quantity}", quantity).replace("{lowerBound}", result.lowerBound).replace("{price}", result.price).replace("{department}", result.department).replace("{subDepartment}", result.subDepartment)
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
    // it gets all the element in that document
    History.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})



// EMPLOYEE
// POST
app.post('/api/employee', (req, res) => {
    const employee = new Employee({
        label: req.body.label,
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
        var profile = result.filter((res) => res.password === password && res.username === username)
        if (profile.length > 0) {
            const id = res.id
            const token = jwt.sign({ id }, "jwtSecret", {
                expiresIn: 3600
            })
            // console.log(token)
            res.json({ auth: true, token: token })
        } else {
            res.status(404).send({ auth: false, message: "user does not exist." })
            console.log("user does not exist.")
        }
    }).catch((error) => { console.log("error: ", error) })

})

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]
    if (!token) {
        res.status(406).send("The user is not authenticated.")
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                res.status(406).send("The user is not authenticated.")
                // res.json({ auth: false, message: "You failed to authenticate." })
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}

app.get('/api/authenticated', verifyJWT, (req, res) => {
    res.send("You are authenticated!")
})





// COMMENT WHEN RUNNING LOCALLY
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});