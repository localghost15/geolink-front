import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import { ThemeProvider } from "@material-tailwind/react";
import toast, { Toaster } from 'react-hot-toast';

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);


root.render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider>
      <App />
      <Toaster
  position="top-center"
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{zIndex: 99999}}
  toastOptions={{
    className: '',
    duration: 5000,
    style: {
      background: '#000',
      color: '#fff',
    },



    success: {
      duration: 3000,
      theme: {
        primary: 'green',
        secondary: 'black',
      },
    },
  }}
/>
    </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
