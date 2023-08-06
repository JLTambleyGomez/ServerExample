 const nodemailer = requiere("nodemailer");
 require('dotenv').config();

 const Solicitate = (req, res)=>{
    const {email, message }= req.body;

    const {OFFICIAL_EMAIL, PASSWORD} = process.env

    try{
        var transtorpe= nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            secure:true, 
            auth:{
                user:OFFICIAL_EMAIL,
                pass: PASSWORD 
            }
        })
    
        const sender ={
            from:"yo",
            to: email,
            subject:"notificacion de: Nuestra pagina",
            text: `Ha solicitado nuestro servicio y le contestaremos lo mas pronto posible, si tiene alguna duda consulte a ${OFFICIAL_EMAIL}`
        }
        const service ={
            from:"yo",
            to: OFFICIAL_EMAIL,
            subject:"notificacion de: Nuestra pagina",
            text:`${message}, solicitud enviada por ${email}`
        }
    
        transtorpe.sendMail( sender , (error, info)=>{
            if(error){
                res.status(500).send(error.message)
            }else{
                console.log("se ha enviado")
            }
        }
        )

        transtorpe.sendMail(service , (error, info)=>{
            if(error){
                res.status(500).send(error.message)
            }else{
                console.log("se ha enviado")
            }
        }
        )
    }catch( Error){

    }
 };

 module.exports= Solicitate