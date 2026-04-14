import { useEffect, useState } from "react";
import clsx from "clsx";
import { RotateCcw } from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import useStore from "../store";

interface IProps extends React.ComponentProps<"dialog"> {
  onReset: () => void;
}

export default function ResultDialog({ onReset, open, ...props }: IProps) {
  const stats = useStore((state) => state.stats);
  const calcWPM = useStore((state) => state.calcWPM);
  const calcAccuracy = useStore((state) => state.calcAccuracy);

  const [wpmData, setWpmData] = useState<
    { sec: number; wpm: number; rawWpm: number }[]
  >([]);

  useEffect(() => {
    if (!open) return;
    if (stats.secElapsed <= 0) return;

    setWpmData((data) => [
      ...data,
      {
        sec: stats.secElapsed,
        rawWpm: calcWPM(),
        wpm: calcWPM(stats.secElapsed, stats.typedCharCount - stats.typos),
      },
    ]);
  }, [stats.secElapsed, open]);

  const handleReset = () => {
    setWpmData([]);
    onReset();
  };

  return (
    <div
      className={clsx(
        "z-20 absolute flex justify-center items-center bg-black/40 backdrop-blur",
        open && "inset-0"
      )}
    >
      <dialog
        open={open}
        className="mx-auto p-8 rounded-xl bg-neutral-800/80 text-white text-center w-[900px]"
        {...props}
      >
        <h2 className="text-xl font-bold mb-6">Results</h2>

        {/* Stats */}
        <div className="flex gap-8 items-center justify-center my-6">
          <div>
            <div className="text-4xl font-black">
              {calcWPM().toFixed(1)}
            </div>
            <div className="text-neutral-400">WPM</div>
          </div>

          <div>
            <div className="text-4xl font-black">
              {stats.secElapsed}
            </div>
            <div className="text-neutral-400">sec</div>
          </div>

          <div>
            <div className="text-4xl font-black">
              {calcAccuracy().toFixed(1)}%
            </div>
            <div className="text-neutral-400">Accuracy</div>
          </div>
        </div>

        {/* Chart */}
        {open && (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={wpmData}>
              <CartesianGrid opacity={0.1} strokeDasharray="3 3" />

              <YAxis
                fontSize={12}
                axisLine={false}
                tickLine={false}
                width={30}
              />

              <Tooltip
                cursor={false}
                content={({ payload, label }) => (
                  <div className="text-sm font-mono text-left bg-neutral-900/90 px-4 py-2 rounded border border-neutral-800">
                    <p>
                      <span className="text-lg">{label}</span> sec
                    </p>
                    <p>
                      <span className="text-lg">
                        {payload?.[0]?.value}
                      </span>{" "}
                      WPM
                    </p>
                  </div>
                )}
              />

              <Area
                type="monotone"
                dataKey="rawWpm"
                stroke="#a3a3a3"
                fill="#a3a3a3"
                fillOpacity={0.2}
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />

              <Area
                type="monotone"
                dataKey="wpm"
                stroke="#38bdf8"
                fill="#38bdf8"
                fillOpacity={0.2}
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* Reset */}
        <button
          type="button"
          onClick={handleReset}
          className="mt-6 rounded-full p-3 transition-colors hover:bg-neutral-700/30"
        >
          <RotateCcw />
        </button>
      </dialog>
    </div>
  );
}