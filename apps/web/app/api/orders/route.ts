import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { shopId, mobile, works, totalAmount, paymentMethod } = await request.json();
    const supabase = await createClient();

    // 1. Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        shop_id: shopId || (await supabase.from('shops').select('id').limit(1).single()).data?.id,
        mobile,
        total_amount: totalAmount,
        status: 'PENDING',
        payment_status: paymentMethod === 'upi' ? 'PAID' : 'UNPAID'
      })
      .select('id')
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.id;

    // 2. Insert works and files sequentially or via Promise.all
    for (const work of works) {
      const { data: workData, error: workError } = await supabase
        .from('works')
        .insert({
          order_id: orderId,
          page_size: work.pageSize,
          color_type: work.colorType,
          print_side: work.printSide,
          copies: work.copies,
          binding_type: work.bindingType || 'NONE',
          paper_type: work.paperType || 'Regular',
          gsm: work.gsm || '80',
          calculated_price: work.calculatedPrice || work.price || 0
        })
        .select('id')
        .single();
      
      if (workError) throw workError;
      const dbWorkId = workData.id;

      // 3. Insert files
      if (work.files && work.files.length > 0) {
        const fileInserts = work.files.map((file: any) => ({
          work_id: dbWorkId,
          original_name: file.originalName || file.name,
          file_path: file.path || file.storagePath || '', // Path from Supabase storage
          file_type: file.mimetype || 'application/pdf',
          page_count: file.pageCount || file.pages || 1,
          printable_pages: file.printablePages || file.pages || 1
        }));

        const { error: fileError } = await supabase.from('files').insert(fileInserts);
        if (fileError) throw fileError;
      }
    }

    return NextResponse.json({ id: orderId, message: 'Order created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
