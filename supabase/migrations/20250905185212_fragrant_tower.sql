/*
  # Create trips table

  1. New Tables
    - `trips`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)
      - `destination` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `params_json` (jsonb) - stores trip parameters like budget, pace, interests
      - `itinerary_json` (jsonb) - stores the complete itinerary data

  2. Security
    - Enable RLS on `trips` table
    - Add policy for users to read their own trips
    - Add policy for users to insert their own trips
    - Add policy for users to update their own trips
    - Add policy for users to delete their own trips
*/

CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  destination text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  params_json jsonb NOT NULL DEFAULT '{}',
  itinerary_json jsonb NOT NULL DEFAULT '{}'
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Users can read their own trips
CREATE POLICY "Users can read own trips"
  ON trips
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own trips
CREATE POLICY "Users can insert own trips"
  ON trips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own trips
CREATE POLICY "Users can update own trips"
  ON trips
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own trips
CREATE POLICY "Users can delete own trips"
  ON trips
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS trips_user_id_idx ON trips(user_id);
CREATE INDEX IF NOT EXISTS trips_created_at_idx ON trips(created_at DESC);