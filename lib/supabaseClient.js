// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPA_URL;
const supabaseKey = process.env.SUPA_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
