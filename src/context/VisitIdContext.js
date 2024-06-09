// VisitContext.js
import React, { createContext, useState, useContext } from 'react';

const VisitContext = createContext();

export const VisitProvider = ({ children }) => {
    const [mostRecentVisit, setMostRecentVisit] = useState(null);

    return (
        <VisitContext.Provider value={{ mostRecentVisit, setMostRecentVisit }}>
            {children}
        </VisitContext.Provider>
    );
};

export const useVisit = () => useContext(VisitContext);
