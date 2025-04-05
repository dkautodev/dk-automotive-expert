
import React from "react";
import { Loader } from "@/components/ui/loader";
import { CardContent } from "@/components/ui/card";

interface MissionsTableSkeletonProps {
  title?: string;
}

export const MissionsTableSkeleton: React.FC<MissionsTableSkeletonProps> = ({ title }) => {
  return (
    <CardContent className="flex justify-center">
      <Loader className="h-8 w-8" />
    </CardContent>
  );
};
