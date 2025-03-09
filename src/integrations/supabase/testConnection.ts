
import { supabase } from './client';

/**
 * Tests the connection to Supabase by inserting a test record and then retrieving it
 * @returns An object containing the test result and status message
 */
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}> => {
  try {
    // Generate a unique test ID
    const testId = `connection-test-${new Date().toISOString()}`;
    
    console.log('Testing Supabase connection...');
    
    // Step 1: Insert a test record
    const { data: insertData, error: insertError } = await supabase
      .from('connection_tests')
      .insert({
        test_name: testId,
        status: 'testing'
      })
      .select();
    
    if (insertError) {
      console.error('Supabase connection test failed during insert:', insertError);
      return {
        success: false,
        message: `Insert failed: ${insertError.message}`,
        error: insertError
      };
    }
    
    console.log('Supabase test record inserted successfully');
    
    // Step 2: Retrieve the inserted record
    const { data: selectData, error: selectError } = await supabase
      .from('connection_tests')
      .select('*')
      .eq('test_name', testId)
      .maybeSingle();
    
    if (selectError) {
      console.error('Supabase connection test failed during retrieve:', selectError);
      return {
        success: false,
        message: `Retrieve failed: ${selectError.message}`,
        error: selectError
      };
    }
    
    if (!selectData) {
      console.error('Supabase connection test: No data found after insert');
      return {
        success: false,
        message: 'Test record was not found after insertion'
      };
    }
    
    console.log('Supabase connection test successful');
    
    return {
      success: true,
      message: 'Connection to Supabase is working properly',
      data: selectData
    };
    
  } catch (error) {
    console.error('Unexpected error during Supabase connection test:', error);
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      error
    };
  }
};

/**
 * Gets all test connection records from Supabase
 * @returns An array of connection test records
 */
export const getConnectionTests = async () => {
  const { data, error } = await supabase
    .from('connection_tests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error('Error retrieving connection tests:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};
