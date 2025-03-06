import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Global styles for your application
import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes";  // Import the router configuration
import { StoreProvider } from './hooks/useGlobalReducer';  // Import the StoreProvider for global state management
import StarWarsProvider from "./store/StarWarsContext";
import { Layout } from './pages/Layout';

const Main = () => {
    return (
        <React.StrictMode>  
            <StarWarsProvider>  
                <StoreProvider> 
                    <RouterProvider router={router}>
                        <Layout />
                    </RouterProvider>
                </StoreProvider>
            </StarWarsProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);