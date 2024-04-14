import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import { ThemeProvider } from "@material-tailwind/react";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);


root.render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
