
import { createClient } from '@supabase/supabase-js';

// Test environment keys - FOR TESTING PURPOSES ONLY
// Replace with proper environment variable handling in production
const supabaseUrl = 'https://kaggqumvqjllbvmeaxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZ2dxdW12cWpsbGJ2bWVheHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzg3NjIsImV4cCI6MjA1NjgxNDc2Mn0.TM-WQHICL8cSKollAaNlCBijx44xHbcddmROShkPu2g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
