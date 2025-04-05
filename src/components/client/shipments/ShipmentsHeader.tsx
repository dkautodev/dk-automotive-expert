
import { FC } from "react";

interface ShipmentsHeaderProps {
  title: string;
}

export const ShipmentsHeader: FC<ShipmentsHeaderProps> = ({ title }) => {
  return (
    <h1 className="text-3xl font-bold mb-6">{title}</h1>
  );
};
