import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');

  useEffect(() => {
    fetch('/pl_words.txt')
      .then((response) => response.text())
      .then((text) => {
        const wordList = text.split('\n').filter((word) => word.trim() !== '');
        setWords(wordList);
        if (wordList.length > 0) {
          setCurrentWord(wordList[Math.floor(Math.random() * wordList.length)]);
        }
      });
  }, []);

  const handleRandomize = () => {
    if (words.length > 0) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
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
      <Link to='/advanced' style={{ marginTop: '1rem', fontSize: '1rem' }}>
        Go to Advanced Mode
      </Link>
    </div>
  );
}

export default App;
