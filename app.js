const express = require('express')
const cors = require('cors')
const notFound = require("./middlewares/notFound")
const handleErrors = require("./middlewares/handleErrors")
//Routes
const moviesRouter = require("./routers/movieRouter")

const app = express()
//Destrutturazzione variabili di ambiente
const { PORT , FE_URL } = process.env;


//Cors
app.use(cors({
    origin: FE_URL,
}))

//Middlewares Globali
app.use(express.static('public'));

//Middleware per parsing di req.body
app.use(express.json())

// Rotte
app.use("/movies" , moviesRouter);

//Middlewares Gestione degli errori (404,500)
app.use(notFound)

app.use(handleErrors)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})