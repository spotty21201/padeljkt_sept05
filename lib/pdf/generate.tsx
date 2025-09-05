"use client";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import React from "react";
import { createRoot } from "react-dom/client";
import { Report } from "@/lib/pdf/Report";
import { calcResults } from "@/lib/calc/model";
import type { Scenario } from "@/lib/types";

export async function generatePdfFromScenario(scenario: Scenario){
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '1240px';
  container.style.zIndex = '-1';
  document.body.appendChild(container);
  const root = createRoot(container);
  const results = calcResults(scenario);
  const ts = new Date().toISOString();
  root.render(React.createElement(Report, { scenario, results, exportedAtISO: ts }));
  // wait next paint
  await new Promise(r=> setTimeout(r, 150));

  const pixelRatio = Math.min(3, window.devicePixelRatio || 2);
  const canvas = await html2canvas(container, { backgroundColor: '#ffffff', scale: pixelRatio, useCORS: true });
  const imgData = canvas.toDataURL('image/jpeg', 0.92);

  // PDF sizing
  const mm = 1; // dummy
  const ptPerMm = 72/25.4;
  const a4w = 210*ptPerMm; const a4h = 297*ptPerMm;
  const margin = 20*ptPerMm; // 20mm
  const printW = a4w - 2*margin; const printH = a4h - 2*margin;

  const imgWpx = canvas.width; const imgHpx = canvas.height;
  const pxPerPt = imgWpx / printW; // how many canvas pixels per printable point
  const pageHpx = Math.floor(printH * pxPerPt);

  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });

  let offset = 0; let page = 0;
  const pageCanvas = document.createElement('canvas');
  const pageCtx = pageCanvas.getContext('2d')!;
  pageCanvas.width = imgWpx;
  pageCanvas.height = pageHpx;

  while(offset < imgHpx){
    const sliceH = Math.min(pageHpx, imgHpx - offset);
    pageCanvas.height = sliceH;
    pageCtx.clearRect(0,0,imgWpx,sliceH);
    pageCtx.drawImage(canvas, 0, offset, imgWpx, sliceH, 0, 0, imgWpx, sliceH);
    const pageImg = pageCanvas.toDataURL('image/jpeg', 0.92);
    if(page>0) pdf.addPage();
    pdf.addImage(pageImg, 'JPEG', margin, margin, printW, (sliceH/pxPerPt));
    offset += sliceH;
    page++;
  }

  root.unmount();
  document.body.removeChild(container);
  pdf.save(`PadelJKT_FS_Engine_${new Date().toISOString().slice(0,19)}.pdf`);
}

