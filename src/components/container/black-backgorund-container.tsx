import { cn } from "@/lib/utils/styling";

export function BlackBackgroundContainer({
  children,
  className,
}: {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative space-y-4 overflow-hidden rounded-xl bg-[#1C1A1A] p-10 text-white shadow-lg max-sm:p-5",
        className,
      )}
    >
      {children}
      <div className="bulat-3 absolute z-0 h-[200px] w-[200px] -translate-y-20 translate-x-32 transform rounded-full sm:-translate-y-20 sm:translate-x-20 md:translate-x-24" />
      {/* <div className="bulat-3 absolute -bottom-[50%] left-[35%] z-0 h-[200px] w-[200px] rounded-full"/> */}
    </div>
  );
}
