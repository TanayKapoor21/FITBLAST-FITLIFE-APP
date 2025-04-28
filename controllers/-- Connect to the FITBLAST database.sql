-- Connect to the FITBLAST database
-- Replace placeholders with your actual database credentials

USE FITBLAST;

-- Verify connection by listing tables
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE';