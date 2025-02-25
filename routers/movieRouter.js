const express = require("express")
const router = express.Router()
const movieController = require("../controllers/movieController")

//Index
router.get("/", movieController.index);

//Show
router.get("/:id", movieController.show);

//Destroy
router.delete("/:id", movieController.destroy);



module.exports = router

