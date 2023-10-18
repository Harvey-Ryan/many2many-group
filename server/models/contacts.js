const Opportunity = require("./opportunity.js");
const Company = require("./company.js");
const User = require("./user.js");
const OpportunityContact = require("./OpportunityContact.js");
const { Model, DataTypes } = require("sequelize");
const {sequelize} = require("./../db/init.js");

class Contact extends Model { }

    Contact.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            cell_phone: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true,
                    isNumeric: true,
                },
                // unique: true,
            },
            work_phone: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true,
                    isNumeric: true,
                },
                // unique: true,
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true,
                    isEmail: true,
                },
                // unique: true,
            },
            // user_id: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false,
            //     references: {
            //         model: User,
            //         key: "id",
            //     },
            //     validate: {
            //         notEmpty: true,
            //     },
            // },
            // company_id: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false,
            //     references: {
            //         model: Company,
            //         key: "id",
            //     },
            // },
            company_title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        }, {
        sequelize,
        schema: "public",
        modelName: "Contacts",
        timestamps: true,
        underscored: true,
    });

    // // Define the many-to-many association with the join table name 'OpportunityContact'
    // Contact.belongsToMany(Opportunity, {
    //     through: OpportunityContact, // Use the OpportunityContact model
    //     foreignKey: 'contact_id',   // Define the foreign key that links to Contact
    //     otherKey: 'opportunity_id',  // Define the foreign key that links to Opportunity
    // });

module.exports = Contact;


