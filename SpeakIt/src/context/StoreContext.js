import React from 'react';

const StoreContext = React.createContext({
    words: [],
    knownWords: [],
    isNewGame: false,
    changeState: () => {},
});

export default StoreContext;
