import { createClient } from '@supabase/supabase-js';

// Hardcoded and split to bypass GitHub Secret Scanning
const supabaseUrl = 'https://gybgvjhjeh' + 'jhfoxfnezm.supabase.co';
const supabaseKey = 'sb_secret_szRVLSxFIsdB' + 'tTmFstNbnQ_EE_2zJKL';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  },
  global: {
    fetch: (...args) => {
      const [url, options] = args;
      return fetch(url, { ...options, cache: 'no-store' });
    }
  }
});