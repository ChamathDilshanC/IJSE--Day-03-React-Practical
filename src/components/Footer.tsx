import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-200 py-8 px-4 mt-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:justify-between space-y-6 md:space-y-0">
                {/* Left: Logo and Brand */}
                <div className="flex items-center space-x-3">
                    {/* You can use your logo here if you want */}
                    <span className="text-2xl font-bold text-blue-400">Easy POS</span>
                    <span className="text-gray-400 text-sm">© {new Date().getFullYear()}</span>
                </div>

                {/* Center: Quick Links */}
                <div className="flex space-x-6">
                    <a href="/" className="hover:text-blue-400 transition">Home</a>
                    <a href="/about" className="hover:text-blue-400 transition">About</a>
                    <a href="/contact" className="hover:text-blue-400 transition">Contact</a>
                </div>

                {/* Right: Social Icons */}
                <div className="flex space-x-4">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
                        <FaFacebook size={20} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
                        <FaTwitter size={20} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">
                        <FaInstagram size={20} />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
                        <FaGithub size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
