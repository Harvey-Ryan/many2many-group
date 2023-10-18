const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const verifyUser = require("../middleware/verifyUser.js");
const checkPermission = require("../middleware/checkPermission.js");



router.get("/", verifyUser, checkPermission('readOwn','company'), userController.getHome);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/:company_id", verifyUser, checkPermission('readOwn','company'), userController.getAllUsersByCompany);
router.put("/update/:id", verifyUser, checkPermission('update','user'), userController.updateUser);
router.delete("/delete/:id", verifyUser, checkPermission('deleteOwn','user'), userController.deleteUser);


module.exports = router;
