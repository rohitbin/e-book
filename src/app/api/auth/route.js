import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    const expectedUsername = 'rohit9090';
    const expectedPassword = 'alpzazzaz';

    if (password !== expectedPassword || username !== expectedUsername) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
