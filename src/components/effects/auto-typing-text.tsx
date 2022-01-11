import { useEffect, useState } from 'react';

import style from '@/sass/home.module.scss';

interface AutoTypingTextProps {
  listOfWords: string[];
  delay?: number;
}

export default function AutoTypingText(props: AutoTypingTextProps) {
  const { listOfWords = [], delay = 200 } = props;
  const [currentWord, setCurrentWord] = useState(0);
  const [currentLetter, setCurrentLetter] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDeleting) {
        setCurrentLetter(currentLetter - 1);
        if (currentLetter === 0) {
          setIsDeleting(false);
          setCurrentWord((currentWord + 1) % listOfWords.length);
        }
      } else {
        setCurrentLetter(currentLetter + 1);
        if (currentLetter === listOfWords[currentWord].length) {
          setIsDeleting(true);
        }
      }
    }, delay);
    return () => clearInterval(interval);
  }, [currentWord, currentLetter, isDeleting, listOfWords, delay]);

  return (
    <span className={style.txt_rotate}>
      {listOfWords[currentWord].substring(0, currentLetter)}
      <span className={style.text_cusor_dynamic} />
    </span>
  );
}
