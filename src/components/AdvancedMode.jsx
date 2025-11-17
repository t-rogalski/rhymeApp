import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const VOWELS = ['a', 'ą', 'e', 'ę', 'i', 'o', 'ó', 'u', 'y'];

const countSyllables = (word) => {
  if (!word) return 0;
  return word
    .toLowerCase()
    .split('')
    .filter((char) => VOWELS.includes(char)).length;
};

function AdvancedMode() {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timerDuration, setTimerDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [minSyllables, setMinSyllables] = useState(1);
  const [maxSyllables, setMaxSyllables] = useState(15);

  const filteredWords = useMemo(() => {
    return words.filter((word) => {
      const syllables = countSyllables(word);
      return syllables >= minSyllables && syllables <= maxSyllables;
    });
  }, [words, minSyllables, maxSyllables]);

  useEffect(() => {
    fetch('/pl_words.txt')
      .then((response) => response.text())
      .then((text) => {
        const wordList = text.split('\n').filter((word) => word.trim() !== '');
        setWords(wordList);
      });
  }, []);

  useEffect(() => {
    if (filteredWords.length > 0 && !currentWord) {
      // Użyj setTimeout, żeby uniknąć synchronicznego setState w effect
      setTimeout(() => {
        setCurrentWord(
          filteredWords[Math.floor(Math.random() * filteredWords.length)]
        );
      }, 0);
    }
  }, [filteredWords, currentWord]);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setScore((currentScore) => {
              if (currentScore > highScore) {
                setHighScore(currentScore);
              }
              return currentScore;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, highScore]);

  const handleStartStop = () => {
    if (isPlaying) {
      // STOP
      setIsPlaying(false);
      setTimeLeft(timerDuration);
      if (score > highScore) {
        setHighScore(score);
      }
    } else {
      // START
      setScore(0);
      setTimeLeft(timerDuration);
      setIsPlaying(true);
      if (filteredWords.length > 0) {
        setCurrentWord(
          filteredWords[Math.floor(Math.random() * filteredWords.length)]
        );
      }
    }
  };

  const handleNext = () => {
    if (isPlaying && filteredWords.length > 0) {
      const randomWord =
        filteredWords[Math.floor(Math.random() * filteredWords.length)];
      setCurrentWord(randomWord);
      setScore((prev) => prev + 1);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '2rem',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        Najlepszy wynik: {highScore}
      </div>

      <h1 style={{ fontSize: '3rem', margin: 0 }}>{currentWord}</h1>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleStartStop}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            cursor: 'pointer',
            borderRadius: '8px',
            border: '2px solid #646cff',
            backgroundColor: '#646cff',
            color: 'white',
          }}
        >
          {isPlaying ? 'STOP' : 'START'}
        </button>

        <button
          onClick={handleNext}
          disabled={!isPlaying}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            cursor: isPlaying ? 'pointer' : 'not-allowed',
            borderRadius: '8px',
            border: '2px solid #646cff',
            backgroundColor: isPlaying ? '#646cff' : '#cccccc',
            color: 'white',
            opacity: isPlaying ? 1 : 0.5,
          }}
        >
          DALEJ
        </button>
      </div>

      <div
        style={{ fontSize: '1.5rem', marginTop: '1rem', textAlign: 'center' }}
      >
        <div>Punkty: {score}</div>
        <div>Czas: {timeLeft}s</div>
      </div>

      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <label htmlFor='timer'>Czas gry:</label>
        <input
          id='timer'
          type='number'
          value={timerDuration}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            setTimerDuration(value);
            if (!isPlaying) {
              setTimeLeft(value);
            }
          }}
          disabled={isPlaying}
          min='10'
          max='300'
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '80px',
            opacity: isPlaying ? 0.5 : 1,
            cursor: isPlaying ? 'not-allowed' : 'text',
          }}
        />
        <span>sekund</span>
      </div>

      <div
        style={{
          marginTop: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <label>Liczba sylab:</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor='minSyllables'>od</label>
          <input
            id='minSyllables'
            type='number'
            value={minSyllables}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setMinSyllables(Math.max(1, Math.min(value, maxSyllables)));
            }}
            disabled={isPlaying}
            min='1'
            max='15'
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '60px',
              opacity: isPlaying ? 0.5 : 1,
              cursor: isPlaying ? 'not-allowed' : 'text',
            }}
          />
          <label htmlFor='maxSyllables'>do</label>
          <input
            id='maxSyllables'
            type='number'
            value={maxSyllables}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 15;
              setMaxSyllables(Math.max(minSyllables, Math.min(value, 15)));
            }}
            disabled={isPlaying}
            min='1'
            max='15'
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '60px',
              opacity: isPlaying ? 0.5 : 1,
              cursor: isPlaying ? 'not-allowed' : 'text',
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: '0.9rem', color: '#888' }}>
        Dostępnych słów: {filteredWords.length}
      </div>

      <Link to='/'>Wróć do trybu podstawowego</Link>
    </div>
  );
}

export default AdvancedMode;
