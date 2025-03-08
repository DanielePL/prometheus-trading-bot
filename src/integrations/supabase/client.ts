
import { createClient } from '@supabase/supabase-js';

// These environment variables are automatically loaded by Vite from .env files
const supabaseUrl = 'https://kaggqumvqjllbvmeaxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZ2dxdW12cWpsbGJ2bWVheHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzg3NjIsImV4cCI6MjA1NjgxNDc2Mn0.TM-WQHICL8cSKollAaNlCBijx44xHbcddmROShkPu2g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
