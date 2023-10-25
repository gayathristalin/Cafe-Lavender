import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mgxmxlcvsnutatdywaqc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1neG14bGN2c251dGF0ZHl3YXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMyODk2ODIsImV4cCI6MjAwODg2NTY4Mn0.2zmIfe1DVkaAiennF8HyY7qfX0EXEd9fO9sLERh_URs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
