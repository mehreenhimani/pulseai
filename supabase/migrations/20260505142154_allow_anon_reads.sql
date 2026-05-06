/*
  # Allow anonymous reads on all product intelligence tables

  The app queries using the anon key (no auth session), so SELECT policies
  must include the `anon` role in addition to `authenticated`.

  1. Changes
    - Drop existing authenticated-only SELECT policies on all 4 tables
    - Re-create SELECT policies that include both anon and authenticated roles
*/

-- feedback_items
DROP POLICY IF EXISTS "Authenticated users can read feedback_items" ON feedback_items;
CREATE POLICY "Anyone can read feedback_items"
  ON feedback_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- signals
DROP POLICY IF EXISTS "Authenticated users can read signals" ON signals;
CREATE POLICY "Anyone can read signals"
  ON signals FOR SELECT
  TO anon, authenticated
  USING (true);

-- priority_scores
DROP POLICY IF EXISTS "Authenticated users can read priority_scores" ON priority_scores;
CREATE POLICY "Anyone can read priority_scores"
  ON priority_scores FOR SELECT
  TO anon, authenticated
  USING (true);

-- prds
DROP POLICY IF EXISTS "Authenticated users can read prds" ON prds;
CREATE POLICY "Anyone can read prds"
  ON prds FOR SELECT
  TO anon, authenticated
  USING (true);
