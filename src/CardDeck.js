import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import { v4 as uuid } from "uuid";
import "./CardDeck.css";

const CardDeck = () => {
  const [drawingCards, setDrawingCards] = useState(false);
  const [deckId, setDeckId] = useState("");
  const [cards, setCards] = useState([]);
  const timerId = useRef();
  useEffect(() => {
    if (drawingCards) {
      timerId.current = setInterval(() => {
        async function doIt() {
          await addCard();
        }
        doIt();
      }, 1000);
    } else clearInterval(timerId.current);
    return () => clearInterval(timerId.current);
  }, [drawingCards]);
  const shuffleDeck = async () => {
    let response = await axios.get(
      "https://deckofcardsapi.com/api/deck/new/shuffle"
    );
    setCards([]);
    setDeckId(response.data.deck_id);
  };
  const drawCard = async () => {
    let response = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw`
    );
    if (!response.data.remaining) await shuffleDeck();
    return response.data.cards[0].image;
  };

  const getRandomPos = () => Math.random() * 40 + 20;
  const getRandomAngle = () => Math.random() * 90 - 45;
  const addCard = async () => {
    const newCard = await drawCard();
    setCards((cards) => [
      ...cards,
      {
        src: newCard,
        id: uuid(),
        x: getRandomPos(),
        y: getRandomPos(),
        angle: getRandomAngle(),
      },
    ]);
  };

  const drawCards = () => {
    setDrawingCards(!drawingCards);
  };

  return (
    <div>
      <button onClick={drawCards}>
        {drawingCards ? "Stop Drawing" : "Start Drawing"}
      </button>
      <button onClick={shuffleDeck}>Shuffle Deck</button>
      <div className="cardArea">
        {cards.map((card) => (
          <Card
            src={card.src}
            x={card.x}
            y={card.y}
            angle={card.angle}
            key={card.id}
          />
        ))}
      </div>
    </div>
  );
};

export default CardDeck;
