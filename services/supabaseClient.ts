import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cjnxmiiymcwhxvkdhqwp.supabase.co';
const supabaseKey = 'sb_publishable__Qx8BMqta8ubjA24OlfzXg_ev_y6fAt';

export const supabase = createClient(supabaseUrl, supabaseKey);
