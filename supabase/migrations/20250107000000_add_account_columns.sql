-- Add missing columns to accounts table
ALTER TABLE accounts 
ADD COLUMN account_type VARCHAR(50) DEFAULT 'checking' NOT NULL;

ALTER TABLE accounts 
ADD COLUMN currency VARCHAR(3) DEFAULT 'USD' NOT NULL;
