import useStore from "../store";

export default function Stats({ wordCount }: { wordCount: number }) {
  const stats = useStore((state) => state.stats);
  const config = useStore((state) => state.config);
  const calcWPM = useStore((state) => state.calcWPM);
  const calcAccuracy = useStore((state) => state.calcAccuracy);

  const wpm = calcWPM();
  const accuracy = calcAccuracy();

  return (
    <div>
      {/* Top Display */}
      <div className="text-center font-mono mb-2 space-y-2">
        <div className="text-cyan-500 text-2xl">
          {config.mode === "time" && stats.secElapsed}
          {config.mode === "words" &&
            `${stats.wordCount}/${wordCount}`}
        </div>
      </div>

      {/* Realtime Stats */}
      {config.showRealtimeStats && (
        <div className="flex gap-4 flex-wrap">
          <StatBox label="Elapsed" value={`${stats.secElapsed}s`} />
          <StatBox label="WPM" value={wpm.toFixed(1)} />
          <StatBox
            label="Accuracy"
            value={
              stats.typedCharCount === 0
                ? "N/A"
                : `${accuracy.toFixed(1)}%`
            }
          />
          <StatBox
            label="Typos"
            value={stats.typos}
            className="text-red-500"
          />
        </div>
      )}
    </div>
  );
}

/* Small reusable component */
function StatBox({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <span
      className={`bg-neutral-500/20 px-2 py-1 rounded font-medium ${className}`}
    >
      {label}: {value}
    </span>
  );
}