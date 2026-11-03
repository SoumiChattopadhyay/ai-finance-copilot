const authorizeUser = (req,res,next)=>{
    const requestedUserId = req.params.userId;
    if(req.user.userId !== requestedUserId){
        return res.status(403).json({
            success:false,
            message: "Forbidden. You cannot access another user's data."
        });
    }
    next();
}

module.exports = authorizeUser;