import { NextResponse } from "next/server";

export async function GET() {
  // Tiny dummy PDF (base64): "%PDF-1.4 minimal stub"
  const pdf = Buffer.from("JVBERi0xLjQKJSBNaW5pbWFsIFBERiBzdHViCg==", "base64");
  return new NextResponse(pdf, { headers: { "Content-Type": "application/pdf" } });
}

