const { Router } = require("express");
const rateLimit = require('express-rate-limit');
const upload = require('../utils/multer/multer'); 
const authMiddleware = require("../security/authMiddleware");
const PutCheckEmail = require("../controllers/Public_Controllers/User/PutCheckEmail");
const GetProjects = require("../controllers/Public_Controllers/Projects/GetProjects");
const PostProjects = require("../controllers/Admin_Controllers/PostProjects");
const GetReviews = require("../controllers/Public_Controllers/Reviews/GetReviews");
const PostReview = require("../controllers/Public_Controllers/Reviews/PostReview");
const GetUsers = require("../controllers/Admin_Controllers/GetUsers");
const PostUser = require("../controllers/Public_Controllers/User/PostUser");
const AuthenticateUser = require("../controllers/Public_Controllers/User/AuthenticateUser");
const GetUserByEmail = require("../controllers/Public_Controllers/User/GetUserByEmail");
const CheckUserDb = require("../controllers/Public_Controllers/User/CheckUserDb");
const SolicitudeProjects = require("../controllers/Public_Controllers/Projects/SolicitudeProjects");
// const DeleteProject = require("../controllers/Admin_controllers/DeleteProject");
const router = Router();

const limiter = rateLimit({
    windowMs: 1000, 
    max: 10, 
    message: 'Demasiadas solicitudes desde esta IP, intente de nuevo más tarde.',
  });

  const limiterPostUser = rateLimit({
    windowMs: 1000, 
    max: 2, 
    message: 'Demasiadas solicitudes desde esta IP, intente de nuevo más tarde.',
  });

//user
router.post("/AuthenticateUser",limiter,AuthenticateUser)
router.post("/PostUser",limiterPostUser, upload.single('picture'),PostUser)
router.post("/CheckUserDb",limiter,CheckUserDb)

//projects
router.get("/GetProjects",limiter,GetProjects)
// reviews
router.get("/GetReviews",limiter,GetReviews)

//routesProtected/////////////////////////////////////////////////////////////////////////////////////
router.use(authMiddleware)
//projects
router.post("SolicitudeProjects",SolicitudeProjects)
// reviews
router.post("/PostReview",PostReview)
//user 
router.get("/GetUserByEmail",GetUserByEmail)
router.put("/VerifyEmail",PutCheckEmail)

//users only administration
router.get("/GetUser",GetUsers)
//projects
router.post("/PostProjects",PostProjects)
// router.delete("/DeleteProject",DeleteProject)


module.exports = router;
