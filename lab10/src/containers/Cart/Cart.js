import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { incrementQuantity, decrementQuantity, removeItem } from '../../Redux/CartSlice.js';
import './Cart.css';
import { getImageSrc } from "../../components/card_item/CardItem.js";
import DocumentTitle from '../../components/helmet/document_title.js';
import Loader from '../../components/Loader/Loader.js';
import Header from '../Header/Header.js';
import { fetchStockData, updateStock } from '../../api/api.js';

function Cart() {
  DocumentTitle('Cart');

  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState({});

  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);
      try {
        const stockData = await fetchStockData();
        const stockMap = stockData.reduce((acc, card) => {
          card.stock.forEach(stockItem => {
            acc[`${card.id}-${stockItem.color}`] = stockItem.amount;
          });
          return acc;
        }, {});
        setStock(stockMap);
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [dispatch]);

  const handleIncrement = async (itemId, itemColor) => {
    const stockKey = `${itemId}-${itemColor}`;
    const stockAmount = stock[stockKey] || 0;

    try {
      const result = await updateStock(itemId, itemColor, -1);

      if (result.success) {
        dispatch(incrementQuantity({ id: itemId, color: itemColor }));
        setStock(prevStock => ({
          ...prevStock,
          [stockKey]: prevStock[stockKey] - 1
        }));
      } else {
        alert('Failed to update stock');
      }
    } catch (error) {
      alert('Failed to update stock');
    }
  };

  const handleDecrement = async (itemId, itemColor) => {
    const item = cart.find(item => item.id === itemId && item.color === itemColor);

    try {
      const result = await updateStock(itemId, itemColor, 1);

      if (result.success) {
        if (item.quantity > 1) {
          dispatch(decrementQuantity({ id: itemId, color: itemColor }));
        } else {
          dispatch(removeItem({ id: itemId, color: itemColor }));
        }
        setStock(prevStock => ({
          ...prevStock,
          [`${itemId}-${itemColor}`]: prevStock[`${itemId}-${itemColor}`] + 1
        }));
      } else {
        alert('Failed to update stock');
      }
    } catch (error) {
      alert('Failed to update stock');
    }
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const imageSrc = (imgpath) => getImageSrc(imgpath);

  return (
    <>
      <Header />
      <div className="cart">
        <h1>Shopping Cart</h1>
        {loading ? (
          <Loader />
        ) : (
          <>
            {cart.length === 0 ? (
              <div>
                <h2 className="cart_empty_text">Your cart is empty</h2>
                <div className="cart__button">
                  <Link to="/catalog">
                    <button className="back_to_catalog">Back to catalog</button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                {cart.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="cart__item">
                    <img
                      className="cart__item-image"
                      src={imageSrc(item.imgpath)}
                      alt={item.title}
                    />
                    <div className="cart__item-details">
                      <h2>{item.title} ({item.color})</h2>
                      <div className="cart__item-quantity">
                        <button onClick={() => handleDecrement(item.id, item.color)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleIncrement(item.id, item.color)}
                          disabled={stock[`${item.id}-${item.color}`] <= 0}
                        >
                          +
                        </button>
                      </div>
                      <p>$ {item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
                <div className="cart__summary-price">
                  <h2 className="h">Total amount: </h2>
                  <h2>$ {totalPrice}</h2>
                </div>
                <div className="cart__buttons">
                  <Link to="/catalog">
                    <button className="back_to_catalog">Back to catalog</button>
                  </Link>
                  <button className="continue">Continue</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Cart;
