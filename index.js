import express from "express"
import cors from "cors"
import { loginWithEmailPassword,createAccount ,logout,getCurrentSession,updatePassword,sendPasswordResetMail, updateVerification,executeCloudFunction} from "./controllers/auth_controllers.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(express.static("public"))

// server home
app.get("/", (req, res) => {
    res.render("index")
})

// client login
app.post("/login", async(req, res) => {
    const { email, password } = req.body;
    try{
        const result = await loginWithEmailPassword(email, password); // Wait for loginWithEmailPassword function to complete
        res.send(result);
    }catch(e){
        res.status(400).send(e);
    }
})

// client register
app.post("/register", async (req, res) => {
    const { email, password, name } = req.body;
    console.log(email, password, name);
    try {
        const result = await createAccount(email, password, name); // Wait for createAccount function to complete
        res.send(result);
    } catch (err) {
        res.status(400).send(err);
    }
});

// verify email address
app.post("/verifymail", async (req, res) => {
    const { userId, secret } = req.body;
    try {
        const result = await account.updateVerification(userId, secret); // Wait for updateVerification function to complete
        res.send(result);
    } catch (err) {
        res.status(400).send(err);
    }
});


app.post("/session", async(req, res) => {
    const sessionId=req.body.sessionId;
    try{
        const result = await getCurrentSession(sessionId); // Wait for currentSession function to complete
        res.send(result);
    }catch(e){
        res.status(400).send(e);
    }
})

app.post("/logout", async(req, res) => {
    const { sessionId } = req.body;
    try{
        const result = await logout(); // Wait for logout function to complete
        res.send(result);
    }catch(e){
        res.status(400).send(e);
    }
})

app.get("/recovery", (req, res) => {
    const {userId,secret}=req.query;
    console.log("userId",userId);
    console.log("secret",secret);
    res.render("reset_password",{userId,secret,message:""});
});

app.post("/reset_password", async (req, res) => {
    const { userId, secret, password, password_confirm } = req.body;

    if (password !== password_confirm) {
        res.render("reset_password",{userId,secret, message:"Passwords do not match."});
    }

    try {
        const result = await  updatePassword(userId,secret,password,password_confirm); // Wait for updatePassword function to complete
        console.log(result);
        res.render("template",{title:"Password Reset", message:"Your password has been reset successfully."});
    } catch (err) {
        res.render("template",{title:"Password Reset Failed", message:"Your password reset failed."});
    }
});

app.get("/verify",async(req,res)=>{
    const {userId,secret}=req.query;
    console.log("userId",userId);
    console.log("secret",secret);

    try{
        const result = await updateVerification(userId, secret); // Wait for updateVerification function to complete
        console.log(result);
        res.render("template",{title:"Verification Complete", message:"Your email address has been verified successfully."});
    }
    catch(e){
        res.render("template",{title:"Verification Failed", message:"Your email address verification failed."});
    }
})

// success or failure status
app.get("/success", (req, res) => {
    res.render("template",{title:"Success", message:"Your request has been completed successfully."});
});

app.get("/failure", (req, res) => {
    res.render("template",{title:"Failure", message:"Your request has failed."});
});

// run function
app.get("/run", async (req, res) => {
    const { functionName, functionData } = req.query;
    try {
        const result = await executeCloudFunction(); // Wait for executeCloudFunction function to complete
        res.send(result);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
