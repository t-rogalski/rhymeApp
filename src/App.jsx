import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const VOWELS = ['a', 'ą', 'e', 'ę', 'i', 'o', 'ó', 'u', 'y'];

const countSyllables = (word) => {
  if (!word) return 0;
  return word
    .toLowerCase()
    .split('')
    .filter((char) => VOWELS.includes(char)).length;
};

function App() {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
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
      setTimeout(() => {
        setCurrentWord(
          filteredWords[Math.floor(Math.random() * filteredWords.length)]
        );
      }, 0);
    }
  }, [filteredWords, currentWord]);

  const handleRandomize = () => {
    if (filteredWords.length > 0) {
      const randomWord =
        filteredWords[Math.floor(Math.random() * filteredWords.length)];
      setCurrentWord(randomWord);
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
      }}
    >
      <h1 style={{ fontSize: '3rem', margin: 0 }}>{currentWord}</h1>
      <button
        onClick={handleRandomize}
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
        Losuj
      </button>

      <div
        style={{
          marginTop: '1rem',
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
            min='1'
            max='15'
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '60px',
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
            min='1'
            max='15'
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '60px',
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: '0.9rem', color: '#888' }}>
        Dostępnych słów: {filteredWords.length}
      </div>

      <Link to='/advanced' style={{ marginTop: '1rem', fontSize: '1rem' }}>
        Przejdź do trybu zaawansowanego
      </Link>
    </div>
  );
}

export default App;
