//Dati del database
const connection = require("../data/db")

//INDEX
const index = (req, res) =>{
    

    const sql = `
    SELECT movies.*, ROUND(AVG(reviews.vote)) AS avg_vote
    FROM movies
    LEFT JOIN reviews ON movies.id = reviews.movie_id 
    GROUP BY movies.id`;

    //lanciare la query
    connection.execute(sql, (err, results) => {
        if(err){
            return res.status(500).json({
                error:"Query Error",
                message:"Database query failed"
            });
        }
        const movies = results.map((movie) => {
            movie.image =`${process.env.BE_URL}/movies/${movie.image}`
            return movie;
         })
        
         res.json(movies);
        
    })   

}

//RecentMovie

const recentMovie = (req , res) =>{
     
    const recentSql = `SELECT *
                    FROM movies
                     where created_at > '2024-12-31 23:59:59'`

 connection.execute(recentSql, (err, results) => {
    if(err){
        return res.status(500).json({
            error:"Query Error",
            message:"Database query failed"
        });
    }
    const movies = results.map((movie) => {
        movie.image =`${process.env.BE_URL}/movies/${movie.image}`
        return movie;
     })
    
     res.json(movies);
    
})  

}

//Show
const show = (req, res) =>{
    const {id} = req.params
    const movieSql = `
    SELECT movies.*,ROUND(AVG(reviews.vote)) AS avg_vote 
    FROM movies
    LEFT JOIN reviews ON movies.id = reviews.movie_id
    WHERE movies.id = ?
    GROUP BY movies.id `;

    //lanciare la query
    connection.execute(movieSql, [id], (err, result) => {
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

        movie.image =`${process.env.BE_URL}/movies/${movie.image}`


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
        
    })
        
        const actors = `SELECT *
                    FROM actors 
                    JOIN movie_actors ON actors.id = movie_actors.actor_id
                    WHERE movie_actors.movie_id = ?`

                    connection.execute(actors, [id], (err, result) => {
                        if(err){
                            return res.status(500).json({
                                error:"Query Error",
                                message:"Database query failed"
                                })
                        }
                         
                        movie.actors= result
            movie.actors =  movie.actors.map((item) => {
                item.image = `${process.env.BE_URL}/movies/actors/${item.image}`;
                return item
            })

        

                        res.json(movie)
                    })
    }) 
    
   

}

//STORE MOVIE
const store = (req , res) => {
    const image = req.file.filename;
   

    const {title, director, genre , release_year , abstract} = req.body
    const sql =`INSERT INTO movies (title, director, genre , release_year , abstract, image) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

     connection.execute(sql, [title, director, genre , release_year , abstract, image], (err, result) => {
        if(err){
             return res.status(500).json({
                 error:"Query Error",
                message:"Database query failed"
            })
        }
                        
        res.status(201).json({id : result.insertId})
    })
     

   
}

//STORE REVIEWS
const storeReview = (req, res) => {
    const {id} = req.params;
    const {name , vote , text} = req.body;

    const sql =`INSERT INTO reviews (movie_id, name, vote, text) VALUES (?, ?, ?, ?)`;

    connection.execute(sql, [id , name, vote, text ], (err, result) => {
        if(err){
            return res.status(500).json({
                error:"Query Error",
                message:"Database query failed"
                })
        }

        
        res.status(201).json({id : result.insertId})
    })
}

//DESTROY
const destroy = (req, res) =>{}

module.exports={index, recentMovie, show, storeReview , store, destroy}