-- Migration: Add gemini_api_key to profiles table
-- Date: 2025-12-14
-- Description: Moves API key storage from localStorage to database for better security and user experience

-- Add gemini_api_key column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS gemini_api_key TEXT;

-- Add comment to document the column
COMMENT ON COLUMN profiles.gemini_api_key IS 'Encrypted Gemini API key for the user. Should be handled securely.';

-- The existing RLS policies already cover this column:
-- ✅ "Users can view own profile" - allows users to SELECT their own gemini_api_key
-- ✅ "Users can update own profile" - allows users to UPDATE their own gemini_api_key
-- No additional RLS policies needed since the column is part of the profiles table

-- Optional: Create an index if you plan to query by API key existence
CREATE INDEX IF NOT EXISTS idx_profiles_has_api_key 
ON profiles ((gemini_api_key IS NOT NULL));

-- Optional: Add a function to safely update API key
CREATE OR REPLACE FUNCTION update_user_api_key(new_api_key TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET gemini_api_key = new_api_key,
      updated_at = NOW()
  WHERE id = auth.uid();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_user_api_key(TEXT) TO authenticated;

COMMENT ON FUNCTION update_user_api_key IS 'Safely updates the Gemini API key for the authenticated user';
