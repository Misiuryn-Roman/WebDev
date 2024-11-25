import axios from 'axios';

// Function to fetch stock data for the cards
export const fetchStockData = async () => {
  try {
    const response = await axios.get('/api/cards-catalog');
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error; // Rethrow so that the component can handle it
  }
};

// Function to update the stock when incrementing or decrementing quantity
export const updateStock = async (id, color, amount) => {
  try {
    const response = await axios.patch('/api/update-stock', {
      id,
      color,
      amount
    });
    return response.data;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};
