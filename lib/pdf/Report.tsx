"use client";
import React from "react";
import type { Scenario, Results } from "@/lib/types";
import { RoiVsCourtsChart } from "@/components/charts/RoiVsCourts";
import { PaybackTimelineChart } from "@/components/charts/PaybackTimeline";
import { ScenarioCompareChart } from "@/components/charts/ScenarioCompareChart";
import { formatIDRShort } from "@/lib/format/currency";

export function Report({ scenario, results, exportedAtISO }:{ scenario: Scenario; results: Results; exportedAtISO: string }){
  return (
    <div id="padeljkt-report-root" style={{
      width: 1240,
      color: "#1B1F27",
      background: "#ffffff",
      fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      padding: 24
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>PadelJKT FS Engine</h1>
          <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Predictive ROI and feasibility modeling for padel clubs.</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>Scenario: {scenario.name} • Exported: {exportedAtISO}</div>
        </div>
        <img src="/Asset-4@4x-1024x407.png" alt="Kolabs.Design" style={{ height: 32, width: 'auto' }} />
      </div>
      <div style={{ height: 1, background: '#E5E7EB', marginBottom: 16 }} />

      {/* KPI tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'CAPEX', value: results.capex, unit: '' },
          { label: 'OPEX / yr', value: results.opex, unit: '' },
          { label: 'Revenue / yr', value: results.revenue, unit: '' },
          { label: 'EBITDA / yr', value: results.ebitda, unit: '' },
          { label: 'ROI', value: +(results.roi*100).toFixed(1), unit: '%' },
          { label: 'Payback', value: Number.isFinite(results.paybackYears) ? +results.paybackYears.toFixed(1) : Infinity, unit: 'yrs' },
        ].map((t, i)=>{
          const ok = t.label==='ROI' ? (Number.isFinite(t.value as number) && (t.value as number) >= 20) : false;
          return (
            <div key={i} style={{ background: ok? '#F4FFDF':'#F9FAFB', border:'1px solid #E5E7EB', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, color:'#6B7280' }}>{t.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>
                {t.label.includes('ROI') ? `${t.value}${t.unit}` : `${formatIDRShort(Math.round(t.value as number))}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 12, marginTop: 16 }}>
        <div>
          <div style={{ fontSize: 12, color:'#6B7280', marginBottom: 8 }}>ROI vs Courts</div>
          <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:12 }}>
            <div style={{ height: 280, padding: 12 }}>
              <RoiVsCourtsChart data={results.charts.roiVsCourts} current={scenario.courts.courts} />
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color:'#6B7280', marginBottom: 8 }}>Payback Timeline</div>
          <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:12 }}>
            <div style={{ height: 280, padding: 12 }}>
              <PaybackTimelineChart data={results.charts.bepTimeline} bepYear={results.charts.bepYear} />
            </div>
          </div>
        </div>
      </div>

      {/* Assumptions */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight:700, marginBottom: 8 }}>Assumptions Snapshot</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 12 }}>
          <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:12, padding: 12 }}>
            <div style={{ fontSize:12, color:'#6B7280', marginBottom: 6 }}>Site & Ratios</div>
            <div style={{ fontSize:12 }}>
              Site Area: {scenario.siteArea.toLocaleString()} sqm • Courts %: {scenario.ratios.courtsPct}% • Parking %: {scenario.ratios.parkingPct}% • F&B %: {scenario.ratios.fnbPct}% • Circ %: {scenario.ratios.circulationPct}% • Stories: {scenario.ratios.stories} • Eff: {scenario.ratios.efficiency}
            </div>
          </div>
          <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:12, padding: 12 }}>
            <div style={{ fontSize:12, color:'#6B7280', marginBottom: 6 }}>Courts</div>
            <div style={{ fontSize:12 }}>
              #Courts: {scenario.courts.courts} • Type: {scenario.courts.indoorType} • Occ: {scenario.courts.occupancyPct}% • Hours/Day: {scenario.courts.hoursPerDay} • Rate: {scenario.courts.ratePerHour.toLocaleString('id-ID')}
            </div>
          </div>
          <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:12, padding: 12 }}>
            <div style={{ fontSize:12, color:'#6B7280', marginBottom: 6 }}>Revenues</div>
            <div style={{ fontSize:12 }}>
              Members: {scenario.rev.membership.members} • Fee/yr: {scenario.rev.membership.feeAnnual.toLocaleString('id-ID')} • Events/mo: {scenario.rev.events.perMonth} @ {scenario.rev.events.fee.toLocaleString('id-ID')} • F&B: {('method' in scenario.rev.fnb) ? (scenario.rev.fnb as any).method : ''}
            </div>
          </div>
          <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:12, padding: 12 }}>
            <div style={{ fontSize:12, color:'#6B7280', marginBottom: 6 }}>Costs</div>
            <div style={{ fontSize:12 }}>
              CAPEX: unit {scenario.capex.courtUnitCost.toLocaleString('id-ID')} • roof {scenario.capex.roofFactor} • branding {scenario.capex.brandingLaunch.toLocaleString('id-ID')} • WC {scenario.capex.workingCapitalMonths}m • Lease {('method' in scenario.capex.landLease)? (scenario.capex.landLease as any).method: ''}
              • OPEX: staff {scenario.opex.staff.length} lines • util {scenario.opex.utilitiesRpPerSqmPerMonth.toLocaleString('id-ID')} • maint {scenario.opex.maintenanceRpPerCourtPerMonth.toLocaleString('id-ID')} • mkt {(scenario.opex.marketing as any).method}
            </div>
          </div>
        </div>
        <div style={{ fontSize:10, color:'#6B7280', marginTop:8 }}>This model is directional; validate assumptions per site.</div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 16, fontSize: 10, color:'#6B7280' }}>© Kolabs.Design × HDA × AIM • v0.9</div>
    </div>
  );
}

