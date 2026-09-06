type ArchNode = {
  label: string;
  sub?: string;
};

type ArchRow = ArchNode[];

interface ZoomableArchDiagramProps {
  architecture: ArchRow[];
  title?: string;
}

function Connector() {
  return (
    <div aria-hidden="true" className="flex justify-center py-1">
      <svg width="12" height="28" viewBox="0 0 12 28" fill="none" stroke="currentColor" className="text-accent">
        <line x1="6" y1="0" x2="6" y2="22" strokeWidth="1.5" opacity="0.5" />
        <polyline points="2.5,18.5 6,22 9.5,18.5" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function ZoomableArchDiagram({ architecture, title }: ZoomableArchDiagramProps) {
  return (
    <div>
      <span className="font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint block mb-5">
        {title || "Architecture"}
      </span>
      <div className="flex flex-col items-stretch">
        {architecture.map((row, rowIdx) => (
          <div key={rowIdx} className="flex flex-col items-stretch">
            {rowIdx > 0 && <Connector />}
            <div className={`grid gap-3 ${row.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
              {row.map((node, nodeIdx) => (
                <div
                  key={nodeIdx}
                  className="flex flex-col items-center text-center px-4 py-3.5 rounded-[3px] border border-rule bg-paper-deep/40"
                >
                  <span className="font-degular text-[15px] leading-[1.35] tracking-[-0.01em] text-ink">
                    {node.label}
                  </span>
                  {node.sub && (
                    <span className="font-geist-mono text-[11px] leading-[1.5] text-ink-faint mt-1">
                      {node.sub}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
