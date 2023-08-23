require("dotenv").config(); // para recibir las constantes de .env

const client_id= process.env.CLIENT_ID

const GetGoogleCredential = (req, res,) =>{
 try{
    return res.status(200).json(client_id);

 }catch(error){
    return res.status(500).json({ message:error});
 }

}

module.exports = GetGoogleCredential