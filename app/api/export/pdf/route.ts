import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { calcResults } from "@/lib/calc/model";
import { formatIDRShort } from "@/lib/format/currency";
import { decodeScenarioParam } from "@/lib/util/share";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const s = url.searchParams.get("s");
  if(!s) return new NextResponse("Missing scenario", { status: 400 });
  let sc: any;
  try{ sc = decodeScenarioParam(s); }catch{ return new NextResponse("Invalid scenario", { status: 400 }); }
  const r = calcResults(sc);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = 56;

  doc.setFontSize(18);
  doc.text("PadelJKT — Board Summary", 56, y);
  y += 10;
  doc.setDrawColor(223,255,0);
  doc.setLineWidth(2);
  doc.line(56, y, 539, y);
  y += 24;

  doc.setFontSize(12);
  doc.text(`Scenario: ${sc.name}`, 56, y);
  y += 18;
  doc.text(`Site Area: ${sc.siteArea.toLocaleString()} sqm`, 56, y);
  y += 28;

  const rows: [string,string][] = [
    ["CAPEX", formatIDRShort(r.capex)],
    ["OPEX / yr", formatIDRShort(r.opex)],
    ["Revenue / yr", formatIDRShort(r.revenue)],
    ["EBITDA / yr", formatIDRShort(r.ebitda)],
    ["ROI", `${(r.roi*100).toFixed(1)}%`],
    ["Payback", `${Number.isFinite(r.paybackYears) ? r.paybackYears.toFixed(1) : "∞"} yrs`]
  ];

  rows.forEach(([k,v])=>{
    doc.text(k, 56, y);
    doc.text(v, 300, y, { align: "left" });
    y += 18;
  });

  // Disclaimer footer
  const disclaimer = "This simulator provides directional estimates only and does not constitute financial advice. Assumptions should be validated for each site.";
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(disclaimer, 56, 780, { maxWidth: 480 });

  const out = doc.output("arraybuffer");
  return new NextResponse(Buffer.from(out), { headers: { "Content-Type": "application/pdf" } });
}
