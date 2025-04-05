
import React from "react";
import { Loader } from "@/components/ui/loader";
import { CardContent } from "@/components/ui/card";

interface MissionsTableSkeletonProps {
  message?: string;
}

export const MissionsTableSkeleton: React.FC<MissionsTableSkeletonProps> = ({ message }) => {
  return (
    <CardContent className="py-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader className="h-10 w-10" />
        <p className="text-muted-foreground text-sm">
          {message || "Chargement des missions..."}
        </p>
      </div>
    </CardContent>
  );
};
