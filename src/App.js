import { useState, useEffect, useCallback } from 'react';
import SingleCard from './SingleCard'
import './App.css'

const cardImages = [
  {"src": "/img/helmet-1.png", matched: false},
  {"src": "/img/potion-1.png", matched: false},
  {"src": "/img/ring-1.png", matched: false},
  {"src": "/img/scroll-1.png", matched: false},
  {"src": "/img/shield-1.png", matched: false},
  {"src": "/img/sword-1.png", matched: false}
]

function App() {
  const [ cards, setCards ] = useState([])
  const [ turns, setTurns ] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)

  
  // Duplicate cards and shuffle them

  const shuffleCards = () => {

    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0)
  }

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  }

  const resetTurns = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  const compareCardChoices = useCallback (async() => {
    if (choiceOne.src === choiceTwo.src) {
      setCards(prevCards => {
        return prevCards.map((card) => {
          if (card.src === choiceOne.src) {
            return {...card, matched: true}
          } else {
             return card
          }
        })
      })
    }
  }, [choiceOne, choiceTwo])
  
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      compareCardChoices();
      setTimeout(() => {
        resetTurns();
      }, 1000);
    }
  }, [choiceOne, choiceTwo, compareCardChoices ])

  // start game automatically
  useEffect(() => {
    shuffleCards()
  }, [])

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard 
            card={card} 
            key={card.id} 
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>Turns taken: {turns}</p>
    </div>
  );
}

export default App