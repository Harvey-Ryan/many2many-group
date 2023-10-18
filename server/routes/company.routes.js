const express = require("express");
const router = express.Router();
const companyController = require("../controllers//company.controller.js");
const checkPermission = require("../middleware/checkPermission.js");
const verifyUser = require("../middleware/verifyUser.js");


router.post("/", verifyUser, checkPermission('createOwn', 'company'), companyController.addCompany);
router.get("/:id", verifyUser, checkPermission('readOwn', 'company'), companyController.getCompany);
router.put("/:id", verifyUser, checkPermission('updateOwn','company'), companyController.updateCompany);
router.delete("/:id", verifyUser, checkPermission('deleteOwn','company'), companyController.deleteCompany);

module.exports = router;
