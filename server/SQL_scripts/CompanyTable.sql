CREATE TABLE IF NOT EXISTS "companies" (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO companies (company_name, created_at, updated_at)
VALUES 
('Acme', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kizer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Waystar', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (company_name) DO NOTHING;




