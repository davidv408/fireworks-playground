import { FC, ReactNode } from "react";

interface ChatResponseProps {
  icon: ReactNode;
  timestamp: Date;
  className?: string;
  children: ReactNode;
}
export const ChatResponse: FC<ChatResponseProps> = ({
  icon,
  timestamp,
  className,
  children,
}) => {
  return (
    <div
      className={`flex gap-4 pb-4 mb-4 border-b last:border-b-0 ${className}`}
    >
      <div className="flex flex-col">
        <span className="w-[20px] flex-shrink-0 mb-1">{icon}</span>
        <span className="text-xs whitespace-nowrap">
          {timestamp.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </div>
      <div className="flex-grow-1">{children}</div>
    </div>
  );
};
