
const jwt = require('jsonwebtoken')


function authenticationtoken (req,res,next){

    const authheader = req.headers["authorization"];
    const token = authheader  && authheader.split(" ")[1]

    if(!token) {
        return res.sendStatus(401).json({message:"Please login first"})
    }

    jwt.verify(token, "72657bf86a2286ed1b6038194c0af75866b6a6d4b2479ae5c3464f97957658f8987d767b10498488695eff6d579d83fc35ff52d6f965068428a528949f8aae42",
        (err,user)=>{
        if(err){
            return res.sendStatus(401)
        }
        req.user = user;
        next()
    })
}

module.exports = {
    authenticationtoken
}