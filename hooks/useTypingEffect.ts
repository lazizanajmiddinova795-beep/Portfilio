"use client";

import { useEffect, useRef, useState } from "react";

export function useTypingEffect(
  words: readonly string[],
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000
): string {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];

    const tick = () => {
      if (!isDeleting) {
        // Typing
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText.length + 1 === currentWord.length) {
          // Pause before deleting
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
          return;
        }
      } else {
        // Deleting
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText.length - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          return;
        }
      }

      timeoutRef.current = setTimeout(
        tick,
        isDeleting ? deletingSpeed : typingSpeed
      );
    };

    timeoutRef.current = setTimeout(
      tick,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}
