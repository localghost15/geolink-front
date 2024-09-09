import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import uzUZ from 'antd/es/locale/uz_UZ';
import { ThemeProvider } from "@material-tailwind/react";
import toast, { Toaster } from 'react-hot-toast';
import {VisitProvider} from "./context/VisitIdContext";
import {ConfigProvider} from "antd";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);


root.render(
    <BrowserRouter>
    <ConfigProvider
        locale={uzUZ}
        theme={{
        token: {
            colorPrimary: "#00AA81"
        }
    }}>
        <VisitProvider>
      <App />
        </VisitProvider>
        <Toaster
            position='bottom-right'
            reverseOrder={false}
            gutter={8}
            containerClassName=''
            containerStyle={{}}
            toastOptions={{
                className: '',
                duration: 5000,
                style: {
                    background: '#000',
                    color: '#fff',
                    fontSize: '14px',
                },

                success: {
                    duration: 2000,
                    theme: {
                        primary: 'green',
                        secondary: 'black',
                    },
                },
                error: {
                    duration: 2000,
                    theme: {
                        primary: 'red',
                        secondary: 'black',
                    },
                },
            }}
        />

    </ConfigProvider>
    </BrowserRouter>,
  document.getElementById('root')
);
