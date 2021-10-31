import { useEffect, useState } from 'react';

import style from '../../sass/home.module.scss';

export default function AutoTypingText({ listOfWords = [], delay = 200 }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentLetter, setCurrentLetter] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      //  Check if deleting or writing
      if (isDeleting) {
        //  If deleting, decrement letter
        setCurrentLetter(currentLetter - 1);
        //  If letter is 0, stop deleting and pass to next word
        if (currentLetter === 0) {
          setIsDeleting(false);
          setCurrentWord((currentWord + 1) % listOfWords.length);
        }
      } else {
        //  If not deleting, increment letter
        setCurrentLetter(currentLetter + 1);
        //  If letter is last letter of word, start deleting
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
