import { NextRequest, NextResponse } from "next/server";
import { createBaseScenario } from "@/lib/calc/presets";
import { calcResults } from "@/lib/calc/model";
import { buildWorkbook } from "@/lib/xls/buildWorkbook";

export async function GET(_req: NextRequest){
  // For MVP: build from sample scenario; later load by id
  const sc = createBaseScenario();
  const r = calcResults(sc);
  const buf = await buildWorkbook({ capex: r.capex, opex: r.opex, revenue: r.revenue, ebitda: r.ebitda, roi: r.roi, paybackYears: r.paybackYears });
  return new NextResponse(buf, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" } });
}

