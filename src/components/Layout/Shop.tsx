import Navbar from "@/components/Home/navbar";
import Footer from "@/components/Home/footer";
import { Outlet } from "react-router-dom";
const Shop: React.FC = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
};
export default Shop;
