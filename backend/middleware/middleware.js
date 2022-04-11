const jwt = require('jsonwebtoken')

const middleware = (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(' ')[1]
            if (!token) {
                res.status(401).send({ status: 401, message: "The user is not authenticated." })
            }
            // verify token
            jwt.verify(token, "jwtSecret", (err, decoded) => {
                if (err) {
                    res.status(401).send({ status: 401, message: "The user is not authenticated." })
                    // res.json({ auth: false, message: "You failed to authenticate." })
                } else {
                    next()
                }
            })
        } catch (error) {
            res.status(401).send({ status: 401, message: "The user is not authenticated." })
        }
    } else {
        res.status(401).send({ status: 401, message: "The user is not authenticated." })
    }

    // const token = req.headers["x-access-token"]
    // if (!token) {
    //     res.status(401).send({status:401,message:"The user is not authenticated."})
    // } else {
    //     jwt.verify(token, "jwtSecret", (err, decoded) => {
    //         if (err) {
    //             res.status(406).send({status:401,message:"The user is not authenticated."})
    //             // res.json({ auth: false, message: "You failed to authenticate." })
    //         } else {
    //             next()
    //         }
    //     })
    // }
}

module.exports = middleware