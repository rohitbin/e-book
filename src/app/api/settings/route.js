import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabase.from('settings').select('key, value');
    if (error) throw error;
    
    const settings = {};
    for (const row of data || []) {
      settings[row.key] = row.value;
    }

    // Don't send the admin password to the client unless they are authenticated, 
    // but for simplicity in GET (which is public for the sales page), we omit it.
    const { adminPassword, ...publicSettings } = settings;
    return NextResponse.json(publicSettings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Simple authentication
    const expectedUsername = 'rohit9090';
    const expectedPassword = 'alpzazzaz';

    if (body.password !== expectedPassword || body.username !== expectedUsername) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allowedKeys = [
      'bookTitle', 'bookSubtitle', 'price', 'upiId', 'whatsappNumber',
      'instagramId', 'brandName', 'email', 'refundPolicy', 'privacyPolicy', 'terms'
    ];
    
    const updates = [];
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        updates.push({ key, value: String(body[key]) });
      }
    }
    
    if (updates.length > 0) {
      const { error: updateError } = await supabase.from('settings').upsert(updates);
      if (updateError) throw updateError;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
