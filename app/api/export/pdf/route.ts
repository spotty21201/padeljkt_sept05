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

  // Simple Charts (drawn inline)
  // ROI vs Courts (left)
  const chartX = 56, chartY = y + 8, chartW = 220, chartH = 120;
  doc.setDrawColor(255); doc.rect(chartX, chartY, chartW, chartH);
  const roiSeries = r.charts.roiVsCourts.map(p=> ({ x: p.courts, y: +(p.roi*100).toFixed(1) }));
  const xMax = Math.max(...roiSeries.map(p=> p.x), 1);
  const yMin = Math.min(...roiSeries.map(p=> p.y), 0);
  const yMax = Math.max(...roiSeries.map(p=> p.y), 1);
  function mapX(v:number){ return chartX + (v/xMax)*chartW; }
  function mapY(v:number){ return chartY + chartH - ((v - yMin)/(yMax - yMin || 1))*chartH; }
  doc.setDrawColor(182,255,59);
  for(let i=1;i<roiSeries.length;i++){
    doc.line(mapX(roiSeries[i-1].x), mapY(roiSeries[i-1].y), mapX(roiSeries[i].x), mapY(roiSeries[i].y));
  }
  // Payback timeline (right)
  const chart2X = chartX + chartW + 30, chart2Y = chartY, chart2W = 220, chart2H = 120;
  doc.setDrawColor(255); doc.rect(chart2X, chart2Y, chart2W, chart2H);
  const pay = r.charts.bepTimeline;
  const x2Max = Math.max(...pay.map(p=> p.year), 1);
  const y2Min = Math.min(...pay.map(p=> p.cumulative), 0);
  const y2Max = Math.max(...pay.map(p=> p.cumulative), 1);
  function map2X(v:number){ return chart2X + (v/x2Max)*chart2W; }
  function map2Y(v:number){ return chart2Y + chart2H - ((v - y2Min)/(y2Max - y2Min || 1))*chart2H; }
  doc.setDrawColor(182,255,59);
  for(let i=1;i<pay.length;i++){
    doc.line(map2X(pay[i-1].year), map2Y(pay[i-1].cumulative), map2X(pay[i].year), map2Y(pay[i].cumulative));
  }
  if(r.charts.bepYear){
    doc.setDrawColor(182,255,59); doc.setLineDash([3]);
    const bx = map2X(r.charts.bepYear);
    doc.line(bx, chart2Y, bx, chart2Y+chart2H);
    doc.setLineDash([]);
  }
  y += chartH + 30;

  // Disclaimer footer
  const disclaimer = "This simulator provides directional estimates only and does not constitute financial advice. Assumptions should be validated for each site. © Kolabs.Design × HDA × AIM";
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(disclaimer, 56, 780, { maxWidth: 480 });

  const out = doc.output("arraybuffer");
  return new NextResponse(Buffer.from(out), { headers: { "Content-Type": "application/pdf" } });
}
