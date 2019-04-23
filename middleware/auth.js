const authMiddleware = () => {
    return(req, res, next)=>{
        console.log(
          `req.session.passport: ${JSON.stringify(req.session)}`
        );

        if(req.isAuthenticated()){ 
            return next();
            
        }else{
            res.redirect("/users/login");
        }
    }
}
module.exports = authMiddleware;