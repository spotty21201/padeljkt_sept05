import { Scenario, Results } from "@/lib/types";

// Approx. padel court area incl. runoffs/circulation (sqm)
export const COURT_SQM = 250;
export function calcMaxCourts(siteArea:number, ratios:{ courtsPct:number }, perCourtSqm:number = COURT_SQM){
  const usable = siteArea * (ratios.courtsPct/100);
  return Math.max(0, Math.floor(usable / Math.max(1, perCourtSqm)));
}

export function gfaFnb(siteArea: number, ratios: { fnbPct:number; stories:number; efficiency:number }){
  const footprint = siteArea * (ratios.fnbPct/100);
  return footprint * ratios.stories * ratios.efficiency;
}

export function calcParkingStalls(gfa:number, ratio:number){
  return Math.ceil(gfa / ratio);
}

export function calcParkingArea(stalls:number){
  return stalls * 25;
}

export function calcCourtRevenue(cfg: Scenario["courts"]){
  const booked = cfg.hoursPerDay * (cfg.occupancyPct/100);
  return booked * cfg.ratePerHour * 30 * 12 * cfg.courts;
}

export function calcMembershipRevenue(members:number, feeAnnual:number){
  return members * feeAnnual;
}

export function calcEventsRevenue(perMonth:number, fee:number){
  return perMonth * fee * 12;
}

export function calcFnbRevenueBySqm(gfa:number, perSqmPerMonth:number){
  return gfa * perSqmPerMonth * 12;
}

export function calcFnbRevenueByVisitorPct(visitorsPerCourtHour:number, cfg: Scenario["courts"], spendPct:number, baseTicket:number){
  const booked = cfg.hoursPerDay * (cfg.occupancyPct/100) * cfg.courts;
  const dailyVisitors = booked * visitorsPerCourtHour;
  const annualVisitors = dailyVisitors * 30 * 12;
  return annualVisitors * baseTicket * (spendPct/100);
}

export function sum(...vals:number[]){ return vals.reduce((a,b)=>a+b,0); }

export function calcLandCapex(siteArea:number, landLease: Scenario["capex"]["landLease"]){
  if(landLease.method === "flat") return landLease.flat;
  return (landLease.rpPerSqmPerYear||0) * siteArea * (landLease.years||1);
}

export function calcCourtCapex(courts:number, unit:number, roofFactor:number){
  return courts * unit * roofFactor;
}

export function calcCapexTotal(siteArea:number, sc: Scenario){
  const land = calcLandCapex(siteArea, sc.capex.landLease);
  const courts = calcCourtCapex(sc.courts.courts, sc.capex.courtUnitCost, sc.capex.roofFactor);
  const fitout = sc.capex.fitout.cafe + sc.capex.fitout.locker;
  const branding = sc.capex.brandingLaunch;
  return { land, courts, fitout, branding, subtotal: land + courts + fitout + branding };
}

export function calcStaffAnnual(staff: Scenario["opex"]["staff"]){
  return staff.reduce((s,x)=> s + x.monthly*12, 0);
}

export function calcUtilitiesAnnual(gfa:number, rate:number){
  return gfa * rate * 12;
}

export function calcMaintenanceAnnual(courts:number, rate:number){
  return courts * rate * 12;
}

export function calcMarketingAnnual(method: Scenario["opex"]["marketing"]["method"], flat:number|undefined, pct:number|undefined, revenue:number){
  return method === "pctRevenue" ? revenue * ((pct||0)/100) : (flat||0);
}

export function calcOpexTotal(sc: Scenario, revenue:number, gfa:number){
  const staff = calcStaffAnnual(sc.opex.staff);
  const util = calcUtilitiesAnnual(gfa, sc.opex.utilitiesRpPerSqmPerMonth);
  const maint = calcMaintenanceAnnual(sc.courts.courts, sc.opex.maintenanceRpPerCourtPerMonth);
  const mkt = calcMarketingAnnual((sc.opex.marketing as any).method, (sc.opex as any).marketing.flat, (sc.opex as any).marketing.pct, revenue);
  const lease = sc.opex.leaseAnnual || 0;
  const tax  = sc.opex.taxPct ? revenue * (sc.opex.taxPct/100) : 0;
  return { staff, util, maint, mkt, lease, tax, total: staff+util+maint+mkt+lease+tax };
}

export function calcResults(sc: Scenario): Results {
  const gfa = gfaFnb(sc.siteArea, sc.ratios);
  const maxCourts = calcMaxCourts(sc.siteArea, sc.ratios);
  const scAdj: Scenario = { ...sc, courts: { ...sc.courts, courts: Math.min(sc.courts.courts, maxCourts) } };

  const courtRev = calcCourtRevenue(sc.courts);
  const membershipRev = calcMembershipRevenue(sc.rev.membership.members, sc.rev.membership.feeAnnual);
  const eventsRev = calcEventsRevenue(sc.rev.events.perMonth, sc.rev.events.fee);
  const fnbRev = sc.rev.fnb.method === "perSqm"
    ? calcFnbRevenueBySqm(gfa, (sc.rev.fnb as any).perSqmPerMonth)
    : calcFnbRevenueByVisitorPct(2, sc.courts, (sc.rev.fnb as any).visitorSpendPct, 100000);

  const revenue = sum(courtRev, membershipRev, eventsRev, fnbRev);

  const capexParts = calcCapexTotal(scAdj.siteArea, scAdj);
  const opexPreview = calcOpexTotal(scAdj, revenue, gfa);
  const workingCapital = (sc.capex.workingCapitalMonths/12) * opexPreview.total;
  const capex = capexParts.subtotal + workingCapital;

  const opex = calcOpexTotal(scAdj, revenue, gfa).total;

  const ebitda = revenue - opex;
  const roi = capex > 0 ? (ebitda / capex) : 0;
  const paybackYears = ebitda > 0 ? (capex / ebitda) : Infinity;

  const seriesLen = Math.max(1, Math.min(12, maxCourts || 1));
  const roiVsCourts = Array.from({ length: seriesLen }, (_,i)=> i+1).map(n=>{
    const tmp = { ...scAdj, courts: { ...scAdj.courts, courts: n } } as Scenario;
    const r = calcResultsShallow(tmp);
    return { courts: n, roi: r.roi };
  });
  const bepTimeline = buildBepTimeline(capex, ebitda, 10);
  const bepYear = bepTimeline.find(p => p.cumulative >= 0)?.year ?? null;

  return { capex, opex, revenue, ebitda, roi, paybackYears, charts: { roiVsCourts, bepTimeline, bepYear } };
}

export function calcResultsShallow(sc: Scenario){
  const gfa = gfaFnb(sc.siteArea, sc.ratios);
  const maxCourts = calcMaxCourts(sc.siteArea, sc.ratios);
  const scAdj: Scenario = { ...sc, courts: { ...sc.courts, courts: Math.min(sc.courts.courts, maxCourts) } };
  const courtRev = calcCourtRevenue(scAdj.courts);
  const membershipRev = calcMembershipRevenue(scAdj.rev.membership.members, scAdj.rev.membership.feeAnnual);
  const eventsRev = calcEventsRevenue(scAdj.rev.events.perMonth, scAdj.rev.events.fee);
  const fnbRev = scAdj.rev.fnb.method === "perSqm"
    ? calcFnbRevenueBySqm(gfa, (scAdj.rev.fnb as any).perSqmPerMonth)
    : calcFnbRevenueByVisitorPct(2, scAdj.courts, (scAdj.rev.fnb as any).visitorSpendPct, 100000);
  const revenue = sum(courtRev, membershipRev, eventsRev, fnbRev);
  const capex = calcCapexTotal(scAdj.siteArea, scAdj).subtotal;
  const opex = calcOpexTotal(scAdj, revenue, gfa).total;
  const ebitda = revenue - opex;
  const roi = capex > 0 ? (ebitda / capex) : 0;
  const paybackYears = ebitda > 0 ? (capex / ebitda) : Infinity;
  return { capex, opex, revenue, ebitda, roi, paybackYears };
}

export function buildBepTimeline(capex:number, ebitda:number, years:number){
  const arr: { year:number; cumulative:number }[] = [];
  let cum = -capex;
  for(let y=1;y<=years;y++){
    cum += ebitda;
    arr.push({ year: y, cumulative: cum });
  }
  return arr;
}
