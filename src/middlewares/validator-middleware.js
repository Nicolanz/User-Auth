import { validationResult } from "express-validator";


const validationMiddleware = (req, res, next) =>{
    let errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log("validations are not filled correctly");
        return res.json({
            errors: errors.array(),
        });
    }
    next();
};

export default validationMiddleware;
