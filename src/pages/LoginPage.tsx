import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const EasyPOSLogin = () => {
  function isVerified() {
    // Get input values from form elements directly
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    // Check if elements exist
    if (!emailInput || !passwordInput) {
      toast.error('Form elements not found');
      return;
    }
    
    // Safely get values from input elements
    const email = emailInput.value;
    const password = passwordInput.value;
    
    // Simple validation
    if (!email || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    
    // Example credentials check (in a real app, this would be a server call)
    if (email === 'admin' && password === '123') {
      toast.success('Login successful!');
      // Here you would redirect to dashboard or home page
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } else {
      toast.error('Invalid username or password');
    }
  }
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <div className="flex flex-col items-center justify-center h-16 w-16 bg-blue-500 rounded-full flex mb-3 mx-auto">
          {/* Lock icon placeholder */}
          <div className="text-white text-2xl">🔒</div>
        </div>
        <h1 className="text-2xl font-bold text-blue-500 text-center">Easy POS Login</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Sign in to your account</p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-600 mb-1 text-sm">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {/* User icon placeholder */}
                <div className="text-gray-400 text-sm">👤</div>
              </div>
              
              <input
                id="email"
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-600 mb-1 text-sm">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {/* Lock icon placeholder */}
                <div className="text-gray-400 text-sm">🔒</div>
              </div>
              
              <input
                id="password"
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    isVerified();
                  }
                }}
              />
            </div>
          </div>
          
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-200"
            onClick={isVerified}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default EasyPOSLogin;