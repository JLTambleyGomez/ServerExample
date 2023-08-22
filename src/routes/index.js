const { Router } = require("express");
const rateLimit = require('express-rate-limit');
const multer = require('multer'); 
const authMiddleware = require("../security/authMiddleware");
const PostJob = require("../controllers/Public_Controllers/Jobs/PostJob")
const PutJob = require("../controllers/Public_Controllers/Jobs/PutJob")
const DeleteJob = require("../controllers/Public_Controllers/Jobs/DeleteJob")
const GetJobs = require("../controllers/Public_Controllers/Jobs/GetJobs")
const PutCheckEmail = require("../controllers/Public_Controllers/User/PutCheckEmail");
const GetUsers = require("../controllers/Admin_Controllers/GetUsers");
const PostUser = require("../controllers/Public_Controllers/User/PostUser");
const PutUser = require("../controllers/Public_Controllers/User/PutUser");
const DeleteUser = require("../controllers/Public_Controllers/User/DeleteUser");
const AuthenticateUser = require("../controllers/Public_Controllers/User/AuthenticateUser");
const GetUserByEmail = require("../controllers/Public_Controllers/User/GetUserByEmail");
const CheckUserDb = require("../controllers/Public_Controllers/User/CheckUserDb");
const ReSendEmail = require("../controllers/Public_Controllers/User/ReSendEmail");
// const DeleteProject = require("../controllers/Admin_controllers/DeleteProject");

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
router.put("/PutCheckEmail",limiter,PutCheckEmail)


//routesProtected/////////////////////////////////////////////////////////////////////////////////////
router.use(authMiddleware)
//user 
router.put("/PutUser",limiter,upload.single('picture'),PutUser)
router.get("/GetUserByEmail",GetUserByEmail)
router.post("/ReSendEmailVerification",limiter,ReSendEmail)
router.delete("/DeleteUser",DeleteUser)
//jobs
router.post("/PostJob",upload.single('picture'),PostJob)
router.get("/GetJob",limiter,GetJobs)
router.put("/PutJob",limiter,PutJob)
router.delete("/DeleteJob/:jobId",limiter, DeleteJob);



//users only administration
router.get("/GetUser",GetUsers)
//projects
// router.delete("/DeleteProject",DeleteProject)


module.exports = router;
