"use client";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">PadelJKT</h1>
          <p className="text-muted-300">v0.9 by Kolabs.Design × HDA × AIM</p>
        </div>
        <div className="flex items-center gap-4 opacity-80">
          <span>KOLABS.DESIGN</span>
          <span>HDA</span>
          <span>AIM</span>
        </div>
      </header>

      <section className="card p-6 max-w-3xl">
        <h2 className="text-xl mb-2">Predictive design &amp; yield analysis for padel venues</h2>
        <p className="text-sm text-muted-300 mb-6">Model your padel club in minutes. Start from realistic defaults, then tune to match your land and strategy. Export a board-ready summary.</p>
        <Link href="/simulator/sample" className="button-accent px-4 py-2 inline-block rounded-xl">Try Sample Case</Link>
      </section>
    </main>
  );
}

