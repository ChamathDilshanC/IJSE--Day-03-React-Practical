import Logo from "../assets/easy-pos-logo.svg";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {FaSignInAlt, FaTachometerAlt} from "react-icons/fa";

const Navbar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const routes = [
        {to: "/", name: "Home"},
        {to: "/about", name: "About"},
        {to: "/contact", name: "Contact"}
    ]

    const isActive = (to: string) => {
        return to === location.pathname
    }

    const onLoginPressed = () => {
        navigate("/login")
    }

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
            <div className="flex items-center">
                <img width={100} alt="Easy POS Logo" src={Logo} className="mr-2"/>
                <span className="text-xl font-bold text-gray-700">Easy POS</span>
            </div>

            <div className="flex space-x-8">
                {routes.map(
                    (route, index) =>
                        <Link
                            className={`flex items-center text-gray-600 hover:text-blue-600 transition
                            ${isActive(route.to) ? 'bg-blue-500 rounded px-2 py-1 text-white': ''}`
                        }
                            key={index}
                            to={route.to}>
                            {route.name}
                        </Link>
                )}


            </div>

            <div className="flex space-x-4">
                <button
                    onClick={onLoginPressed}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-medium shadow">
                    <FaSignInAlt className="mr-2"/> Login
                </button>
                <button
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition font-medium shadow">
                    <FaTachometerAlt className="mr-2"/> Dashboard
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
