/*
  # Visa Benefit Buddy Schema

  1. New Tables
    - `uploaded_documents`
      - `id` (uuid, primary key)
      - `filename` (text) - Original filename of uploaded PDF
      - `file_size` (bigint) - File size in bytes
      - `content` (text) - Extracted text content from PDF
      - `uploaded_at` (timestamptz) - Upload timestamp
      - `user_session` (text) - Session identifier for demo purposes
    
    - `benefit_queries`
      - `id` (uuid, primary key)
      - `card_number_masked` (text) - Masked card number
      - `location` (text) - Location context
      - `language` (text) - Selected language
      - `query` (text) - User's benefit query
      - `benefit_response` (jsonb) - Structured benefit response
      - `reasoning_log` (text[]) - Agent reasoning steps
      - `created_at` (timestamptz) - Query timestamp
      - `user_session` (text) - Session identifier

  2. Security
    - Enable RLS on both tables
    - Allow public access for demo purposes (hackathon context)
*/

CREATE TABLE IF NOT EXISTS uploaded_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_size bigint NOT NULL,
  content text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  user_session text NOT NULL
);

CREATE TABLE IF NOT EXISTS benefit_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_number_masked text NOT NULL,
  location text NOT NULL,
  language text NOT NULL DEFAULT 'English',
  query text NOT NULL,
  benefit_response jsonb,
  reasoning_log text[],
  created_at timestamptz DEFAULT now(),
  user_session text NOT NULL
);

ALTER TABLE uploaded_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefit_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to uploaded_documents for demo"
  ON uploaded_documents FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to benefit_queries for demo"
  ON benefit_queries FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_uploaded_documents_session ON uploaded_documents(user_session);
CREATE INDEX IF NOT EXISTS idx_benefit_queries_session ON benefit_queries(user_session);
