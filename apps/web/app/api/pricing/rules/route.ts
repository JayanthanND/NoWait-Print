import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Fetch all needed rules in parallel
    const [rulesRes, bindingsRes, papersRes, gsmsRes] = await Promise.all([
      supabase.from('pricing_rules').select('*'),
      supabase.from('binding_options').select('*'),
      supabase.from('paper_types').select('*'),
      supabase.from('gsm_options').select('*')
    ]);

    if (rulesRes.error) throw rulesRes.error;

    return NextResponse.json({
      rules: rulesRes.data,
      bindingOptions: bindingsRes.data,
      paperTypes: papersRes.data,
      gsmOptions: gsmsRes.data
    });
  } catch (error) {
    console.error('Failed to fetch pricing rules:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing rules' }, { status: 500 });
  }
}
