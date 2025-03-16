import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project details
const SUPABASE_URL = 'https://dfoceqnxrdplfjsawtcc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmb2NlcW54cmRwbGZqc2F3dGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0MDA0ODYsImV4cCI6MjA1Mjk3NjQ4Nn0.8Jzk8pkpsjrkx-u9-Dgoa5osnmo5lCyYreR3fc-RtxQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
