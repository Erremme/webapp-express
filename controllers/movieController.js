//Dati del database
const connection = require("../data/db")

//INDEX
const index = (req, res) =>{
    const sql = "SELECT * FROM movies";

    //lanciare la query
    connection.execute(sql, (err, result) => {
        if(err){
            return res.status(500).json({
                error:"Query Error",
                message:"Database query failed"
            })
        }
        res.json(result);
    })


}

//Show
const show = (req, res) =>{
    const {id} = req.params
    const sql = `SELECT *  
                FROM movies
                WHERE id = ?`;

    //lanciare la query
    connection.execute(sql, [id], (err, result) => {
        if(err){
            return res.status(500).json({
                error:"Query Error",
                message:"Database query failed"
            })
        }

        
        const movie = result[0]

        if(!movie){
            return res.status(404).json({
                error: "not found",
                message:"movie not found"
            })
        }

        const reviewsSql = `SELECT *
                        FROM reviews
                        WHERE movie_id= ?`

    connection.execute(reviewsSql, [id], (err, result) => {
        if(err){
            return res.status(500).json({
                error:"Query Error",
                message:"Database query failed"
                })
        }

        movie.reviews= result
        res.json(movie)
    })
        
    })   

}

//INDEX
const destroy = (req, res) =>{}

module.exports={index, show, destroy}