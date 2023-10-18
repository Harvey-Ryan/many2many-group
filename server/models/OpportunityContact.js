const { Model, DataTypes } = require("sequelize");
const {sequelize} = require("../db/init.js");


    class OpportunityContact extends Model { }

    OpportunityContact.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            opportunityId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "opportunities", // Make sure to use the correct model name
                    key: "id",
                },
                allowNull: false,
            },
            contactId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "contacts", // Make sure to use the correct model name
                    key: "id",
                },
                allowNull: false,
            },
        },
        {
            sequelize,
            schema: "public",
            modelName: "OpportunityContact", // Model name for the join table
            timestamps: false, // You don't need timestamps in a join table
            underscored: true,
        }
    );

    // Define any additional methods or associations here

module.exports = OpportunityContact;
