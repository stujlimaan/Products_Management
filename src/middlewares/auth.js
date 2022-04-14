const jwt =require("jsonwebtoken")

const authentication=(req,res,next)=>{
    try{
        const token=req.header('Authorization', 'Bearer Token')
        if(!token){
            return res.status(403).send({status:false,message:"please provide token"})
        }
        const tokenWithout=token.split(" ")[1]
        console.log(tokenWithout)

        const decodeToken=jwt.verify(tokenWithout,"tujliman",(err)=>{
            if(err){
       return res.status(401).send({status:false,message:`token invalid ${err.message}`})

            }else{
                       next()
         }
        })
       


    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

const authorization=(req,res,next)=>{
    try{
        const token=req.header('Authorization', 'Bearer Token');

        if(!token){
            return res.status(403).send({status:false,message:"please provide token"})
        }
        const decodedToken=jwt.verify(token,"tujliman")
        const decodedTokenFromUserId=decodedToken.userId;
        req.userId=decodedTokenFromUserId
        next();

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

module.exports={authentication,authorization}