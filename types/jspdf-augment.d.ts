declare module "jspdf" {
  interface jsPDF {
    setLineDashPattern(pattern: number[], phase?: number): this;
  }
}

