import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

// Create a context
export const DataContext = createContext();

// Create a provider component
export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      const response = await axios.get(`http://13.245.89.170:5500/deviceData`);
      console.log(response)
      setData(response.data); // Ensure you set the correct part of the response
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        children
      )}
    </DataContext.Provider>
  );
};
