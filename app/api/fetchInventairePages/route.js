import { supabase } from '@/lib/supabaseClient';
import { NextResponse} from 'next/server';


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const db_name = searchParams.get('db_name');
    const DB_TABLE=`${db_name}_pages_pred`;
    console.log(DB_TABLE)
    
    const { data, error } = await supabase
      .from(DB_TABLE)
      .select('*')
      .eq('tag',`${process.env.TAG}`)
      .order('filename', { ascending: true });
    if (error) {
      throw error;
    }
    return NextResponse.json(data);
}

