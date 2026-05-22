import React from "react";

interface ResumeEntryProps {
  title: string;
  org?: React.ReactNode;
  date?: string;
  description?: string;
  details?: string[];
}

export function ResumeEntry({ title, org, date, description, details }: ResumeEntryProps) {
  return (
    <div className="resume-entry">
      {date && <p className="resume-entry-date">{date}</p>}
      <h3 className="resume-entry-title">{title}</h3>
      {org && <p className="resume-entry-org">{org}</p>}
      {description && <p className="resume-entry-desc">{description}</p>}
      {details && details.length > 0 && (
        <ul className="resume-entry-details">
          {details.map((d, i) => (
            <li key={i} className="resume-entry-detail">
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
