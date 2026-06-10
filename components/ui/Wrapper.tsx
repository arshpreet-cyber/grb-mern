import { ReactNode } from "react";

export default function Wrapper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[1500px] mx-auto w-full relative ${className} px-6`}>
      {children}
    </div>
  );
}
