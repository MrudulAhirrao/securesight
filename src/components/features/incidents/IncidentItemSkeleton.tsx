// src/components/features/incidents/IncidentItemSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function IncidentItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-2">
      <Skeleton className="h-[60px] w-[100px] rounded-md" />
      <div className="flex-grow space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}