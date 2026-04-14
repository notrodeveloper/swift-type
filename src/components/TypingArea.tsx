import React, { useState } from "react";
import clsx from "clsx";
import useStore from "../store";

interface IProps extends React.ComponentProps<"div"> {
  text: string;
  onStart?: () => void;
  onFinish?: () => void;
}

export default function TypingArea({
  text,
  onStart,
  onFinish,
  ...props
}: IProps) {
  const words = text.split(" ");

  const [currWordIdx, setCurrWordIdx] = useState(0);
  const [currLetterIdx, setCurrLetterIdx] = useState<number[]>([0]);
  const [typos, setTypos] = useState(new Set<`${number}-${number}`>());
  const [started, setStarted] = useState(false); // prevent multiple calls
  const [finished, setFinished] = useState(false); //  prevent multiple calls

  const incrStat = useStore((state) => state.incrStat);
  const caseSensitive = useStore((state) => state.config.caseSensitive);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const word = words[currWordIdx];
    const typed = e.key;

    const isPrintable = typed.length === 1;
    if (!isPrintable && typed !== "Backspace" && typed !== " ") return;

    const idx = currLetterIdx[currWordIdx] || 0;

    // START (first valid keypress)
    if (!started && isPrintable) {
      setStarted(true);
      onStart?.();
    }

    // 🔙 Backspace
    if (typed === "Backspace") {
      setCurrLetterIdx((prev) => {
        const updated = [...prev];
        updated[currWordIdx] = Math.max(idx - 1, 0);
        return updated;
      });
      return;
    }

    // ⏭ Move to next word
    if (idx === word.length) {
      if (typed !== " ") return;

      //  FINISH (last word completed)
      if (currWordIdx === words.length - 1 && !finished) {
        setFinished(true);
        onFinish?.();
        return;
      }

      setCurrWordIdx((i) => i + 1);
      setCurrLetterIdx((prev) => {
        const updated = [...prev];
        updated[currWordIdx + 1] = 0;
        return updated;
      });
      return;
    }

    const expected = word[idx];

    if (isPrintable && expected !== undefined) {
      const typedChar = caseSensitive ? typed : typed.toLowerCase();
      const expectedChar = caseSensitive
        ? expected
        : expected.toLowerCase();

      // typo
      if (typedChar !== expectedChar) {
        setTypos((prev) => {
          const next = new Set(prev);
          next.add(`${currWordIdx}-${idx}`);
          return next;
        });

        incrStat("typos");
      }

      // ➡️ advance cursor
      setCurrLetterIdx((prev) => {
        const updated = [...prev];
        updated[currWordIdx] = idx + 1;
        return updated;
      });

      incrStat("typedCharCount");
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      role="textbox"
      tabIndex={0}
      className="flex flex-wrap focus:outline-none relative font-mono text-3xl"
      {...props}
    >
      {words.map((word, widx) => {
        const isCurrWord = widx === currWordIdx;

        return (
          <div
            key={word + widx}
            className={clsx(
              "z-10 relative px-2.5 py-1 rounded-md transition-all",
              widx > currWordIdx && "text-neutral-600",
              widx < currWordIdx && "text-neutral-100"
            )}
          >
            {word.split("").map((ltr, lidx) => {
              const isTypo = typos.has(`${widx}-${lidx}`);
              const isCorrect =
                lidx < (currLetterIdx[widx] || 0) && !isTypo;

              return (
                <span
                  key={ltr + lidx}
                  className={clsx(
                    isCorrect && "text-pink-500",
                    isTypo && "text-red-500"
                  )}
                >
                  {ltr}
                </span>
              );
            })}

            {/* highlight current word */}
            <div
              className={clsx(
                "absolute transition-all inset-0 bg-neutral-800/10 rounded-md z-0 origin-left",
                isCurrWord ? "scale-x-100" : "scale-x-0"
              )}
            />

            {/* cursor */}
            {isCurrWord && (
              <div
                className="transition-all duration-100 rounded ease-linear absolute h-9 w-0.5 top-1 bg-pink-800"
                style={{
                  left: `${8 + (currLetterIdx[currWordIdx] || 0) * 18}px`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}