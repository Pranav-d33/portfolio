import React from "react";

interface ResumeEntryProps {
  title: string;
  org?: string;
  date?: string;
  description?: string;
  details?: string[];
}

export function ResumeEntry({ title, org, date, description, details }: ResumeEntryProps) {
  return (
    <div className="resume-entry">
      <div className="flex items-baseline justify-between gap-4 mb-1">
        <h3 className="resume-entry-title">{title}</h3>
        {date && <span className="text-body-sm text-stone-text shrink-0">{date}</span>}
      </div>
      {org && <p className="text-body text-ash-text mb-2">{org}</p>}
      {description && <p className="resume-entry-desc">{description}</p>}
      {details && details.length > 0 && (
        <ul className="mt-3 space-y-1">
          {details.map((d, i) => (
            <li key={i} className="text-body text-graphite-text pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-ash-text">
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
