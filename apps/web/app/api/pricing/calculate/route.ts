import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { works } = await request.json();
    const supabase = await createClient();

    // Fetch pricing rules and binding options
    const [rulesRes, bindingsRes] = await Promise.all([
      supabase.from('pricing_rules').select('*'),
      supabase.from('binding_options').select('*')
    ]);

    if (rulesRes.error) throw rulesRes.error;
    if (bindingsRes.error) throw bindingsRes.error;

    const pricingRules = rulesRes.data;
    const bindingOptions = bindingsRes.data;

    let orderTotal = 0;
    const pricedWorks = works.map((work: any) => {
      let workTotal = 0;

      const totalPagesInWork = work.files.reduce((sum: number, file: any) => sum + (file.pageCount || 1), 0);
      let sheets = work.printSide === 'DOUBLE' ? Math.ceil(totalPagesInWork / 2) : totalPagesInWork;

      const rule = pricingRules.find(r =>
        r.page_size === work.pageSize &&
        r.color_type === work.colorType &&
        r.print_side === work.printSide
      );

      const basePrice = rule ? rule.base_price : 0;
      const printCost = basePrice * sheets * (work.copies || 1);
      workTotal += printCost;

      if (work.bindingType && work.bindingType !== 'NONE') {
        const binding = bindingOptions.find(b => b.name.toUpperCase() === work.bindingType.toUpperCase());
        if (binding) {
          workTotal += binding.price * (work.copies || 1);
        }
      }

      orderTotal += workTotal;

      return {
        ...work,
        pricing: {
          sheets,
          basePrice,
          printCost,
          total: workTotal
        }
      };
    });

    return NextResponse.json({
      works: pricedWorks,
      totalAmount: orderTotal
    });

  } catch (error) {
    console.error('Pricing Error:', error);
    return NextResponse.json({ error: 'Failed to calculate price' }, { status: 500 });
  }
}
