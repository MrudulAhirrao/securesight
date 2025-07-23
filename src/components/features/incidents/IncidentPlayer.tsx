'use client';

import type { IncidentWithCamera } from '@/app/(dashboard)/page';
import type { Camera } from '@prisma/client';
import { useState } from 'react';
import { Cctv, CameraOff, VideoOff, ChevronsUp } from 'lucide-react';
import Image from 'next/image';
import InteractiveTimeline from './InteractiveTimeline';
import { motion, AnimatePresence } from 'framer-motion';

// Component Interfaces
interface IncidentPlayerProps {
  selectedItem: IncidentWithCamera | Camera | null;
  allCameras: Camera[];
  allIncidents: IncidentWithCamera[];
  onIncidentSelect: (item: IncidentWithCamera | Camera) => void;
  isLoading: boolean;
}

// "No Incident" placeholder view (for when a camera has no incidents)
function NoIncidentView({ camera }: { camera: Camera }) {
  return (
    <div className="h-full flex flex-col p-4 gap-4">
      <div className="relative flex-grow rounded-lg overflow-hidden bg-slate-800/50 flex flex-col items-center justify-center text-slate-600">
        <VideoOff className="h-24 w-24" />
        <p className="mt-4 text-lg font-semibold">No Recent Incidents</p>
      </div>
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 text-slate-300">
          <Cctv className="h-5 w-5" />
          <h3 className="font-semibold">{camera.name} - {camera.location}</h3>
        </div>
      </div>
    </div>
  );
}

// Main Player Component
export default function IncidentPlayer({
  selectedItem, allCameras, allIncidents, onIncidentSelect, isLoading,
}: IncidentPlayerProps) {
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);

  if (isLoading) return <div className="flex items-center justify-center h-full text-slate-500">Loading Player...</div>;
  if (!selectedItem) return <div className="flex items-center justify-center h-full text-slate-500">No Incidents Found.</div>;
  if (!('tsStart' in selectedItem)) return <NoIncidentView camera={selectedItem} />;

  const incident = selectedItem;
  const otherCameras = allCameras.filter((cam) => cam.id !== incident.camera.id);
  const incidentTimestamp = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date(incident.tsStart));
  
  const viewVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  };

  return (
    <div className="h-full p-4 overflow-hidden flex flex-col">
      <div className="flex-grow min-h-0">
        <AnimatePresence mode="wait">
          {isTimelineVisible ? (
            // ==========================================================
            // VIEW 1: TIMELINE IS VISIBLE
            // ==========================================================
            <motion.div
              key="timeline-view"
              variants={viewVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full flex flex-col gap-4"
            >
              <div className="flex-grow flex gap-4 items-start min-h-0">
                {/* Shrunken Player */}
                <div className="relative w-150 h-70 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                  <Image key={incident.id} src={incident.thumbnailUrl} alt={`View of ${incident.camera.location}`} fill className="object-cover" />
                   <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-4 w-full"><p className="font-bold text-lg text-white drop-shadow-lg">{incidentTimestamp}</p></div>
                </div>
                {/* Vertical Other Views */}
                <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Cctv className="h-5 w-5" />
                  <h3 className="font-semibold">{incident.camera.name} - {incident.camera.location}</h3>
                </div>
                  {otherCameras.slice(0, 2).map((cam) => {
                    const incidentForThumb = allIncidents.find(inc => inc.cameraId === cam.id);
                    return (
                      <button key={cam.id} onClick={() => incidentForThumb ? onIncidentSelect(incidentForThumb) : onIncidentSelect(cam)} className="relative w-40 h-24 bg-slate-800 rounded-md overflow-hidden border-2 border-slate-700 hover:border-blue-400 transition-all">
                        {incidentForThumb ? <Image src={incidentForThumb.thumbnailUrl} alt={`View of ${cam.location}`} fill className="object-cover" /> : <div className="flex items-center justify-center h-full"><CameraOff className="h-6 w-6 text-slate-600"/></div>}
                        <div className="absolute bottom-0 left-0 text-xs bg-black/50 text-white p-1 truncate w-full">{cam.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="h-24 flex-shrink-0">
                <InteractiveTimeline allIncidents={allIncidents} onIncidentSelect={onIncidentSelect} selectedItem={null}/>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="default-view"
              variants={viewVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full flex flex-col gap-4"
            >
              <div className="relative flex-grow rounded-lg overflow-hidden shadow-lg">
                <Image key={incident.id} src={incident.thumbnailUrl} alt={`View of ${incident.camera.location}`} fill className="object-cover" priority />
                <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-4 w-full"><p className="font-bold text-lg text-white drop-shadow-lg">{incidentTimestamp}</p></div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 text-slate-300">
                  <Cctv className="h-5 w-5" />
                  <h3 className="font-semibold">{incident.camera.name} - {incident.camera.location}</h3>
                </div>
                <div className="flex gap-3 mt-3">
                  {otherCameras.map((cam) => {
                    const incidentForThumb = allIncidents.find(inc => inc.cameraId === cam.id);
                    return (
                      <button key={cam.id} onClick={() => incidentForThumb ? onIncidentSelect(incidentForThumb) : onIncidentSelect(cam)} className="relative w-32 h-20 bg-slate-800/70 rounded-md border-2 border-slate-700 hover:border-slate-600 transition-all">
                        {incidentForThumb ? <Image src={incidentForThumb.thumbnailUrl} alt={`View of ${cam.location}`} fill className="object-cover" /> : <div className="flex items-center justify-center h-full"><CameraOff className="h-6 w-6 text-slate-600" /></div>}
                        <div className="absolute bottom-0 left-0 text-xs bg-black/50 text-white p-1 truncate w-full">{cam.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Toggle Button is now outside the animated container */}
      <div className="flex-shrink-0 flex items-center justify-end pt-2">
         <button onClick={() => setIsTimelineVisible(!isTimelineVisible)} className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors p-2 rounded-md hover:bg-slate-800">
            <ChevronsUp className={`h-4 w-4 transition-transform duration-300 ${isTimelineVisible ? 'rotate-180' : ''}`} />
            <span>{isTimelineVisible ? 'Hide Timeline' : 'Show Timeline'}</span>
         </button>
      </div>
    </div>
  );
}