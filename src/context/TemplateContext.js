import React, { createContext, useState } from 'react';

const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
    const [templates, setTemplates] = useState([]);

    return (
        <TemplateContext.Provider value={{ templates, setTemplates }}>
            {children}
        </TemplateContext.Provider>
    );
};

export default TemplateContext;
