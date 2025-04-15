import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './AnimatedCard.css';
import axios from 'axios';

import tenOfClubs from './karty/10_of_clubs.png';
import tenOfDiamonds from './karty/10_of_diamonds.png';
import tenOfHearts from './karty/10_of_hearts.png';
import tenOfSpades from './karty/10_of_spades.png';
import twoOfClubs from './karty/2_of_clubs.png';
import twoOfDiamonds from './karty/2_of_diamonds.png';
import twoOfHearts from './karty/2_of_hearts.png';
import twoOfSpades from './karty/2_of_spades.png';
import threeOfClubs from './karty/3_of_clubs.png';
import threeOfDiamonds from './karty/3_of_diamonds.png';
import threeOfHearts from './karty/3_of_hearts.png';
import threeOfSpades from './karty/3_of_spades.png';
import fourOfClubs from './karty/4_of_clubs.png';
import fourOfDiamonds from './karty/4_of_diamonds.png';
import fourOfHearts from './karty/4_of_hearts.png';
import fourOfSpades from './karty/4_of_spades.png';
import fiveOfClubs from './karty/5_of_clubs.png';
import fiveOfDiamonds from './karty/5_of_diamonds.png';
import fiveOfHearts from './karty/5_of_hearts.png';
import fiveOfSpades from './karty/5_of_spades.png';
import sixOfClubs from './karty/6_of_clubs.png';
import sixOfDiamonds from './karty/6_of_diamonds.png';
import sixOfHearts from './karty/6_of_hearts.png';
import sixOfSpades from './karty/6_of_spades.png';
import sevenOfClubs from './karty/7_of_clubs.png';
import sevenOfDiamonds from './karty/7_of_diamonds.png';
import sevenOfHearts from './karty/7_of_hearts.png';
import sevenOfSpades from './karty/7_of_spades.png';
import eightOfClubs from './karty/8_of_clubs.png';
import eightOfDiamonds from './karty/8_of_diamonds.png';
import eightOfHearts from './karty/8_of_hearts.png';
import eightOfSpades from './karty/8_of_spades.png';
import nineOfClubs from './karty/9_of_clubs.png';
import nineOfDiamonds from './karty/9_of_diamonds.png';
import nineOfHearts from './karty/9_of_hearts.png';
import nineOfSpades from './karty/9_of_spades.png';
import aceOfClubs from './karty/ace_of_clubs.png';
import aceOfDiamonds from './karty/ace_of_diamonds.png';
import aceOfHearts from './karty/ace_of_hearts.png';
import aceOfSpades from './karty/ace_of_spades.png';
import jackOfClubs from './karty/jack_of_clubs.png';
import jackOfDiamonds from './karty/jack_of_diamonds.png';
import jackOfHearts from './karty/jack_of_hearts.png';
import jackOfSpades from './karty/jack_of_spades.png';
import kingOfClubs from './karty/king_of_clubs.png';
import kingOfDiamonds from './karty/king_of_diamonds.png';
import kingOfHearts from './karty/king_of_hearts.png';
import kingOfSpades from './karty/king_of_spades.png';
import queenOfClubs from './karty/queen_of_clubs.png';
import queenOfDiamonds from './karty/queen_of_diamonds.png';
import queenOfHearts from './karty/queen_of_hearts.png';
import queenOfSpades from './karty/queen_of_spades.png';
import cardBackground from './karty/card_background.png';

const initialCardImages = [
  tenOfClubs, tenOfDiamonds, tenOfHearts, tenOfSpades,
  twoOfClubs, twoOfDiamonds, twoOfHearts, twoOfSpades,
  threeOfClubs, threeOfDiamonds, threeOfHearts, threeOfSpades,
  fourOfClubs, fourOfDiamonds, fourOfHearts, fourOfSpades,
  fiveOfClubs, fiveOfDiamonds, fiveOfHearts, fiveOfSpades,
  sixOfClubs, sixOfDiamonds, sixOfHearts, sixOfSpades,
  sevenOfClubs, sevenOfDiamonds, sevenOfHearts, sevenOfSpades,
  eightOfClubs, eightOfDiamonds, eightOfHearts, eightOfSpades,
  nineOfClubs, nineOfDiamonds, nineOfHearts, nineOfSpades,
  aceOfClubs, aceOfDiamonds, aceOfHearts, aceOfSpades,
  jackOfClubs, jackOfDiamonds, jackOfHearts, jackOfSpades,
  kingOfClubs, kingOfDiamonds, kingOfHearts, kingOfSpades,
  queenOfClubs, queenOfDiamonds, queenOfHearts, queenOfSpades
];

const getCardValue = (cardImage) => {
  try {
    if (!cardImage) return 0;
    const filename = cardImage.split('/').pop().split('.')[0].toLowerCase();
    const valuePart = filename.includes('_of_')
      ? filename.split('_of_')[0]
      : filename.replace(/([0-9])([a-z])/, '$1 $2').split(' ')[0];

    const numberWords = {
      two: 2, three: 3, four: 4, five: 5, six: 6,
      seven: 7, eight: 8, nine: 9, ten: 10
    };

    if (numberWords[valuePart]) return numberWords[valuePart];
    if (["jack", "queen", "king"].includes(valuePart)) return 10;
    if (valuePart === 'ace') return 11;

    return parseInt(valuePart, 10) || 0;
  } catch (e) {
    console.error('Error parsing card value:', cardImage, e);
    return 0;
  }
};

const calculateHandValue = (hand) => {
  let value = hand.reduce((acc, card) => acc + getCardValue(card.image), 0);
  let aces = hand.filter(card =>
    card.image.split('/').pop().split('.')[0].toLowerCase().includes('ace')
  ).length;

  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }
  return value;
};

const AnimatedCard = ({ balance, setBalance }) => {
  const [playerHand, setPlayerHand] = useState([]);
  const [betAmount, setBetAmount] = useState(0);
  const [dealerHand, setDealerHand] = useState([]);
  const [remainingCards, setRemainingCards] = useState(initialCardImages);
  const [gameStatus, setGameStatus] = useState('waiting');
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [isDealerDrawing, setIsDealerDrawing] = useState(false);
  const [gamePhase, setGamePhase] = useState('betting');
  const [isSecondDealerCardHidden, setIsSecondDealerCardHidden] = useState(true);
  const [isDealerCardFlipping, setIsDealerCardFlipping] = useState(false);

  const dealerTimeoutRef = useRef(null);

  const handleBetChange = (e) => {
    const value = Math.max(0, Number(e.target.value));
    setBetAmount(value);
  };

  const multiplyBet = (multiplier) => {
    setBetAmount(prev => Math.max(0, Math.floor(prev * multiplier)));
  };

  // const startGame = async () => {
  //   if (betAmount <= 0 || betAmount > balance) return;
    
  //   setBalance(prev => prev - betAmount);
  //   setGameStatus('playing');
  //   setGamePhase('initial');
  //   setPlayerHand([]);
  //   setDealerHand([]);
  //   setPlayerScore(0);
  //   setDealerScore(0);
  //   setIsSecondDealerCardHidden(true);

  //   await new Promise(resolve => setTimeout(resolve, 300));
  //   const dealDelay = 500;

  //   await dealCard(setPlayerHand, setPlayerScore);
  //   await new Promise(resolve => setTimeout(resolve, dealDelay));
  //   await dealCard(setDealerHand, setDealerScore);
  //   await new Promise(resolve => setTimeout(resolve, dealDelay));
  //   await dealCard(setPlayerHand, setPlayerScore);
  //   await new Promise(resolve => setTimeout(resolve, dealDelay));
  //   await dealCard(setDealerHand, setDealerScore);

  //   setGamePhase('player-turn');
  // };


  const startGame = async () => {
    if (betAmount <= 0 || betAmount > balance) return;
  
    // Wysyłamy zakład do API
    try {
      const res = await axios.post('http://localhost:8000/api/bets/', {
        game: 1,       // ID gry (Blackjack)
        user: 1,       // Tymczasowo zakładamy ID użytkownika 1
        amount: betAmount,
        rate: 2.0      // Możesz później wyliczać dynamicznie
      });
  
      console.log('Zakład zapisany w Django:', res.data);
    } catch (err) {
      console.error('Błąd przy zapisie zakładu:', err);
      return;
    }
  
    setBalance(prev => prev - betAmount);
    setGameStatus('playing');
    setGamePhase('initial');
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerScore(0);
    setDealerScore(0);
    setIsSecondDealerCardHidden(true);
  
    await new Promise(resolve => setTimeout(resolve, 300));
    const dealDelay = 500;
  
    await dealCard(setPlayerHand, setPlayerScore);
    await new Promise(resolve => setTimeout(resolve, dealDelay));
    await dealCard(setDealerHand, setDealerScore);
    await new Promise(resolve => setTimeout(resolve, dealDelay));
    await dealCard(setPlayerHand, setPlayerScore);
    await new Promise(resolve => setTimeout(resolve, dealDelay));
    await dealCard(setDealerHand, setDealerScore);
  
    setGamePhase('player-turn');
  };
  

  const dealCard = (handSetter, scoreSetter, afterDrawCallback) => {
    return new Promise((resolve) => {
      if (remainingCards.length === 0) {
        console.warn('No cards left in deck!');
        resolve(false);
        return;
      }

      const randomIndex = Math.floor(Math.random() * remainingCards.length);
      const selectedImage = remainingCards[randomIndex];

      setRemainingCards(prev => prev.filter((_, index) => index !== randomIndex));

      handSetter(prevHand => {
        const newHand = [...prevHand, { id: Date.now(), image: selectedImage }];
        const newScore = calculateHandValue(newHand);
        scoreSetter(newScore);

        if (afterDrawCallback) {
          afterDrawCallback(newHand, newScore);
        }

        resolve(true);
        return newHand;
      });
    });
  };

  const handleHit = () => {
    if (gamePhase !== 'player-turn') return;
  
    dealCard(setPlayerHand, setPlayerScore, (newHand, newScore) => {
      if (newScore > 21) {
        endGame('LOSE');
      }
    });
  };

  // const handleStand = () => {
  //   if (gamePhase !== 'player-turn') return;
  
  //   setIsSecondDealerCardHidden(false);
  //   setGamePhase('dealer-turn');
  
  //   const dealerValue = calculateHandValue(dealerHand);
  //   if (dealerValue >= 17 && dealerHand.length < 5) {
  //     endGame();
  //   } else {
  //     startDealerDrawing();
  //   }
  // };

  // const handleStand = async () => {
  //   if (gamePhase !== 'player-turn') return;
  
  //   setIsSecondDealerCardHidden(false);
  //   setGamePhase('dealer-turn');
  
  //   // Dociągaj karty do min. 17
  //   let dealerVal = calculateHandValue(dealerHand);
  //   while (dealerVal < 17 && dealerHand.length < 5) {
  //     await drawDealerCards();
  //     dealerVal = calculateHandValue(dealerHand);
  //   }
  
  //   endGame();  // teraz mamy pewny stan
  // };
  

  // const handleStand = async () => {
  //   if (gamePhase !== 'player-turn') return;
  
  //   setIsSecondDealerCardHidden(false);
  //   setGamePhase('dealer-turn');
  
  //   let dealerVal = calculateHandValue(dealerHand);
  
  //   while (dealerVal < 17 && dealerVal <= 21 && dealerHand.length < 5) {
  //     await drawDealerCards();
  //     dealerVal = calculateHandValue(dealerHand);
  //   }
  
  //   endGame();
  // };
  
  
  useEffect(() => {
    const dealerValue = calculateHandValue(dealerHand);
  
    if (gamePhase === 'dealer-turn' && !isDealerDrawing) {
      if (dealerValue >= 17 || dealerValue > 21 || dealerHand.length >= 5) {
        endGame(); // kończymy grę
      } else {
        startDealerDrawing(); // dobieramy kolejną kartę
      }
    }
  }, [dealerHand, gamePhase, isDealerDrawing]);
  

  const handleStand = () => {
    if (gamePhase !== 'player-turn') return;
  
    setIsSecondDealerCardHidden(false);
    setGamePhase('dealer-turn'); // Resztą zajmie się useEffect
  };
  

  const handleDouble = () => {
    if (gamePhase !== 'player-turn' || playerHand.length !== 2) return;
    
    if (betAmount <= balance) {
      setBalance(prev => prev - betAmount);
      setBetAmount(prev => prev * 2);
      
      dealCard(setPlayerHand, setPlayerScore, () => {
        handleStand();
      });
    }
  };

  const handleSplit = () => {
    console.log("Split not implemented yet");
  };

  const startDealerDrawing = () => {
    setIsDealerDrawing(true);
    drawDealerCards();
  };

  // const drawDealerCards = async () => {
  //   setIsDealerDrawing(true);
  //   if (isSecondDealerCardHidden) {
  //     setIsDealerCardFlipping(true);
  //     await new Promise(resolve => setTimeout(resolve, 800));
  //     setIsSecondDealerCardHidden(false);
  //     setIsDealerCardFlipping(false);
  //   }
  //   await dealCard(setDealerHand, setDealerScore);
  //   setIsDealerDrawing(false);
  // };

  const drawDealerCards = () => {
    return new Promise(async (resolve) => {
      setIsDealerDrawing(true);
  
      if (isSecondDealerCardHidden) {
        setIsDealerCardFlipping(true);
        await new Promise(res => setTimeout(res, 800));
        setIsSecondDealerCardHidden(false);
        setIsDealerCardFlipping(false);
      }
  
      await dealCard(setDealerHand, setDealerScore);
      setIsDealerDrawing(false);
      resolve();
    });
  };
  

  // useEffect(() => {
  //   if (gamePhase === 'dealer-turn' && !isDealerDrawing) {
  //     const value = calculateHandValue(dealerHand);
  //     if (value >= 17 || value > 21 || dealerHand.length >= 5) {
  //       endGame();
  //     } else {
  //       startDealerDrawing();
  //     }
  //   }
  // }, [dealerHand, gamePhase, isDealerDrawing]);

  // const endGame = (forcedResult = null) => {
  //   setIsDealerDrawing(false);
    
  //   setTimeout(() => {
  //     let result = forcedResult;
  //     if (!forcedResult) {
  //       const playerValue = calculateHandValue(playerHand);
  //       const dealerValue = calculateHandValue(dealerHand);
        
  //       if (playerValue > 21) {
  //         result = 'lost';
  //       } else if (dealerValue > 21) {
  //         result = 'won';
  //       } else if (playerValue > dealerValue) {
  //         result = 'won';
  //       } else if (playerValue < dealerValue) {
  //         result = 'lost';
  //       } else {
  //         result = 'tie';
  //       }
  //     }

  //     if (result === 'won') {
  //       setBalance(prev => prev + betAmount * 2);
  //     } else if (result === 'tie') {
  //       setBalance(prev => prev + betAmount);
  //     }

  //     setGameStatus(result);
  //     setGamePhase('game-over');
  //   }, 100);
  // };

  // const endGame = (forcedResult = null) => {
  //   setIsDealerDrawing(false);
  
  //   setTimeout(async () => {
  //     let result = forcedResult;
  //     const playerValue = calculateHandValue(playerHand);
  //     const dealerValue = calculateHandValue(dealerHand);
  
  //     if (!forcedResult) {
  //       if (playerValue > 21) result = 'LOSE';
  //       else if (dealerValue > 21) result = 'WIN';
  //       else if (playerValue > dealerValue) result = 'WIN';
  //       else if (playerValue < dealerValue) result = 'LOSE';
  //       else result = 'DRAW';
  //     }
  
  //     // Oblicz payout
  //     let payout = 0;
  //     if (result === 'WIN') payout = betAmount * 2;
  //     else if (result === 'DRAW') payout = betAmount;
  
  //     // Zapisz wynik do API Django
  //     try {
  //       const res = await axios.post('http://localhost:8000/api/results/', {
  //         game: 1,
  //         user: 1,
  //         bet: betAmount,
  //         payout: payout,
  //         result: result
  //       });
  //       console.log('🎉 GameResult zapisany:', res.data);
  //     } catch (err) {
  //       console.error('❌ Błąd zapisu wyniku:', err);
  //     }
  
  //     // Obsługa UI
  //     if (result === 'WIN') setBalance(prev => prev + payout);
  //     else if (result === 'DRAW') setBalance(prev => prev + betAmount);
  
  //     setGameStatus(result.toLowerCase());
  //     setGamePhase('game-over');
  //   }, 100);
  // };
  
  const endGame = (forcedResult = null) => {
    setIsDealerDrawing(false);
  
    setTimeout(async () => {
      const finalPlayerScore = calculateHandValue(playerHand);
      const finalDealerScore = calculateHandValue(dealerHand);
  
      let result = forcedResult;
  
      if (!forcedResult) {
        if (finalPlayerScore > 21) result = 'LOSE';
        else if (finalDealerScore > 21) result = 'WIN';
        else if (finalPlayerScore > finalDealerScore) result = 'WIN';
        else if (finalPlayerScore < finalDealerScore) result = 'LOSE';
        else result = 'DRAW';
      }
  
      let payout = 0;
      if (result === 'WIN') payout = betAmount * 2;
      else if (result === 'DRAW') payout = betAmount;
  
      try {
        await axios.post('http://localhost:8000/api/results/', {
          game: 1,
          user: 1,
          bet: betAmount,
          payout: payout,
          result: result // "WIN", "LOSE", "DRAW"
        });
        console.log('✅ Wynik zapisany:', result);
      } catch (err) {
        console.error('❌ Błąd zapisu wyniku:', err.response?.data || err.message);
      }
  
      if (result === 'WIN') setBalance(prev => prev + payout);
      else if (result === 'DRAW') setBalance(prev => prev + betAmount);
  
      setGameStatus(result.toLowerCase()); // 'win', 'lose', 'draw'
      setGamePhase('game-over');
    }, 300);
  };
  
  
  
  


  const handleNewGame = () => {
    setGamePhase('betting');
    setGameStatus('waiting');
    setBetAmount(0);
  };

  return (
    <div className="game-container">
      <div className="controls-panel">
        {gamePhase === 'betting' && (
          <>
            <div className="bet-controls">
              <input 
                type="number" 
                placeholder="Bet amount" 
                value={betAmount || ''}
                onChange={handleBetChange}
                className="bet-input"
              />
              <div className="bet-multipliers">
                <button 
                  onClick={() => multiplyBet(2)}
                  className="multiplier-button"
                >
                  x2
                </button>
                <button 
                  onClick={() => multiplyBet(0.5)}
                  className="multiplier-button"
                >
                  1/2
                </button>
              </div>
            </div>

            <button 
              onClick={startGame}
              disabled={betAmount <= 0 || betAmount > balance}
              className={`start-button ${(betAmount > 0 && betAmount <= balance) ? 'active' : 'disabled'}`}
            >
              Start Game
            </button>
          </>
        )}

        {gamePhase !== 'betting' && (
          <div className="game-controls">
            <div className="game-buttons-row">
              <button 
                onClick={handleHit}
                disabled={gamePhase !== 'player-turn'}
                className={`game-button ${gamePhase === 'player-turn' ? 'active' : 'disabled'}`}
              >
                Hit
              </button>
              <button 
                onClick={handleStand}
                disabled={gamePhase !== 'player-turn'}
                className={`game-button ${gamePhase === 'player-turn' ? 'active' : 'disabled'}`}
              >
                Stand
              </button>
            </div>
            <div className="game-buttons-row">
              <button 
                onClick={handleDouble}
                disabled={gamePhase !== 'player-turn' || playerHand.length !== 2 || betAmount > balance}
                className={`game-button ${(gamePhase === 'player-turn' && playerHand.length === 2 && betAmount <= balance) ? 'active' : 'disabled'}`}
              >
                Double
              </button>
              <button 
                onClick={handleSplit}
                disabled={gamePhase !== 'player-turn' || playerHand.length !== 2 || 
                  !playerHand[0]?.image.includes(playerHand[1]?.image.split('_')[0])}
                className={`game-button ${(gamePhase === 'player-turn' && playerHand.length === 2 && 
                  playerHand[0]?.image.includes(playerHand[1]?.image.split('_')[0])) ? 'active' : 'disabled'}`}
              >
                Split
              </button>
            </div>
          </div>
        )}

        {gamePhase === 'game-over' && (
          <div className="game-over-panel">
            {/* <h2 className={`result-message ${gameStatus}`}>
              {gameStatus === 'won' ? 'You Won!' : 
               gameStatus === 'lost' ? 'You Lost!' : 'It\'s a Tie!'}
            </h2> */}
            <h2 className={`result-message ${gameStatus}`}>
              {gameStatus === 'win' ? 'You Won!' : 
              gameStatus === 'lose' ? 'You Lost!' : 'It\'s a Tie!'}
            </h2>


            <button 
              onClick={handleNewGame}
              className="new-game-button"
            >
              New Game
            </button>
          </div>
        )}
      </div>

      <div className="game-board">
        {gamePhase === 'betting' ? (
          <div className="betting-message">
            <h2>Place your bet to start</h2>
            <p>Current bet: {betAmount}</p>
          </div>
        ) : (
          <>
            <div className="hand dealer-hand">
              <h2>Dealer's Hand (Score: {isSecondDealerCardHidden ? '?' : dealerScore})</h2>
              {dealerHand.map((card, index) => (
                <motion.div
                  key={card.id}
                  className="card"
                  initial={{ opacity: 0, top: 0, left: '50%' }}
                  animate={{ opacity: 1, top: 170, left: `calc(50% + ${index * 50}px)`, transform: 'translate(-50%, -50%)' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <img src={index === 1 && isSecondDealerCardHidden ? cardBackground : card.image} alt="Card" />
                </motion.div>
              ))}
            </div>
    
            <div className="hand player-hand">
              <h2>Player's Hand (Score: {playerScore})</h2>
              {playerHand.map((card, index) => (
                <motion.div
                  key={card.id}
                  className="card"
                  initial={{ opacity: 0, top: 0, left: '50%' }}
                  animate={{ opacity: 1, top: 170, left: `calc(50% + ${index * 50}px)`, transform: 'translate(-50%, -50%)' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <img src={card.image} alt="Card" />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnimatedCard;