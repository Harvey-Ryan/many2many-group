const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const executeSqlScripts = async () => {
  const sqlFolderPath = path.resolve(__dirname, '../SQL_scripts');
  const sqlFiles = fs.readdirSync(sqlFolderPath);


  const scriptOrder = [
    'CompanyTable.sql', // Ensure this script creates the 'companies' table
    'UsersTable.sql', // Ensure this script creates the 'users' table
    'OpportunityTable.sql',
    'ContactsTable.sql', // Execute other scripts as needed
    // 'OpportunityContactTable.sql',
    // Add more scripts in the desired execution order
  ];

  for (const script of scriptOrder) {
    const filePath = path.join(sqlFolderPath, script);
    const sql = fs.readFileSync(filePath, 'utf-8');
    await sequelize
      .query(sql)
      .then(() => {
        // console.log(`Executed SQL script ${script}`);
      })
      .catch((err) => {
        console.error(`Error while executing SQL script ${script}:`, err);
      });
  }
};

const initializeDatabase = async () => {
  // Import and define the models
  const CompanyModel = require('./../models/company.js');
  const Company = CompanyModel;
  const UserModel = require('./../models/user.js');
  const User = UserModel;
  const ContactModel = require('./../models/contacts.js');
  const Contact = ContactModel;
  const OpportunityModel = require('./../models/opportunity.js');
  const Opportunity = OpportunityModel;
  const OpportunityContactModel = require('./../models/OpportunityContact.js');
  const OpportunityContact = OpportunityContactModel;

  // Define associations
  Company.belongsTo(User, { foreignKey: 'users_id' });
  Company.belongsTo(Contact, { foreignKey: 'contacts_id' });
  Company.belongsTo(Opportunity, { foreignKey: 'opportunities_id' });

  User.belongsTo(Company, { foreignKey: 'companies_id' });
  User.belongsTo(Contact, { foreignKey: 'contacts_id' });
  User.belongsTo(Opportunity, { foreignKey: 'opportunities_id' });

  Contact.belongsTo(Company, { foreignKey: 'companies_id' });
  Contact.belongsTo(User, { foreignKey: 'users_id' });
  Contact.belongsTo(Opportunity, { foreignKey: 'opportunities_id' });

  Opportunity.belongsTo(User, { foreignKey: 'users_id' });
  Opportunity.belongsTo(Contact, { foreignKey: 'contacts_id' });
  Opportunity.belongsTo(Company, { foreignKey: 'companies_id' });

  await sequelize.sync();

  await executeSqlScripts();
};

// Running DB Initialization After Authentication
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected. @@@## init.js ##@@@');
    initializeDatabase(); // Call the initializeDatabase function
  })
  .catch((err) => {
    console.log('Database Connection Error:' + err);
  });

async function startServer() {
  // Any asynchronous setup code can go here
  // Synchronize the models
  await sequelize.sync();

  // Start your server or perform any other setup tasks
}

startServer();

module.exports = {
  sequelize,
  executeSqlScripts,
  initializeDatabase,
};
