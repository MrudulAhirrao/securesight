// app/(dashboard)/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Camera, Incident } from '@prisma/client';
import Navbar from '@/components/layout/Navbar';
import IncidentPlayer from '@/components/features/incidents/IncidentPlayer';
import IncidentList from '@/components/features/incidents/IncidentList';

// This line is crucial for Vercel deployment. It prevents build errors
// by ensuring the page is always rendered dynamically.
export const dynamic = 'force-dynamic';

export type IncidentWithCamera = Incident & { camera: Camera };

export default function DashboardPage() {
  const [initialIncidents, setInitialIncidents] = useState<IncidentWithCamera[]>([]);
  const [displayIncidents, setDisplayIncidents] = useState<IncidentWithCamera[]>([]);
  const [allCameras, setAllCameras] = useState<Camera[]>([]);
  const [selectedItem, setSelectedItem] = useState<IncidentWithCamera | Camera | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefilling, setIsRefilling] = useState(false);

  const refillIncidents = async () => {
    if (isRefilling) return;
    setIsRefilling(true);
    try {
      const addResponse = await fetch('/api/incidents/add', { method: 'POST' });
      if (!addResponse.ok) throw new Error('Failed to add new incidents');

      const listResponse = await fetch('/api/incidents');
      const fullUpdatedList = await listResponse.json();

      if (fullUpdatedList) {
        setInitialIncidents(fullUpdatedList);
        setDisplayIncidents(fullUpdatedList);
        
        if (!selectedItem && fullUpdatedList.length > 0) {
          setSelectedItem(fullUpdatedList[0]);
        } else if (displayIncidents.length === 0 && fullUpdatedList.length > 0) {
          setSelectedItem(fullUpdatedList[0]);
        }
      }
    } catch (error) {
      console.error('Failed to refill incidents:', error);
    } finally {
      setIsRefilling(false);
    }
  };

  const handleResolve = (incidentId: string) => {
    fetch(`/api/incidents/${incidentId}/resolve`, { method: 'PATCH' });
    const newDisplayIncidents = displayIncidents.filter((inc) => inc.id !== incidentId);
    setDisplayIncidents(newDisplayIncidents);

    if (selectedItem && 'id' in selectedItem && selectedItem.id === incidentId) {
      setSelectedItem(newDisplayIncidents.length > 0 ? newDisplayIncidents[0] : null);
    }

    if (newDisplayIncidents.length <= 4) {
      refillIncidents();
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [incidentsRes, camerasRes] = await Promise.all([ fetch('/api/incidents'), fetch('/api/cameras') ]);
        if (!incidentsRes.ok || !camerasRes.ok) throw new Error('Failed to fetch initial data');
        const incidentsData = await incidentsRes.json();
        const camerasData = await camerasRes.json();
        setInitialIncidents(incidentsData);
        setDisplayIncidents(incidentsData);
        setAllCameras(camerasData);
        if (incidentsData.length > 0) setSelectedItem(incidentsData[0]);
      } catch (error) { console.error(error); } 
      finally { setIsLoading(false); }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      <Navbar />
      {/* RESPONSIVE LAYOUT: Stacks vertically on mobile, switches to horizontal on large screens */}
      <main className="flex flex-col lg:flex-row flex-1 gap-4 p-4 min-h-0">
        {/* Player Column */}
        <div className="lg:flex-[2] bg-slate-900 border border-slate-800 rounded-lg min-h-[50vh] lg:min-h-0">
          <IncidentPlayer
            selectedItem={selectedItem}
            allCameras={allCameras}
            allIncidents={initialIncidents}
            onIncidentSelect={setSelectedItem}
            isLoading={isLoading}
          />
        </div>
        {/* List Column */}
        <div className="lg:flex-[1] flex flex-col min-h-[40vh] lg:min-h-0">
          <IncidentList
            incidents={displayIncidents}
            isLoading={isLoading}
            isRefilling={isRefilling}
            selectedItemId={selectedItem?.id}
            onIncidentSelect={setSelectedItem}
            onResolve={handleResolve}
          />
        </div>
      </main>
    </div>
  );
}
