import { User } from "../models";
import { Router } from "express";
import { join } from "path";
import { randomBytes } from "crypto";
import { DOMAIN } from "../constants";
import sendMail from "../functions/email-sender";
import { userAuth } from "../middlewares/auth-guard";
import Validator from "../middlewares/validator-middleware";
import { AuthenticateValidations, RegisterValidations } from "../validators";


const router = Router();

/**
 * @description To create a new User Acoount
 * @api /users/api/register
 * @access Public
 * @type POST
 */
router.post(
    "/api/register",
    // pass to validator
    RegisterValidations,
    // pass to req and res
    Validator,
    async(req, res)=>{
        try {
            let { username, email } = req.body;
            // check if user is exists by username
            let user = await User.findOne({ username });
            if (user) {
                return res.status(400).json({
                    success: false,
                    message: "Username is already taken.",
                })
            }
            // check if user exists by email
            user = await User.findOne({ email });
            if (user){
                return res.status(400).json({
                    success: false,
                    message: "Email is already registered. Did you forget the password. Try resetting it."
                });
            }
            // create new user
            user = new User({
                ...req.body,
                verificationCode: randomBytes(20).toString("hex"),
            });
            await user.save();
            // send email to user with verification link
            let html = `
                <div>
                    <h1>Hello, ${user.username}</h1>
                    <p>Please click the following link to verify your account</p>
                    <a href="${DOMAIN}users/verify-now/${user.verificationCode}">Verify Now</a>
                </div>
            `;

            sendMail(
                user.email,
                "Verify account",
                "Please verify yout account.",
                html,
            );
            return res.status(200).json({
                success: true,
                message: "Hurray, your account is created! Please verify your email address",
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unexpected error ocurred",
            })
        }
    }
);

/**
 * @description To verify new user account by email verification code
 * @api /users/verify-now/:verificationCode
 * @access Public <Only via Email>
 * @type GET
 */
router.get("/verify-now/:verificationCode", async (req, res) => {
    try {
    
        let { verificationCode } = req.params;
        let user = await User.findOne({verificationCode});
        
        if (!user){
            return res.status(401).json({
                success: false,
                message: "Unathorized access. Invalid verification code",
            })
        }

        user.verified = true;
        user.verificationCode = undefined;
        await user.save();
        return res.sendFile(join(__dirname, "../templates/verification-success.html"));
    } catch (err) {
        console.log(`Err:`, err.message);
        return res.sendFile(join(__dirname, "../templates/errors.html"));
    }
});

/**
 * @description To auth an user and get auth token
 * @api /users/api/authenticate
 * @access Public
 * @type POST
 */
router.post("/api/authenticate", AuthenticateValidations, Validator, async (req, res) => {
    try {

        let { username, password } = req.body;
        let user = await User.findOne({ username });

        // validate user and correct password
        if (!user){
            return res.status(404).json({
                success: false,
                message: "Username not found",
            });
        }
        if (!(await user.comparePassword(password))){
            return res.status(404).json({
                success: false,
                message: "Incorrect password",
            });
        }

        let token = await user.generateJWT();

        return res.status(200).json({
            success: true,
            user: user.getUserInfo(),
            token: `Bearer ${token}`,
            message: "Hurray, you are now logged in",
        });


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "An error ocurred",
        })

    }
})

/**
 * @description To get the authenticated user's profile
 * @api /users/api/authenticate
 * @access Private
 * @type GET
 */ 
router.get("/api/authenticate", userAuth,
async (req, res)=>{
    return res.status(200).json({
        user: req.user
    });
});

export default router;
