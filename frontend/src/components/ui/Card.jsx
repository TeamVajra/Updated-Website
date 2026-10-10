import React from 'react';
import './Card.css';

const Card = ({ imageSrc, imageAlt, children, className = '', imgStyle = {}, imgClassName = '', onClick }) => {
  return (
    <div className={`ui-card ${className}`} onClick={onClick}>
      <img src={imageSrc} alt={imageAlt || 'Card image'} style={imgStyle} className={imgClassName} />
      {children}
    </div>
  );
};

export default Card;
