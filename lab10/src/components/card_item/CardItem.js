import React from "react";
import './CardItem.css';
import { Link, useLocation } from 'react-router-dom';
import Husky from '../image/husky.jpg';
import Ginger from '../image/ginger.jpg';
import Shorthair from '../image/shorthair.png';
import German from '../image/german.jpg';

export function getImageSrc(imgpath) {
    switch (imgpath) {
        case 'Husky':
            return Husky;
        case 'Ginger':
            return Ginger;
        case 'Shorthair':
            return Shorthair;
        case 'German':
            return German;
        default:
            return null; // or a default image
    }
}

function CardItem({ id, title, text, imgpath, price }) {
    const location = useLocation();
    const imageSrc = getImageSrc(imgpath);
  
    return (
      <div className="cards_content">
        {imageSrc && <img src={imageSrc} alt={title} className="cards__photo" />}
        <article>
          <h3 className="cards_title">{title}</h3>
          <p className="cards_desc">{text}</p>
          {location.pathname === '/catalog' && (
            <div className="cards_price">
              <p className="cards_price-price">Price:</p>
              <p>{price} $</p>
            </div>
          )}
        </article>
        {location.pathname === '/catalog' && (
          <div className="cards__button-container">
            <Link to={`/catalog/${id}`}>
              <button className="cards__button">View More</button>
            </Link>
          </div>
        )}
      </div>
    );
}

export default CardItem;