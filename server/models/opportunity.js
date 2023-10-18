const User = require("./user.js");
const Contact = require("./contacts.js");
const Company = require("./company.js");
const {sequelize} = require("../db/init.js");
const { Model, DataTypes } = require("sequelize");

class Opportunity extends Model {}

Opportunity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    // user_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: User,
    //     key: "id",
    //   },
    //   validate: {
    //     notEmpty: true,
    //   },
    // },
    opportunity_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    pot_rev: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    chance_of_winning: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "Identified",
    },
    // company_id: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: Company, // Assuming you have a model named "Company"
    //     key: "id",
    //   },
    //   allowNull: true,
    // },
    // contact_id: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: Contact, // Corrected model name
    //     key: "id",
    //   },
    //   allowNull: true,
    // },
    opportunity_win_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    schema: "public",
    modelName: "Opportunities",
    timestamps: true,
    underscored: true,
  }
);

// Opportunity.belongsTo(User, {
//   foreignKey: "user_id",
// });

// // Define the many-to-many association with the join table name 'OpportunityContact'
// Opportunity.belongsToMany(Contact, { through: 'OpportunityContact' });
// Opportunity.belongsToMany(Company, { through: 'OpportunityCompany' });
// Opportunity.belongsToMany(User, { through: 'OpportunityUser' });

module.exports = Opportunity;
