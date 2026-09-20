import { NextResponse } from 'next/server';
import path from 'path';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type'); // 'qrCode' or 'bookCover'
    const password = formData.get('password');
    const username = formData.get('username');

    const { data: userRow } = await supabase.from('settings').select('value').eq('key', 'adminUsername').single();
    const { data: passRow } = await supabase.from('settings').select('value').eq('key', 'adminPassword').single();
    
    const expectedUsername = userRow?.value || 'admin';
    const expectedPassword = passRow?.value;

    if (!expectedPassword || password !== expectedPassword || username !== expectedUsername) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!file || !type) {
      return NextResponse.json({ error: 'File and type are required' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }
    
    const filename = `${type}-${Date.now()}${ext}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage bucket named 'uploads'
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('uploads')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filename);
    const publicUrl = urlData.publicUrl;

    // Save path to settings
    const { error: updateError } = await supabase.from('settings').upsert({ key: type, value: publicUrl });
    if (updateError) throw updateError;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
