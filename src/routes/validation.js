module.exports = {
    validateItems(req, res, next){
        if(req.method === "POST"){
            req.checkParams("listId", "must be valid").notEmpty().isInt();
            req.checkBody("name", "must be at least 3 characters in length").isLength({min: 3});
        }
        const errors = req.validationErrors();
        if(errors){
            req.flash("error", errors);
            return res.redirect(303, req.headers.referer)
        }else{
            return next();
        }
    },
    validateLists(req, res, next){
        if(req.method === "POST"){
            
            req.checkBody("title", "must be at least 5 characters in length").isLength({min: 5});
            req.checkBody("description", "must be at least 5 characters in length").isLength({min: 5});


        }
        const errors = req.validationErrors();
        if(errors){
            req.flash("error", errors);
            return res.redirect(303, req.headers.referer)
        }else{
            return next();
        }
    }
}