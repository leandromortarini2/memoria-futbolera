/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { imgs } from "../helpers/data";
import { shuffleArray } from "../helpers/shuffleArray";
import { Card } from "./Card";
import Swal from "sweetalert2";

export const Board = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const createBoard = () => {
    const duplicatedCards = imgs.flatMap((img) => {
      const duplicate = {
        ...img,
        id: img.id + imgs.length,
      };
      return [img, duplicate];
    });
    const newCards = shuffleArray(duplicatedCards);

    const cards = newCards.map((card) => {
      return {
        ...card,
        flipped: false,
        matched: false,
      };
    });
    setCards(cards);
  };

  useEffect(() => {
    createBoard();
  }, []);

  const handleCardClick = (id) => {
    if (isDisabled) return; // Si está deshabilitado, no hacer nada.

    const clickedCard = cards.find((card) => card.id === id);

    // Evitar que se pueda interactuar con cartas ya emparejadas o volteadas.
    if (clickedCard.flipped || clickedCard.matched) return;

    const newCards = cards.map((card) => {
      if (card.id === id && !card.flipped && !card.matched) {
        return { ...card, flipped: true };
      }
      return card;
    });

    const flippedCard = newCards.find((card) => card.id === id);
    const newFlippedCards = [...flippedCards, flippedCard];

    setFlippedCards(newFlippedCards);
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      setIsDisabled(true); // Deshabilitar las interacciones mientras se compara.
      setTimeout(() => {
        compareCards(newFlippedCards);
      }, 800); // Esperar un segundo antes de comparar.
    }
  };

  const compareCards = ([firstCard, secondCard]) => {
    let updatedCards = cards.map((card) => {
      if (card.id === firstCard.id || card.id === secondCard.id) {
        if (firstCard.src === secondCard.src) {
          // Marcar ambas cartas como coincidencias (matched)
          return { ...card, matched: true, flipped: true }; // Asegurarse de que ambas permanezcan volteadas.
        } else {
          // Volver a dar la vuelta si no coinciden
          return { ...card, flipped: false };
        }
      }
      return card;
    });

    setCards(updatedCards); // Actualizar el estado con las cartas comparadas.
    setFlippedCards([]); // Reiniciar las cartas volteadas.
    setMoves((moves) => moves + 1); // Incrementar el contador de movimientos.
    setIsDisabled(false); // Habilitar las interacciones nuevamente.

    if (updatedCards.every((card) => card.matched)) {
      setGameOver(true);
    }
  };

  const handleNewGame = () => {
    setCards([]);
    createBoard();
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
    setIsDisabled(false);
  };

  useEffect(() => {
    if (gameOver) {
      Swal.fire({
        title: `¡Felicidades! Has completado el juego en ${moves} ${
          moves === 1 ? "movimiento" : "movimientos"
        }`,
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }, [gameOver, moves]);

  return (
    <div className=" min-h-screen relative flex items-center justify-center flex-col bg-[url('/bg.jpg')] bg-cover">
      <div className="mx-auto flex flex-col justify-center items-center "></div>
      <h1 className="font-bold text-2xl md:text-3xl lg:text-5xl xl:text-6xl text-white drop-shadow-xl text-center ">
        Memoria Futbolera
      </h1>
      <p className=" md:w-3/4 lg:w-1/2 text-center text-white text-lg font-semibold m-3">
        ¿Estás listo para desafiar tu memoria y demostrar que conoces todos los
        clubes del fútbol argentino? Pon a prueba tu habilidad para recordar y
        encontrar las parejas de escudos en este emocionante juego de cartas.
      </p>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3 justify-center items-center px-3 py-5 my-3">
        {cards.map((card) => (
          <Card key={card.id} card={card} handleCardClick={handleCardClick} />
        ))}
      </div>
      <p className=" md:w-3/4 lg:w-1/2 text-center text-white text-lg font-semibold m-3">
        ¡Da vuelta las cartas, recuerda su posición y revela al campeón de la
        memoria futbolera!
      </p>
      {gameOver && (
        <h2 className="text-3xl font-bold text-yellow-500 m-3">
          ¡Juego terminado! en {moves} movimientos
        </h2>
      )}
      <button
        className="bg-yellow-300 font-semibold text-black rounded-lg px-5 py-3 hover:bg-yellow-500 hover:text-black transition-all mb-3 text-lg"
        onClick={handleNewGame}
      >
        Nueva Partida
      </button>
    </div>
  );
};
