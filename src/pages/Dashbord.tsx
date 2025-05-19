import React from 'react';
import { Users, Package, ShoppingCart, LogOut } from 'lucide-react';
import { useNavigate, type To } from "react-router-dom";

const SimpleDashboard = () => {
  const navigate = useNavigate();
  
  // Dashboard buttons configuration
  const dashboardButtons = [
    {
      name: "Customers",
      to: "/dashboard/CustomerPage",
      icon: <Users size={36} className="mb-3" />,
      color: "bg-blue-400"
    },
    {
      name: "Stocks",
      to: "/dashboard/StockPage",
      icon: <Package size={36} className="mb-3" />,
      color: "bg-green-400"
    },
    {
      name: "Orders",
      to: "/dashboard/OrderPage",
      icon: <ShoppingCart size={36} className="mb-3" />,
      color: "bg-yellow-400"
    },
    {
      name: "Logout",
      to: "/",
      icon: <LogOut size={36} className="mb-3" />,
      color: "bg-red-400"
    }
  ];

  const onDashboardButtonPressed = (to: To) => {
    navigate(to);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Dashboard Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardButtons.map((button, index) => (
            <div 
              key={index}
              onClick={() => onDashboardButtonPressed(button.to)}
              className={`${button.color} text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer`}
            >
              <div className="p-6 flex flex-col items-center justify-center text-center">
                {button.icon}
                <h2 className="text-xl font-bold">{button.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SimpleDashboard;