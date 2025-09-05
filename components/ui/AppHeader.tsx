"use client";
import React from "react";

export type AppHeaderProps = {
  appName: string;
  tagline: string;
  version: string;
  credits: string;
  logoHref?: string;
  scenarioName?: string;
  onScenarioClick?: () => void;
  className?: string;
};

export default function AppHeader({
  appName,
  tagline,
  version,
  credits,
  logoHref = "https://kolabs.design",
  scenarioName,
  onScenarioClick,
  className = "",
}: AppHeaderProps) {
  return (
    <header className={`w-full bg-[color:var(--header-bg)] ${className}`} role="banner">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-4 md:py-6 flex items-start justify-between">
        {/* Left cluster */}
        <div className="flex flex-col gap-1.5 md:gap-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.01em] text-[color:var(--fg)]">
            {appName}
          </h1>
          <p className="text-base md:text-lg text-[color:var(--fg-muted)]">
            {tagline}
          </p>
          <div className="flex items-center gap-2 text-sm text-[color:var(--fg-muted)]">
            <span>{version}</span>
            <span aria-hidden="true">•</span>
            <span>{credits}</span>
          </div>
        </div>

        {/* Right cluster: logo */}
        <a
          href={logoHref}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 opacity-90 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] rounded"
          aria-label="Kolabs.Design"
        >
          <img
            src="/Asset-4@4x-1024x407.png"
            alt="Kolabs.Design"
            className="h-8 md:h-10 w-auto"
          />
        </a>
      </div>

      {/* Scenario sub-bar (optional) */}
      {scenarioName && (
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pb-3">
          <button
            onClick={onScenarioClick}
            className="inline-flex items-center gap-2 text-xs md:text-sm text-[color:var(--fg)] bg-[color:var(--card)] border border-white/10 rounded-full px-3.5 py-1.5 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            aria-label={`Current scenario: ${scenarioName}`}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--accent)]" />
            <span className="opacity-80">Scenario:</span>
            <span className="font-medium">{scenarioName}</span>
            <svg className="h-3.5 w-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M5.5 7l4.5 4.5L14.5 7" />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}

