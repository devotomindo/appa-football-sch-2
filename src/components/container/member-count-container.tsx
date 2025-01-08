export default function MemberCountContainer({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <div className="relative space-y-4 overflow-hidden rounded-xl bg-[#1C1A1A] p-10 text-white shadow-lg">
      {children}
      <div className="bulat-3 absolute -bottom-[50%] left-[35%] z-0 h-[200px] w-[200px] rounded-full"></div>
    </div>
  );
}
