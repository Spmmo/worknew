// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xeykzyxmvkycocnyhahk.supabase.co';  // ← เปลี่ยนตรงนี้
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleWt6eXhtdmt5Y29jbnloYWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNjk5NTYsImV4cCI6MjA4Njk0NTk1Nn0.oHX1G2GSeTU2JN4o1aFGU1EX48eeWYjE5WIwaM8JqFI';                // ← เปลี่ยนตรงนี้

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);