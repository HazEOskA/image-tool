import type { CSSProperties } from 'react';

type Props = {
  text: string;
  size?: 'hero' | 'section' | 'card';
  className?: string;
};

type LetterStyle = CSSProperties & { '--i': number; '--r': string; '--y': string };

const ROTATIONS = [-2, 1, -1, 2, -1, 1, -2, 1];
const LIFTS = [1, -2, 0, -1, 2, -1, 1, -2];

export default function WildStyleText({ text, size = 'section', className = '' }: Props) {
  const words = text.trim().split(/\s+/);

  return (
    <span className={`wildstyle-title wildstyle-${size} ${className}`} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span className="wildstyle-word" key={`${word}-${wordIndex}`} aria-hidden="true">
          {Array.from(word).map((letter, letterIndex) => {
            const i = wordIndex * 7 + letterIndex;
            const style: LetterStyle = {
              '--i': i,
              '--r': `${ROTATIONS[i % ROTATIONS.length]}deg`,
              '--y': `${LIFTS[i % LIFTS.length]}px`,
            };
            return (
              <span className="wildstyle-letter" data-letter={letter} style={style} key={`${letter}-${letterIndex}`}>
                {letter}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
