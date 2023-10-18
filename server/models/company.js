const { Model, DataTypes } = require("sequelize");
const {sequelize} = require("../db/init.js");
const User = require("./user.js");
const Contact = require("./contacts.js");
const Opportunity = require("./opportunity.js");


class Company extends Model { }

  Company.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      company_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      schema: "public",
      modelName: "Companies",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  module.exports = Company;

