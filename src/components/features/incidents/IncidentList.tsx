// src/components/features/incidents/IncidentList.tsx
'use client';

import type { IncidentWithCamera } from '@/app/page';
import IncidentItem from './IncidentItem';
import IncidentItemSkeleton from './IncidentItemSkeleton';
import type { Camera } from '@prisma/client';

interface IncidentListProps {
  incidents: IncidentWithCamera[];
  isLoading: boolean;
  isRefilling: boolean; // <-- New prop
  selectedItemId?: string;
  onIncidentSelect: (item: IncidentWithCamera | Camera) => void;
  onResolve: (id: string) => void;
}

export default function IncidentList({
  incidents,
  isLoading,
  isRefilling, // <-- Use the new prop
  selectedItemId,
  onIncidentSelect,
  onResolve,
}: IncidentListProps) {
  const handleResolveClick = (incidentId: string) => {
    onResolve(incidentId);
    fetch(`/api/incidents/${incidentId}/resolve`, { method: 'PATCH' });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">
          {incidents.length} Unresolved Incidents
        </h2>
        {isRefilling && (
          <span className="text-xs text-slate-400 animate-pulse">Loading more...</span>
        )}
      </div>
      <div className="overflow-y-auto flex-grow p-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => <IncidentItemSkeleton key={i} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {incidents.map((incident) => (
              <IncidentItem
                key={incident.id}
                incident={incident}
                isSelected={incident.id === selectedItemId}
                onSelect={() => onIncidentSelect(incident)}
                onResolve={handleResolveClick}
              />
            ))}
            {isRefilling && Array.from({ length: 5 }).map((_, i) => <IncidentItemSkeleton key={`loading-${i}`} />)}
          </div>
        )}
      </div>
    </div>
  );
}