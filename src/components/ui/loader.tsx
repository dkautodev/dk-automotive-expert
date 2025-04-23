
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

interface LoaderProps extends Omit<LucideProps, "ref"> {
  className?: string;
}

export const Loader = ({ className, ...props }: LoaderProps) => {
  return (
    <Loader2 
      className={cn("h-4 w-4 animate-spin", className)} 
      {...props} 
    />
  );
};
