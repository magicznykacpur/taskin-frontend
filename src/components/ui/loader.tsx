import { LoaderCircle } from "lucide-react";
import { cn } from "../../lib/utils";

type LoaderProps = {
  width?: number;
  height?: number;
  className?: string;
};
const Loader = ({
  width = 16,
  height = 16,
  className,
}: LoaderProps) => (
  <LoaderCircle
    width={width}
    height={height}
    className={cn("animate-spin", className)}
  />
);

export default Loader;
