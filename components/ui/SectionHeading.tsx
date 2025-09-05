"use client";
import React, { ReactNode, useId } from "react";

type Props = {
  title: string;
  help?: string;
  icon?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
  id?: string;
};

export default function SectionHeading({ title, help, icon, rightSlot, className = "", id }: Props){
  const autoId = useId();
  const headingId = id || `sec-${autoId}`;
  return (
    <div className={`space-y-2 ${className}`} data-section>
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-2">
          {icon ? <span className="text-accent-500 mt-0.5">{icon}</span> : null}
          <div>
            <h2 id={headingId} className="text-text-hi text-lg md:text-xl font-semibold tracking-[-0.01em]">{title}</h2>
            {help ? <p className="text-text-mut text-xs mt-0.5">{help}</p> : null}
          </div>
        </div>
        {rightSlot}
      </div>
      <div className="h-0.5 rounded bg-accent-600/20" />
    </div>
  );
}

