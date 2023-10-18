const Opportunity = require ("../models/opportunity.js");
const User = require ("../models/user.js");
const Contact = require ("../models/contacts.js");

const opportunityController = {
  getAllOpportunities: async (req, res) => {
    try {
      const opportunities = await Opportunity.findAll({
        include: [
          // Include the associated contacts
          { model: Contact, as: 'Contacts' }
        ]
      });

      return res.json({ opportunities });
    } catch (error) {
      console.error("Error occurred:", error);
      return res.status(500).json({ error: "Failed to retrieve opportunities" });
    }
  },

  getOpportunityById: async (req, res) => {
    try {
      const opportunity = await Opportunity.findByPk(req.params.id);
      if (!opportunity)
        return res.status(404).json({ error: "Opportunity not found" });
      return res.json({ opportunity });
    } catch (error) {
      console.error("Error occurred:", error);
      return res.status(500).json({ error: "Failed to retrieve opportunity" });
    }
  },

  // Get all opportunities associated with a contact
  getOpportunitiesByContactId: async (req, res) => {
    try {
      const contactId = req.params.id;
      const opportunities = await Opportunity.findAll({ where: { contact_id: contactId } });
      return res.json({ opportunities });
    } catch (error) {
      console.error("Error occurred:", error);
      return res
      .status(500)
      .json({ error: "Failed to retrieve opportunities" });
    }
  },

  createOpportunity: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
  
      if (!user || !user.company_id) {
        return res.status(400).json({ error: "User not associated with a company" });
      }
  
      // Create the new opportunity with the company_id = require the user
      const newOpportunity = await Opportunity.create({
        ...req.body,
        company_id: user.company_id,
      });
  
      // If contacts are provided in the request, associate them with the opportunity.
      if (req.body.contacts) {
        await newOpportunity.addContacts(req.body.contacts); // Assuming you have a method like this.
      }
  
      return res.status(201).json({ newOpportunity });
    } catch (error) {
      console.error("Error occurred during creation:", error);
      return res.status(500).json({ error: "Failed to create opportunity" });
    }
  },
  

  updateOpportunity: async (req, res) => {
    try {
      const opportunity = await Opportunity.findByPk(req.params.id);
      if (!opportunity) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
  
      // Update opportunity data
      await opportunity.update(req.body);
  
      // If contacts are provided in the request, update the associations.
      if (req.body.contacts) {
        await opportunity.setContacts(req.body.contacts); // Assuming you have a method like this.
      }
  
      return res.json({ opportunity });
    } catch (error) {
      console.error("Error occurred during update:", error);
      return res.status(500).json({ error: "Failed to update opportunity" });
    }
  },

  deleteOpportunity: async (req, res) => {
    try {
      const opportunity = await Opportunity.findByPk(req.params.id);
      if (!opportunity)
        return res.status(404).json({ error: "Opportunity not found" });
      await opportunity.destroy();
      return res.json({ message: "Opportunity deleted" });
    } catch (error) {
      console.error("Error occurred during deletion:", error);
      return res.status(500).json({ error: "Failed to delete opportunity" });
    }
  },
};

module.exports = opportunityController;
