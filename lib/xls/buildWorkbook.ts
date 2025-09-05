import ExcelJS from "exceljs";

export async function buildWorkbook(data: { capex:number; opex:number; revenue:number; ebitda:number; roi:number; paybackYears:number }){
  const wb = new ExcelJS.Workbook();
  wb.creator = "PadelJKT";
  const wsA = wb.addWorksheet("Assumptions");
  const wsR = wb.addWorksheet("Results");
  const wsC = wb.addWorksheet("Charts_Data");

  // Named cells (example)
  wsR.getCell("A1").value = "Metric";
  wsR.getCell("B1").value = "Value";
  wsR.getCell("A2").value = "CAPEX";
  wsR.getCell("A3").value = "OPEX";
  wsR.getCell("A4").value = "Revenue";
  wsR.getCell("A5").value = "EBITDA";
  wsR.getCell("A6").value = "ROI";
  wsR.getCell("A7").value = "Payback (yrs)";

  wsR.getCell("B2").value = data.capex;
  wsR.getCell("B3").value = data.opex;
  wsR.getCell("B4").value = data.revenue;
  // Formulas (live) using previous cells
  wsR.getCell("B5").value = { formula: "B4-B3" };
  wsR.getCell("B6").value = { formula: "IF(B2>0,B5/B2,0)" };
  wsR.getCell("B7").value = { formula: "IF(B5>0,B2/B5,\"∞\")" };

  // Formatting
  ["B2","B3","B4","B5"].forEach(addr=>{ wsR.getCell(addr).numFmt = "#,##0"; });
  wsR.getCell("B6").numFmt = "0.0%";

  wsR.columns = [
    { header: "Metric", key: "metric", width: 20 },
    { header: "Value", key: "value", width: 18 }
  ];
  wsR.views = [{ state: "frozen", ySplit: 1 }];

  // Charts data (placeholders; consumers can create charts manually in Excel)
  wsC.getCell("A1").value = "ROI_vs_Courts:courts";
  wsC.getCell("B1").value = "ROI_vs_Courts:roi%";
  wsC.getCell("D1").value = "Payback:year";
  wsC.getCell("E1").value = "Payback:cumulative";
  wsC.columns = [
    { key: "a", width: 18 },
    { key: "b", width: 18 },
    { key: "c", width: 4 },
    { key: "d", width: 18 },
    { key: "e", width: 18 },
  ];

  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}
