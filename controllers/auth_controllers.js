// import { Client, Account,ID } from "appwrite";
import sdk from "node-appwrite";
import {Client,Account,ID,Functions} from "appwrite"

const clientServer = new sdk.Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('6586f950009ee7b0ca43')              // Your project ID
    .setKey("bcfc3d723213e2c86b82a1ac0ee0a14678b78419d095ceba58ea02b16504906d82675694ec3bbc8b1d12705bae4b7ac6440e6898c3da771ab97933bfe88dcec76fe04d8cf7f0bcb871dcbae42c355f311d47f320c73154301fb3724d47f1259686dbdf6d046ab3414fc0ab924e69c65b8b37002c4daea4d775b392389e14efbd")
const accountServer = new sdk.Account(clientServer);

const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
.setProject('6586f950009ee7b0ca43')              // Your project ID

const account = new Account(client);
const functions = new Functions(client)
// console.log("Client: ", client);
// console.log("Account: ", account);

// login and create new session
export const loginWithEmailPassword= async(email,password) =>{
    try {
        const response = await account.createEmailSession(email, password);
        console.log(response); // Success
        return response;
    } catch (error) {
        console.log(error); // Failure
        throw error;
    }
    
}

// create new account
export const createAccount = async (email, password, name) => {
    try {
        const response = await account.create(ID.unique(), email, password, name);
        console.log(response); // Success
        return response;
    } catch (error) {
        console.log(error); // Failure
        throw error;
    }
};

export const createNewVerification = async () => {
    try {
        const response = await account.createVerification('https://localhost:3000/verifyemail');
        console.log(response); // Success
        return response;
    }
    catch (error) {
        console.log(error); // Failure
        throw error;
    }
}

// complete verification mail to user (client)
export const updateVerification = async (userId, secret) => {
    try{
       const response=await account.updateVerification(userId, secret);
         console.log(response); // Success
            return response;
    }
    catch(error){
        console.log(error); // Failure
        throw error;
    }
}

// logout
export const logout =async () =>{
    try{
        const response = await account.deleteSession('65891a6e381e07d4d34f');
        console.log(response); // Success
        return response;
    }
    catch(error){
        console.log(error); // Failure
        throw error;
    }
}

// get current session
export const getCurrentSession = async (sessionId) => {
    try {
        const response = await account.getSession(sessionId);
        console.log(response); // Success
        return response;
    } catch (error) {
        console.log(error); // Failure
        throw error;
    }
};
export const deleteCurrentSession = async (sessionId) => {
    try {
        const response = await account.deleteSession(sessionId);
        console.log(response); // Success
        return response;
    } catch (error) {
        console.log(error); // Failure
        throw error;
    }
};


// create new account with OAuth2 Google
export const continueWithGoogle = (req,res) =>{
    const {code} = req.body;
    const promise = account.createOAuth2Session('google', code);
    promise.then(function (response) {
        console.log(response); // Success
    }, function (error) {
        console.log(error); // Failure
    });
    res.send("Create new account with OAuth2 Google")
}

// execute a cloud funtion in client
export const executeCloudFunction = async () => {
    
    try {
        const execution = await functions.createExecution(
            '658c63c6f33e70d6308a',
            JSON.stringify({ 'foo': 'bar' }),
            false,
            '/test',
            'POST',
            { 'X-Custom-Header': '123' }
        )
        console.log(execution)
        return execution.responseBody;
    } catch (err) {
        console.error(err.message)
        throw err;
    }
};

// server
// recover password with email in server
export const sendPasswordResetMail =async (email)=>{
    try{
    const response = await accountServer.createRecovery(email,'https://localhost:3000/recovery');
    console.log(response); // Success
    return response;
    }
    catch(error){
        console.log(error); // Failure
        throw error;
    }
}

// update password in server
export const updatePassword = async (userId, secret, password,password_confirm) => {
    try {
        const response = await accountServer.updateRecovery(userId, secret, password,password_confirm);
        console.log(response); // Success
        return response;
    } catch (error) {
        console.log(error); // Failure
        throw error;
    }
};