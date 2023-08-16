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
const PutUser = require("../controllers/Public_Controllers/User/PutUser");
const AuthenticateUser = require("../controllers/Public_Controllers/User/AuthenticateUser");
const GetUserByEmail = require("../controllers/Public_Controllers/User/GetUserByEmail");
const CheckUserDb = require("../controllers/Public_Controllers/User/CheckUserDb");
const SolicitudeProjects = require("../controllers/Public_Controllers/Projects/SolicitudeProjects");
const ReSendEmail = require("../controllers/Public_Controllers/User/ReSendEmail");
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
router.put("/PutCheckEmail",limiter,PutCheckEmail)

//routesProtected/////////////////////////////////////////////////////////////////////////////////////
router.use(authMiddleware)
//projects
router.post("/SolicitudeProjects",limiter,SolicitudeProjects)
// reviews
router.post("/PostReview",PostReview)
//user 
router.put("/PutUser",limiter,upload.single('picture'),PutUser)
router.get("/GetUserByEmail",GetUserByEmail)
router.post("/ReSendEmailVerification",limiter,ReSendEmail)

//users only administration
router.get("/GetUser",GetUsers)
//projects
router.post("/PostProject",upload.single('picture'),PostProjects)
// router.delete("/DeleteProject",DeleteProject)


module.exports = router;
