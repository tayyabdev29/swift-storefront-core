import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wqqrexhxftljvbcmdwka.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcXJleGh4ZnRsanZiY21kd2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMzU3MjIsImV4cCI6MjA1MzkxMTcyMn0.a7V1Ue3jtTDVhfA9RFQD-7U1I4BmGppAo0YF_lLwP1I";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
