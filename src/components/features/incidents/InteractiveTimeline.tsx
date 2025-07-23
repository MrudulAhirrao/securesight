'use client';

import type { IncidentWithCamera } from '@/app/page';
import type { Camera } from '@prisma/client';
import { useState, useRef, MouseEvent, useMemo, useCallback } from 'react';
import {
  Clock, TriangleAlert, Users, Clapperboard, FireExtinguisher
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface InteractiveTimelineProps {
  allIncidents: IncidentWithCamera[];
  onIncidentSelect: (item: IncidentWithCamera | Camera) => void;
  selectedItem: IncidentWithCamera | null;
}

// Utility functions
const timeToPercentage = (time: Date) => {
  const d = new Date(time);
  const secs = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
  return (secs / 86400) * 100;
};

const percentageToTime = (percent: number) => {
  const totalSecs = (percent / 100) * 86400;
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const getIncidentIcon = (type: string) => {
  switch (type) {
    case 'Unauthorised Access': return <Users className="h-4 w-4 text-orange-400" />;
    case 'Gun Threat': return <TriangleAlert className="h-4 w-4 text-red-500" />;
    case 'Face Recognised': return <Users className="h-4 w-4 text-blue-300" />;
    case 'Fire Hazard': return <FireExtinguisher className="h-4 w-4 text-yellow-400" />;
    default: return <Clapperboard className="h-4 w-4 text-gray-400" />;
  }
};

export default function InteractiveTimeline({ allIncidents, onIncidentSelect, selectedItem }: InteractiveTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scrubberPosition, setScrubberPosition] = useState(50);

  const incidents = useMemo(() =>
    allIncidents.map(inc => ({
      ...inc,
      start: timeToPercentage(new Date(inc.tsStart!)),
      end: timeToPercentage(new Date(inc.tsEnd!))
    })).sort((a, b) => a.start - b.start)
    , [allIncidents]);

  const closestIncident = useMemo(() => {
    if (incidents.length === 0) return null;
    return incidents.reduce((prev, curr) =>
      Math.abs(curr.start - scrubberPosition) < Math.abs(prev.start - scrubberPosition) ? curr : prev
    );
  }, [scrubberPosition, incidents]);

  const handleDrag = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + containerRef.current.scrollLeft;
    const percent = Math.max(0, Math.min(100, (x / containerRef.current.scrollWidth) * 100));
    setScrubberPosition(percent);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (closestIncident) onIncidentSelect(closestIncident);
  }, [isDragging, closestIncident, onIncidentSelect]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleDrag(e);
  };

  const scrubberTime = useMemo(() => percentageToTime(scrubberPosition), [scrubberPosition]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-x-auto select-none custom-scrollbar border border-slate-700/50 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md p-3"
      onMouseDown={handleMouseDown}
      onMouseMove={e => isDragging && handleDrag(e)}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg height="100%" style={{ width: '300%' }} className="min-h-[60px] transition-all duration-200">
        {/* Hour markers */}
        {Array.from({ length: 49 }).map((_, i) => (
          <g key={`tick-${i}`}>
            <line x1={`${(i / 48) * 100}%`} y1="26" x2={`${(i / 48) * 100}%`} y2="100%"
              className={i % 2 === 0 ? "stroke-slate-600" : "stroke-slate-700"}
              strokeWidth="1"
            />
            {i % 2 === 0 && (
              <text x={`${(i / 48) * 100}%`} y="18" dx="4"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {String(i / 2).padStart(2, '0')}:00
              </text>
            )}
          </g>
        ))}

        {/* Incident bars */}
        <g>
          {incidents.map(incident => {
            const width = Math.max(0.2, incident.end - incident.start);
            const isSelected = incident.id === selectedItem?.id;
            const isClosest = isDragging && incident.id === closestIncident?.id;

            return (
              <Popover key={incident.id}>
                <PopoverTrigger asChild>
                  <rect
                    x={`${incident.start}%`}
                    y="32"
                    width={`${width}%`}
                    height="30"
                    rx="8"
                    className={`
                      cursor-pointer transition-all duration-200
                      ${isSelected ? 'fill-sky-500/90 stroke-sky-300' : 'fill-slate-600/40 stroke-slate-500/60'}
                      ${isClosest ? 'stroke-amber-400 scale-[1.05]' : ''}
                    `}
                    strokeWidth="2"
                    onClick={e => { e.stopPropagation(); onIncidentSelect(incident); }}
                  />
                </PopoverTrigger>
                <PopoverContent className="text-sm text-white bg-slate-800/90 backdrop-blur-lg border border-slate-600 px-4 py-3 shadow-lg rounded-lg">
                  <div className="flex items-center gap-2">
                    {getIncidentIcon(incident.type!)}
                    <span className="font-semibold">{incident.type}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{incident.camera.name}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(incident.tsStart!).toLocaleTimeString()} - {new Date(incident.tsEnd!).toLocaleTimeString()}</span>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </g>

        {/* Scrubber */}
        <g style={{ transform: `translateX(${scrubberPosition}%)` }}
          className="pointer-events-none transition-transform duration-150 ease-in-out"
        >
          <line y1="0" y2="100%" className="stroke-amber-400" strokeWidth="2" />
          <text y="20" x="-10" textAnchor="end"
            className="fill-amber-300 text-xs font-mono"
          >
            {scrubberTime}
          </text>
        </g>
      </svg>
    </div>
  );
}
