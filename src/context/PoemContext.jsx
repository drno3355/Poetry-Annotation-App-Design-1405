import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PoemContext = createContext();

export const usePoems = () => {
  const context = useContext(PoemContext);
  if (!context) {
    throw new Error('usePoems must be used within a PoemProvider');
  }
  return context;
};

export const PoemProvider = ({ children }) => {
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    const savedPoems = localStorage.getItem('poems');
    if (savedPoems) {
      setPoems(JSON.parse(savedPoems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('poems', JSON.stringify(poems));
  }, [poems]);

  const addPoem = (poemData) => {
    const newPoem = {
      id: uuidv4(),
      ...poemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPoems(prev => [...prev, newPoem]);
    return newPoem.id;
  };

  const updatePoem = (id, poemData) => {
    setPoems(prev => prev.map(poem => 
      poem.id === id 
        ? { ...poem, ...poemData, updatedAt: new Date().toISOString() }
        : poem
    ));
  };

  const deletePoem = (id) => {
    setPoems(prev => prev.filter(poem => poem.id !== id));
  };

  const getPoem = (id) => {
    return poems.find(poem => poem.id === id);
  };

  return (
    <PoemContext.Provider value={{
      poems,
      addPoem,
      updatePoem,
      deletePoem,
      getPoem
    }}>
      {children}
    </PoemContext.Provider>
  );
};