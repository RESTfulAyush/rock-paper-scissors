import React, { useState } from 'react';

function App() {
  // Game logic utilities
  const getComputerChoice = () => {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
  };

  const determineWinner = (player, computer) => {
    if (player === computer) return 'draw';
    
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'player';
    }
    
    return 'computer';
  };

  // Constants
  const CHOICES = ['rock', 'paper', 'scissors'];
  const CHOICE_ICONS = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
  };

  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);

  const handlePlay = (choice) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPlayerChoice(choice);
    setComputerChoice(null);
    setResult('');
    
    // Simulate computer "thinking"
    setTimeout(() => {
      const computerSelection = getComputerChoice();
      setComputerChoice(computerSelection);
      
      const gameResult = determineWinner(choice, computerSelection);
      setResult(gameResult);
      
      // Update score
      if (gameResult === 'player') {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
      } else if (gameResult === 'computer') {
        setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
      }
      
      // Add to history
      setGameHistory(prev => [
        { 
          id: Date.now(), 
          player: choice, 
          computer: computerSelection, 
          result: gameResult 
        },
        ...prev.slice(0, 4) // Keep last 5 games
      ]);
      
      setIsAnimating(false);
    }, 500);
  };
  
  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
    setScore({ player: 0, computer: 0 });
    setGameHistory([]);
  };

  // ScoreBoard Component
  const ScoreBoard = ({ score }) => (
    <div className="flex justify-between mb-8 bg-gray-100 rounded-lg p-4">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600">You</p>
        <p className="text-2xl font-bold text-blue-600">{score.player}</p>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600">Computer</p>
        <p className="text-2xl font-bold text-red-600">{score.computer}</p>
      </div>
    </div>
  );

  // GameArea Component
  const GameArea = ({ playerChoice, computerChoice, isAnimating }) => (
    <div className="flex justify-center items-center space-x-8 mb-8">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 mb-2">Your choice</p>
        <div className="h-20 w-20 flex items-center justify-center bg-blue-100 rounded-full text-4xl">
          {playerChoice ? CHOICE_ICONS[playerChoice] : '?'}
        </div>
      </div>
      
      <div className="text-xl font-bold text-gray-800">VS</div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 mb-2">Computer</p>
        <div className={`h-20 w-20 flex items-center justify-center bg-red-100 rounded-full text-4xl ${isAnimating ? 'animate-pulse' : ''}`}>
          {computerChoice ? CHOICE_ICONS[computerChoice] : '?'}
        </div>
      </div>
    </div>
  );

  // Controls Component
  const Controls = ({ onPlay, isAnimating, selectedChoice }) => (
    <div className="mb-6">
      <p className="text-center text-gray-600 mb-3">Choose your move:</p>
      <div className="flex justify-center space-x-4">
        {CHOICES.map(choice => (
          <button
            key={choice}
            onClick={() => onPlay(choice)}
            disabled={isAnimating}
            className={`h-16 w-16 flex items-center justify-center text-3xl bg-white border-2 rounded-full shadow hover:bg-gray-50 transition-transform transform hover:scale-110 ${
              selectedChoice === choice ? 'border-blue-500' : 'border-gray-300'
            }`}
          >
            {CHOICE_ICONS[choice]}
          </button>
        ))}
      </div>
    </div>
  );

  // ResultMessage Component
  const ResultMessage = ({ result }) => {
    if (!result) return null;
    
    const getResultMessage = () => {
      if (result === 'player') return 'You win!';
      if (result === 'computer') return 'Computer wins!';
      if (result === 'draw') return "It's a draw!";
      return '';
    };
    
    return (
      <div className={`text-center text-xl font-bold mb-6 ${
        result === 'player' ? 'text-green-600' : 
        result === 'computer' ? 'text-red-600' : 'text-gray-600'
      }`}>
        {getResultMessage()}
      </div>
    );
  };

  // GameHistory Component
  const GameHistory = ({ history }) => (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Game History</h3>
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        {history.map((game, index) => (
          <div key={game.id} className={`flex justify-between items-center p-2 text-sm ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
            <div className="flex items-center">
              <span className="mr-2">{CHOICE_ICONS[game.player]}</span>
              <span>vs</span>
              <span className="ml-2">{CHOICE_ICONS[game.computer]}</span>
            </div>
            <div className={`font-medium ${
              game.result === 'player' ? 'text-green-600' : 
              game.result === 'computer' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {game.result === 'player' ? 'Win' : game.result === 'computer' ? 'Loss' : 'Draw'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Rock Paper Scissors</h1>
        
        <ScoreBoard score={score} />
        
        <GameArea 
          playerChoice={playerChoice} 
          computerChoice={computerChoice} 
          isAnimating={isAnimating} 
        />
        
        <ResultMessage result={result} />
        
        <Controls 
          onPlay={handlePlay} 
          isAnimating={isAnimating} 
          selectedChoice={playerChoice} 
        />
        
        <button 
          onClick={resetGame}
          className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
        >
          Reset Game
        </button>
        
        {gameHistory.length > 0 && (
          <GameHistory history={gameHistory} />
        )}
      </div>
    </div>
  );
}

export default App;