import { createBrowserRouter } from "react-router-dom";
import {
    LoginPage,
    UserPage,
    CategoryPage,
    ProductPage,
    RoomPage,
} from "../pages";
import Home from "../pages/shop/HomePage";
import Layout from "../components/Layout/Layout";
import Shop from "../components/Layout/Shop";
import PrivateRoute from "../components/PrivateRoute";
import BuildingPage from "@/pages/building/BuildingPage";
import ServicePage from "@/pages/service/ServicePage";
import CreateOrUpdateRoom from "@/pages/room/CreateOrUpdatePage";

export const router = createBrowserRouter([
    {
        path: "/admin",
        element: ( <PrivateRoute>
           <Layout />
        </PrivateRoute>),
        children: [
            {
                path: "users",
                element: (
                    <PrivateRoute>
                        <UserPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "building",
                element: (
                    <PrivateRoute>
                        <BuildingPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "service",
                element: (
                    <PrivateRoute>
                        <ServicePage />
                    </PrivateRoute>
                ),
            },
            {
                path: "rooms",
                element: (
                    <PrivateRoute>
                        <RoomPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "rooms/create",
                element: (
                    <PrivateRoute>
                        <CreateOrUpdateRoom />
                    </PrivateRoute>
                ),
            },
            {
                path: "products",
                element: (
                    <PrivateRoute>
                        <ProductPage />
                    </PrivateRoute>
                ),
            },
        ],
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: <Shop />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
        ],
    },
]);
