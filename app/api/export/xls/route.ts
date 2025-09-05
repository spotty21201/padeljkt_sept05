import { NextRequest, NextResponse } from "next/server";
import { calcResults } from "@/lib/calc/model";
import { buildWorkbook } from "@/lib/xls/buildWorkbook";
import { decodeScenarioParam } from "@/lib/util/share";

export async function GET(_req: NextRequest){
  const url = new URL(_req.url);
  const s = url.searchParams.get("s");
  let r;
  try{
    const sc = s ? decodeScenarioParam(s) : null;
    r = calcResults(sc);
  }catch{
    return new NextResponse("Invalid scenario", { status: 400 });
  }
  const buf = await buildWorkbook({ capex: r.capex, opex: r.opex, revenue: r.revenue, ebitda: r.ebitda, roi: r.roi, paybackYears: r.paybackYears });
  return new NextResponse(buf, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" } });
}
