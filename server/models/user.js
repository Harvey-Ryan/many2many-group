const dotenv = require("dotenv");
const Company = require("./company.js");
const Opportunity = require("./opportunity.js");
const Contact = require("./contacts.js");
const { Model, DataTypes } = require("sequelize");
const {sequelize} = require("../db/init.js");
const Sequelize = require("sequelize");
dotenv.config();

class User extends Model {}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    // company_id: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: "Company",
    //     key: "id",
    //   },
    //   allowNull: true,
    // },
    role: {
      type: DataTypes.ENUM("admin", "user", "superAdmin"), // Include all possible values
      defaultValue: "user",
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100],
      },
    },
  },
  {
    sequelize,
    schema: "public",
    modelName: "Users",
    timestamps: true,
    underscored: true,
  }
);

module.exports = User;
