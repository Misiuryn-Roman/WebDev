import React, { useEffect, useState } from "react";
import Hero from "./Hero/Hero.js";
import HomeCards from "./HomeCards/HomeCards.js";
import DocumentTitle from "../../components/helmet/document_title.js";
import axios from "axios";
import Header from "../Header/Header.js";

function Home() {
  DocumentTitle("Home");

  const [data, setData] = useState('');

  useEffect(() => {
    // Використання Axios для отримання даних з бекенду
    axios.get('/api/data')
      .then((response) => {
        setData(response.data.message); // збереження даних з бекенду
      })
      .catch((error) => {
        console.error('Помилка отримання даних:', error);
      });
  }, []);

  return (
    <div>
      <Header />
      <Hero />
      <HomeCards />
    </div>
  );
}

export default Home;