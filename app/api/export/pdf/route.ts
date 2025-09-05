import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import fs from "node:fs";
import path from "node:path";
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

  // Header with logo (optional)
  try{
    const candidates = [
      path.join(process.cwd(), "public", "Asset-4@4x-1024x407.png"),
      path.join(process.cwd(), "public", "logo.png")
    ];
    for(const p of candidates){
      if(fs.existsSync(p)){
        const img = fs.readFileSync(p).toString("base64");
        doc.addImage(`data:image/png;base64,${img}`, "PNG", 460, 36, 120, 48);
        break;
      }
    }
  }catch{}

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

  // Metric tiles (2 columns)
  const tiles: [string,string][] = [
    ["CAPEX", formatIDRShort(r.capex)],
    ["OPEX / yr", formatIDRShort(r.opex)],
    ["Revenue / yr", formatIDRShort(r.revenue)],
    ["EBITDA / yr", formatIDRShort(r.ebitda)],
    ["ROI", `${(r.roi*100).toFixed(1)}%`],
    ["Payback", `${Number.isFinite(r.paybackYears) ? r.paybackYears.toFixed(1) : "∞"} yrs`]
  ];

  const leftX = 56, rightX = 306, boxW = 220, boxH = 48, gap = 12;
  for(let i=0;i<tiles.length;i++){
    const col = i % 2;
    const row = Math.floor(i/2);
    const x = col===0? leftX : rightX;
    const by = y + row*(boxH+gap);
    doc.setDrawColor(255,255,255);
    doc.setFillColor(21,24,33); // ink-700
    doc.roundedRect(x, by, boxW, boxH, 6, 6, "FD");
    doc.setTextColor(154);
    doc.setFontSize(10);
    doc.text(tiles[i][0], x+12, by+18);
    doc.setTextColor(237);
    doc.setFontSize(14);
    doc.text(tiles[i][1], x+12, by+36);
  }
  y += Math.ceil(tiles.length/2)*(boxH+gap) + 8;

  // Disclaimer footer
  const disclaimer = "This simulator provides directional estimates only and does not constitute financial advice. Assumptions should be validated for each site. © Kolabs.Design × HDA × AIM";
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(disclaimer, 56, 780, { maxWidth: 480 });

  const out = doc.output("arraybuffer");
  return new NextResponse(Buffer.from(out), { headers: { "Content-Type": "application/pdf" } });
}
