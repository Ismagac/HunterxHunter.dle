import { useState, useEffect } from 'react';
import './App.css';

// Definición de tipos
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
}

interface User {
  name: string;
  score: number;
}

function App() {
  // Estados principales
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  
  // Preguntas de ejemplo sobre Hunter x Hunter
  useEffect(() => {
    const quizQuestions: QuizQuestion[] = [
      {
        id: 1,
        question: "¿Cuál es la habilidad Nen de Gon Freecss?",
        options: ["Jajanken", "Chain Jail", "Bungee Gum", "Emperor Time"],
        correctAnswer: 0,
        image: "gon.jpg"
      },
      {
        id: 2,
        question: "¿Quién es el presidente de la Asociación de Cazadores al inicio de la serie?",
        options: ["Netero", "Pariston Hill", "Cheadle Yorkshire", "Ging Freecss"],
        correctAnswer: 0,
        image: "netero.jpg"
      },
      {
        id: 3,
        question: "¿Cuál de estos personajes pertenece a la Brigada Fantasma?",
        options: ["Leorio", "Feitan", "Morel", "Palm"],
        correctAnswer: 1,
        image: "phantom.jpg"
      },
      {
        id: 4,
        question: "¿Qué tipo de Nen utiliza Kurapika para su cadena del juicio?",
        options: ["Emisión", "Manipulación", "Materialización", "Especialización"],
        correctAnswer: 2,
        image: "kurapika.jpg"
      },
      {
        id: 5,
        question: "¿Cuál es el nombre de la isla donde se realiza el examen final de Cazador?",
        options: ["Isla Ballena", "Isla Greed", "Isla Zevil", "Ciudad de York"],
        correctAnswer: 2,
        image: "island.jpg"
      }
    ];
    
    setQuestions(quizQuestions);
  }, []);
  
  // Iniciar el juego
  const startGame = () => {
    if (userName.trim() === '') return;
    
    setGameState('playing');
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
  };
  
  // Manejar selección de respuesta
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };
  
  // Pasar a la siguiente pregunta
  const handleNextQuestion = () => {
    // Verificar si la respuesta es correcta
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Avanzar a la siguiente pregunta o finalizar
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
    } else {
      finishGame();
    }
  };
  
  // Finalizar el juego
  const finishGame = () => {
    // Añadir el usuario actual al ranking
    const newUser: User = {
      name: userName,
      score: selectedOption === questions[currentQuestionIndex].correctAnswer 
        ? score + 1 
        : score
    };
    
    setUsers([...users, newUser].sort((a, b) => b.score - a.score));
    setGameState('result');
  };
  
  // Reiniciar el juego
  const restartGame = () => {
    setGameState('start');
    setUserName('');
    setSelectedOption(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Hunter × Hunter Quiz</h1>
      </header>

      <main className="app-content">
        {gameState === 'start' && (
          <div className="start-screen">
            <h2>Bienvenido al Quiz de Hunter × Hunter</h2>
            <p>Pon a prueba tu conocimiento sobre el universo de Togashi</p>
            
            <div className="name-input">
              <label htmlFor="userName">Tu nombre de Cazador:</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ingresa tu nombre"
              />
            </div>
            
            <button 
              className="start-button"
              onClick={startGame}
              disabled={userName.trim() === ''}
            >
              ¡Empezar el Quiz!
            </button>
          </div>
        )}

        {gameState === 'playing' && questions.length > 0 && (
          <div className="quiz-container">
            <div className="question-counter">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </div>
            
            <div className="question">
              <h3>{questions[currentQuestionIndex].question}</h3>
              
              {questions[currentQuestionIndex].image && (
                <div className="question-image">
                  <img 
                    src={`/images/${questions[currentQuestionIndex].image}`}
                    alt={`Imagen para pregunta ${currentQuestionIndex + 1}`}
                  />
                </div>
              )}
              
              <div className="options">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <div 
                    key={index}
                    className={`option ${selectedOption === index ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    {option}
                  </div>
                ))}
              </div>
              
              <button 
                className="next-button"
                onClick={handleNextQuestion}
                disabled={selectedOption === null}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
              </button>
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className="result-screen">
            <h2>¡Quiz completado!</h2>
            <div className="user-score">
              <p>Tu puntuación, {userName}:</p>
              <div className="score">{score} de {questions.length}</div>
            </div>
            
            <div className="ranking">
              <h3>Ranking de Cazadores</h3>
              <ul>
                {users.map((user, index) => (
                  <li key={index} className={user.name === userName ? 'current-user' : ''}>
                    {index + 1}. {user.name}: {user.score} puntos
                  </li>
                ))}
              </ul>
            </div>
            
            <button className="restart-button" onClick={restartGame}>
              ¡Intentar de nuevo!
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;