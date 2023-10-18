const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db_connections = require("./db/init.js");
const userRoutes = require("./routes/user.routes.js");
const opportunityRoutes = require("./routes/opportunity.routes.js");
const companyRoutes = require("./routes/company.routes.js");
const contactRoutes = require("./routes/contact.routes.js");
const Opportunity = require("./models/opportunity.js");
const OpportunityContact = require("./models/OpportunityContact.js");
const { sequelize } = require("./db/init.js");


require("dotenv").config();

const app = express();
const port = 8081;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test DB
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Database connected...");
//     // Call the setupAssociations function after the database is connected
//     // setupAssociations({ Opportunity });
//   })
//   .catch((err) => console.log("Error:" + err));

app.use("/users", userRoutes);
app.use("/opportunities", opportunityRoutes);
app.use("/company", companyRoutes);
app.use("/contacts", contactRoutes);

app.listen(port, () => {
  console.log("Running...Port: ", port);
});
