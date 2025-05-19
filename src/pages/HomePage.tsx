import { FaCashRegister, FaChartLine, FaUsers, FaCloud } from "react-icons/fa";
import Logo from "../assets/easy-pos-logo.svg";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto py-16 px-4 md:px-0">
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                        Welcome to <span className="text-blue-600">Easy POS</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        The smart, simple, and efficient Point of Sale system for modern businesses. Manage sales, inventory, and customers-all in one place.
                    </p>
                    <div className="flex space-x-4">
                        <Link
                            to="/dashboard"
                            className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition font-medium"
                        >
                            Try Demo
                        </Link>
                        <Link
                            to="/about"
                            className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition font-medium"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img src={Logo} alt="Easy POS Logo" className="w-64 md:w-80" />
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                        Why Choose Easy POS?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
                            <FaCashRegister className="text-3xl text-blue-600 mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Fast Checkout</h3>
                            <p className="text-gray-600">
                                Speed up transactions with an intuitive and responsive interface.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
                            <FaChartLine className="text-3xl text-blue-600 mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Real-time Analytics</h3>
                            <p className="text-gray-600">
                                Track sales and inventory in real time for smarter business decisions.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
                            <FaUsers className="text-3xl text-blue-600 mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Customer Management</h3>
                            <p className="text-gray-600">
                                Build loyalty with customer profiles and purchase history.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
                            <FaCloud className="text-3xl text-blue-600 mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Cloud-Based</h3>
                            <p className="text-gray-600">
                                Access your POS from anywhere, anytime-secure and always up-to-date.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-12 bg-blue-600">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Ready to boost your business?
                    </h2>
                    <p className="text-blue-100 mb-6">
                        Sign up now and experience the easiest way to manage your sales.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded shadow hover:bg-blue-50 transition"
                    >
                        Get Started
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
