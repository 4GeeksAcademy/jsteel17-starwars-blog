// Import necessary components and functions from react-router-dom.
import Layout from "./pages/Layout";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";

export const router = createBrowserRouter([
    { path: "/", element: <Layout /> ,
    children: [
        {path: "", element: <Home />},
        {path: "/:type/:id", element: <Details /> }
    ]}
]);