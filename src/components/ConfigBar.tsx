import clsx from "clsx";
import useStore from "../store";
import {
  AreaChart,
  CaseSensitive,
  InfinityIcon,
  Timer,
  WholeWord,
} from "lucide-react";

export default function ConfigBar() {
  const config = useStore((state) => state.config);
  const changeMode = useStore((state) => state.changeMode);
  const toggleRealtimeStats = useStore((state) => state.toggleRealtimeStats);
  const toggleCaseSensitive = useStore((state) => state.toggleCaseSensitive);

  return (
    <div
      className={clsx(
        "flex gap-4 p-2 rounded-xl bg-pink-50 mb-4",
        config.mode === "zen" &&
          "opacity-20 hover:opacity-100 transition-opacity"
      )}
    >
      <ConfigButton
        onClick={() => changeMode("time")}
        className={
          config.mode === "time" ? "bg-pink-400" : "text-neutral-500"
        }
      >
        <Timer size={20} /> Time
      </ConfigButton>

      <ConfigButton
        onClick={() => changeMode("words")}
        className={
          config.mode === "words" ? "bg-pink-400" : "text-neutral-500"
        }
      >
        <WholeWord size={20} /> Words
      </ConfigButton>

      <ConfigButton
        onClick={() => changeMode("zen")}
        className={
          config.mode === "zen" ? "bg-pink-400" : "text-neutral-500"
        }
      >
        <InfinityIcon size={20} /> Zen
      </ConfigButton>

      <div className="w-0.5 bg-pink-500/10" />

      <ConfigButton
        onClick={() => toggleRealtimeStats()}
        className={
          config.showRealtimeStats
            ? "text-cyan-500 bg-cyan-500/20"
            : "text-neutral-300"
        }
      >
        <AreaChart size={20} /> Realtime Stats
      </ConfigButton>

      <ConfigButton
        onClick={() => toggleCaseSensitive()}
        className={
          config.caseSensitive
            ? "text-indigo-500 bg-indigo-500/20"
            : "text-neutral-300"
        }
      >
        <CaseSensitive size={20} /> Case Sensitive
      </ConfigButton>
    </div>
  );
}

import type { ComponentProps } from "react";

function ConfigButton({
  className,
  children,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-lg",
        "transition-all duration-200 ease-in-out",
        "hover:bg-pink-200 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}