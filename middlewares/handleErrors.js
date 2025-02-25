const handleErrors = (err, req, res, next)=>{
    return res.status(500).json({
        error:"Internal server Error",
        message: err.message
    })
}

module.exports = handleErrors