import type { IncidentWithCamera } from '@/app/page';
import { TriangleAlert, Users, Clapperboard, FireExtinguisher } from 'lucide-react';
import Image from 'next/image';

const getIncidentIcon = (type: string) => {
  switch (type) {
    case 'Unauthorised Access': return <Users className="h-4 w-4 text-orange-400" />;
    case 'Gun Threat': return <TriangleAlert className="h-4 w-4 text-red-500" />;
    case 'Face Recognised': return <Users className="h-4 w-4 text-blue-400" />;
    case 'Fire Hazard': return <FireExtinguisher className="h-4 w-4 text-amber-500" />;
    default: return <Clapperboard className="h-4 w-4 text-gray-400" />;
  }
};

interface IncidentItemProps {
  incident: IncidentWithCamera;
  isSelected: boolean;
  onSelect: () => void;
  onResolve: (id: string) => void;
}

export default function IncidentItem({ incident, isSelected, onSelect, onResolve }: IncidentItemProps) {
  // Removed the '!' non-null assertions as they are no longer needed
  const incidentTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(incident.tsStart));
  const incidentDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(incident.tsStart));

  const handleResolveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResolve(incident.id);
  };

  return (
    <div onClick={onSelect} className={`flex items-center gap-4 p-2 rounded-lg transition-colors cursor-pointer ${isSelected ? 'bg-blue-500/20 ring-1 ring-blue-400' : 'hover:bg-slate-800/50'}`}>
      <Image src={incident.thumbnailUrl} alt="Incident thumbnail" width={100} height={60} className="rounded-md aspect-video object-cover"/>
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          {getIncidentIcon(incident.type)}
          <p className="font-semibold text-sm text-slate-100">{incident.type}</p>
        </div>
        <p className="text-xs text-slate-400">{incident.camera.location}</p>
        <p className="text-xs text-slate-500">{incidentTime} on {incidentDate}</p>
      </div>
      <button onClick={handleResolveClick} className="text-xs font-semibold text-blue-400 hover:text-blue-300 pr-2 flex-shrink-0">
        Resolve &rsaquo;
      </button>
    </div>
  );
}