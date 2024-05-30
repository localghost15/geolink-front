import React, { createContext, useState } from 'react';

const Mkb10Context = createContext();

export const Mkb10Provider = ({ children }) => {
    const [mkb10Data, setMkb10Data] = useState([]);

    return (
        <Mkb10Context.Provider value={{ mkb10Data, setMkb10Data }}>
            {children}
        </Mkb10Context.Provider>
    );
};

export default Mkb10Context;
