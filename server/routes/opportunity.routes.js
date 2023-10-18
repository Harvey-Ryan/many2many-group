const express = require("express");
const router = express.Router();
const opportunityController = require("../controllers/opportunity.controller.js");
const checkPermission = require("../middleware/checkPermission.js");
const verifyUser = require ("../middleware/verifyUser.js");


router.get("/company/:id", verifyUser, checkPermission('readAny', 'opportunity'), opportunityController.getAllOpportunities);
router.get("/contact/:id", verifyUser, checkPermission('readOwn', 'opportunity'), opportunityController.getOpportunitiesByContactId);
router.get("/:id", verifyUser, checkPermission('readAny', 'opportunity'), opportunityController.getOpportunityById);
router.post("/create", verifyUser, checkPermission('createOwn', 'opportunity'), opportunityController.createOpportunity);
router.put("/:id", verifyUser, checkPermission('updateAny', 'opportunity'), opportunityController.updateOpportunity);
router.delete("/:id", verifyUser, checkPermission('deleteOwn', 'opportunity'), opportunityController.deleteOpportunity);

module.exports = router;
