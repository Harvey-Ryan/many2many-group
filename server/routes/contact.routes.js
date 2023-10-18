const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller.js");
const checkPermission = require("../middleware/checkPermission.js");
const verifyUser = require("../middleware/verifyUser.js");

router.get("/user/:id", verifyUser, checkPermission('readOwn', 'contact'), contactController.getAllContacts);
router.get("/company/:id", verifyUser, checkPermission('readOwn', 'contact'), contactController.getAllContactsByCompany);
router.get("/company/:id/opportunity/:opportunity_id", verifyUser, checkPermission('readOwn', 'contact'), contactController.getAllContactsByCompanyAndOpportunity);
router.get("/:id", verifyUser, checkPermission('readOwn', 'contact'), contactController.getContact);
router.post("/create", verifyUser, checkPermission('createOwn', 'contact'), contactController.createContact);
router.put("/:id", verifyUser, checkPermission('updateOwn', 'contact'), contactController.updateContact);
router.post("/:id/join", verifyUser, checkPermission('createOwn', 'contact'), contactController.joinContactToOpportunity);
router.delete("/:id", verifyUser, checkPermission('deleteOwn', 'contact'), contactController.deleteContact);

module.exports = router;