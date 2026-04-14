import { useEffect, useState } from "react";
import { getRandomText } from "./assets/data";
import TypingArea from "./components/TypingArea";
import ConfigBar from "./components/ConfigBar";
import Stats from "./components/Stats";
import useStore from "./store";
import clsx from "clsx";
import ResultDialog from "./components/ResultDialog";

function App() {
  const [practiceText, setPracticeText] = useState(getRandomText());
  const [appState, setAppState] = useState<"idle" | "active" | "result">(
    "idle"
  );
  const [isFocused, setIsFocused] = useState(false);

  const incrStat = useStore((state) => state.incrStat);
  const reset = useStore((state) => state.reset);

  useEffect(() => {
    if (appState !== "active") return;

    const timer = setInterval(() => {
      incrStat("secElapsed");
    }, 1000);

    return () => clearInterval(timer);
  }, [appState, incrStat]);

  const handleReset = () => {
    setAppState("idle");
    setPracticeText(getRandomText());
    reset();
    setIsFocused(false);
  };

  return (
    <main className="h-screen w-full flex flex-col justify-center items-center p-8 bg-pink-50 text-neutral-200 relative">
      <div className="absolute top-10">
        <ConfigBar />
      </div>

      <Stats wordCount={practiceText.match(/\S+/g)?.length || 0} />

      {/* Typing + overlay wrapper */}
      <div className="max-w-screen-xl relative p-4">
        {/* overlay */}
        {!isFocused && (
          <button
            type="button"
            onClick={() => setIsFocused(true)}
            className={clsx(
              "z-20 flex justify-center items-center absolute inset-0 backdrop-blur transition-all",
              "visible opacity-100 scale-105"
            )}
          >
            <span className="font-medium text-lg text-black/60">
              Click here to begin
            </span>
          </button>
        )}

        <TypingArea
          text={practiceText}
          onStart={() => {
            setAppState("active");
            setIsFocused(true);
          }}
          onFinish={() => setAppState("result")}
        />
      </div>

      {/* Result Dialog */}
      <ResultDialog
        onReset={handleReset}
        open={appState === "result"}
      />
    </main>
  );
}

export default App;