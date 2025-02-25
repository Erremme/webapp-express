const notFound =(req, res) =>{
    return(
    res.status(404).json({
     error:"Not Found",
     message:"Pagina non trovata"
    })
   )
}
module.exports =notFound