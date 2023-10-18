-- Create the OpportunityContacts table if it doesn't exist
CREATE TABLE IF NOT EXISTS OpportunityContact (
    opportunities_id INT,
    contacts_id INT,
    PRIMARY KEY (opportunities_id, contacts_id)
);
