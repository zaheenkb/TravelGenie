// CORS headers for Edge Functions
// For production, replace '*' with specific domains like 'https://yourdomain.com'
// and add your WebContainer preview domain
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};