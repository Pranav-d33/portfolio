"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, ExternalLink } from "lucide-react";

type ArchNode = {
  label: string;
  sub?: string;
};

type ArchRow = ArchNode[];

interface ZoomableArchDiagramProps {
  architecture: ArchRow[];
  title?: string;
}

interface NodePosition {
  rowIdx: number;
  nodeIdx: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  sub?: string;
}

const NODE_WIDTH = 160;
const NODE_HEIGHT = 56;
const ROW_GAP = 80;
const NODE_GAP = 24;
const PADDING_X = 40;
const PADDING_Y = 40;

export function ZoomableArchDiagram({ architecture, title }: ZoomableArchDiagramProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomedContainerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<NodePosition[]>([]);

  const flatPositions = useMemo(() => {
    const pos: NodePosition[] = [];
    let currentY = PADDING_Y;

    architecture.forEach((row, rowIdx) => {
      const rowWidth = row.length * NODE_WIDTH + (row.length - 1) * NODE_GAP;
      let currentX = PADDING_X;

      if (row.length > 1) {
        currentX = (800 - rowWidth) / 2;
      }

      row.forEach((node, nodeIdx) => {
        pos.push({
          rowIdx,
          nodeIdx,
          x: currentX + nodeIdx * (NODE_WIDTH + NODE_GAP),
          y: currentY,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          label: node.label,
          sub: node.sub,
        });
      });

      currentY += NODE_HEIGHT + ROW_GAP;
    });

    return pos;
  }, [architecture]);

  useEffect(() => {
    if (isZoomed && zoomedContainerRef.current) {
      const container = zoomedContainerRef.current;
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const totalHeight = architecture.length * NODE_HEIGHT + (architecture.length - 1) * ROW_GAP + PADDING_Y * 2;
      const maxRowWidth = Math.max(
        ...architecture.map((row) => row.length * NODE_WIDTH + (row.length - 1) * NODE_GAP)
      );
      const totalWidth = maxRowWidth + PADDING_X * 2;

      setPositions(
        flatPositions.map((p) => ({
          ...p,
          x: p.x + (centerX - totalWidth / 2),
          y: p.y + (centerY - totalHeight / 2),
        }))
      );
    }
  }, [isZoomed, flatPositions, architecture]);

  const connections = useMemo(() => {
    const conns: Array<{
      id: number;
      from: NodePosition;
      to: NodePosition;
      path: string;
      midX: number;
      midY: number;
    }> = [];

    let connId = 0;
    for (let r = 0; r < architecture.length - 1; r++) {
      const currentRow = architecture[r];
      const nextRow = architecture[r + 1];

      currentRow.forEach((_, fromIdx) => {
        const from = flatPositions.find((p) => p.rowIdx === r && p.nodeIdx === fromIdx)!;
        const fromCenterX = from.x + from.width / 2;
        const fromBottomY = from.y + from.height;
        const toCenterX = fromCenterX;
        const toTopY = flatPositions.find((p) => p.rowIdx === r + 1 && p.nodeIdx === 0)!.y;

        if (nextRow.length === 1) {
          const to = flatPositions.find((p) => p.rowIdx === r + 1 && p.nodeIdx === 0)!;
          conns.push({
            id: connId++,
            from,
            to,
            path: `M ${fromCenterX} ${fromBottomY} C ${fromCenterX} ${fromBottomY + 30}, ${toCenterX} ${toTopY - 30}, ${toCenterX} ${toTopY}`,
            midX: fromCenterX,
            midY: (fromBottomY + toTopY) / 2,
          });
        } else {
          const totalWidth = nextRow.length * NODE_WIDTH + (nextRow.length - 1) * NODE_GAP;
          const step = NODE_WIDTH + NODE_GAP;
          const startX = (800 - totalWidth) / 2 + NODE_WIDTH / 2;

          nextRow.forEach((_, toIdx) => {
            const to = flatPositions.find((p) => p.rowIdx === r + 1 && p.nodeIdx === toIdx)!;
            const targetX = startX + toIdx * step;
            const targetY = to.y;

            conns.push({
              id: connId++,
              from,
              to,
              path: `M ${fromCenterX} ${fromBottomY} C ${fromCenterX} ${fromBottomY + 40}, ${targetX} ${targetY - 40}, ${targetX} ${targetY}`,
              midX: fromCenterX,
              midY: fromBottomY + (targetY - fromBottomY) / 2,
            });
          });
        }
      });
    }

    return conns;
  }, [architecture, flatPositions]);

  return (
    <>
      <div
        className="arch-diagram-trigger relative rounded-xl border border-border-dim bg-foreground/[0.02] p-6 cursor-zoom-in group overflow-hidden"
        onClick={() => setIsZoomed(true)}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-t3 font-meta uppercase tracking-wider">
            {title || "Architecture"}
          </span>
          <ZoomIn className="w-5 h-5 text-t3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="relative flex flex-col gap-3 items-center">
          {architecture.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-3 justify-center flex-wrap">
              {row.map((node, nodeIdx) => (
                <div
                  key={nodeIdx}
                  className="arch-node-mini flex flex-col items-center px-4 py-2.5 rounded-lg bg-fog-bg/80 dark:bg-graphite-bg/80 border border-border-dim/50 backdrop-blur-sm text-center"
                >
                  <span className="text-xs font-medium text-t2 whitespace-nowrap">{node.label}</span>
                  {node.sub && <span className="text-[10px] text-t3 mt-0.5">{node.sub}</span>}
                </div>
              ))}
              {rowIdx < architecture.length - 1 && (
                <svg className="absolute left-1/2 -translate-x-1/2 text-accent/30" width="12" height="24" style={{ top: `${rowIdx * (NODE_HEIGHT * 0.4 + ROW_GAP * 0.4) + NODE_HEIGHT + 8}px` }}>
                  <path d="M6 0 L6 12 M3 9 L6 12 L9 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              )}
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              ref={zoomedContainerRef}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="relative w-full max-w-4xl h-[85vh] overflow-hidden bg-foreground/[0.01] rounded-2xl border border-border-dim"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <a
                  href="#architecture"
                  className="p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-5 h-5 text-t2" />
                </a>
                <button
                  onClick={() => setIsZoomed(false)}
                  className="p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
                >
                  <X className="w-5 h-5 text-t2" />
                </button>
              </div>

              <div className="p-8 pb-4">
                <h3 className="text-xl font-degular font-medium text-t1 text-center">
                  {title || "Architecture"}
                </h3>
              </div>

              <div className="relative w-full h-[calc(100%-80px)] overflow-auto">
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ minWidth: "800px", minHeight: positions.length > 0 ? Math.max(...positions.map(p => p.y + p.height)) + PADDING_Y : "400px" }}
                >
                  <defs>
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="connectionGradientHover" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.8" />
                    </linearGradient>
                    <marker
                      id="arrowhead"
                      markerWidth="8"
                      markerHeight="8"
                      refX="6"
                      refY="4"
                      orient="auto"
                    >
                      <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-accent)" opacity="0.6" />
                    </marker>
                    <marker
                      id="arrowheadHover"
                      markerWidth="10"
                      markerHeight="10"
                      refX="7"
                      refY="5"
                      orient="auto"
                    >
                      <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-accent)" opacity="0.9" />
                    </marker>
                  </defs>

                  {positions.length > 0 &&
                    connections.map((conn) => (
                      <g key={conn.id}>
                        <path
                          d={conn.path}
                          fill="none"
                          stroke={
                            hoveredConnection === conn.id
                              ? "url(#connectionGradientHover)"
                              : "url(#connectionGradient)"
                          }
                          strokeWidth={hoveredConnection === conn.id ? 2.5 : 1.5}
                          markerEnd={
                            hoveredConnection === conn.id
                              ? "url(#arrowheadHover)"
                              : "url(#arrowhead)"
                          }
                          className="transition-all duration-200"
                        />
                        <motion.circle
                          r="3"
                          fill="var(--color-accent)"
                          opacity="0.8"
                          style={{
                            offsetPath: conn.path,
                          }}
                          animate={{
                            offsetDistance: ["0%", "100%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: conn.id * 0.15,
                          }}
                        />
                      </g>
                    ))}
                </svg>

                <div className="relative flex flex-col gap-6 items-center px-8 pb-8" style={{ minHeight: "400px" }}>
                  {architecture.map((row, rowIdx) => (
                    <div
                      key={rowIdx}
                      className="flex gap-4 justify-center flex-wrap"
                      style={{
                        marginTop: rowIdx === 0 ? 0 : ROW_GAP - NODE_HEIGHT,
                      }}
                    >
                      {row.map((node, nodeIdx) => {
                        const pos = flatPositions.find(
                          (p) => p.rowIdx === rowIdx && p.nodeIdx === nodeIdx
                        );
                        return (
                          <motion.div
                            key={nodeIdx}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: rowIdx * 0.08 + nodeIdx * 0.04 }}
                            onHoverStart={() => setHoveredNode(rowIdx * 10 + nodeIdx)}
                            onHoverEnd={() => setHoveredNode(null)}
                            className={`arch-node-zoom relative flex flex-col items-center px-5 py-3.5 rounded-xl border backdrop-blur-sm text-center ${
                              hoveredNode === rowIdx * 10 + nodeIdx
                                ? "bg-accent/10 border-accent/50 shadow-lg shadow-accent/10 scale-105"
                                : "bg-foreground/5 border-border-dim/50"
                            }`}
                            style={{ width: NODE_WIDTH }}
                          >
                            <span className="text-sm font-medium text-t1 leading-tight">
                              {node.label}
                            </span>
                            {node.sub && (
                              <span className="text-[11px] text-t3 font-mono mt-1.5 leading-tight">
                                {node.sub}
                              </span>
                            )}

                            {hoveredNode === rowIdx * 10 + nodeIdx && (
                              <motion.div
                                className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/5 via-transparent to-transparent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}