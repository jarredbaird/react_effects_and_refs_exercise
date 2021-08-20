import React from "react";
import "./Card.css";

const Card = ({ src, angle, x, y }) => {
  const style = {
    transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`,
  };
  return <img src={src} style={style} alt=""></img>;
};

export default Card;
