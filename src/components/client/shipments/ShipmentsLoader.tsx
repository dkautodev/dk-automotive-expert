
import React from "react";
import { Loader } from "@/components/ui/loader";

export const ShipmentsLoader: React.FC = () => {
  return (
    <div className="p-6 flex justify-center">
      <Loader className="h-8 w-8" />
    </div>
  );
};
