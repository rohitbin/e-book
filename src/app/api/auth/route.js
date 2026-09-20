import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    const { data: userRow } = await supabase.from('settings').select('value').eq('key', 'adminUsername').single();
    const { data: passRow } = await supabase.from('settings').select('value').eq('key', 'adminPassword').single();
    
    const expectedUsername = userRow?.value || 'admin';
    const expectedPassword = passRow?.value;

    if (!expectedPassword || password !== expectedPassword || username !== expectedUsername) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
