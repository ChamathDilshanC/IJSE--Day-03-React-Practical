import { useState } from "react";
import { customerData } from "../data/CustomerData";
import type { Customer } from "../types/Customer";
import Dialog from "../components/dialog" // Import the Dialog component

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>(customerData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    dateOfBirth: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    address: "",
    dateOfBirth: "",
  });

  // Reset the form and close the dialog
  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      dateOfBirth: "",
    });
    setErrors({
      name: "",
      address: "",
      dateOfBirth: "",
    });
    setIsDialogOpen(false);
    setEditingCustomer(null);
  };

  // Open add customer dialog
  const handleAddClick = () => {
    resetForm();
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  // Initialize the edit form with customer data
  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      address: customer.address,
      dateOfBirth: customer.dateOfBirth,
    });
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  // Delete a customer
  const handleDeleteClick = (customerId: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter(customer => customer.id !== customerId));

      // If we're editing this customer, close the form
      if (editingCustomer && editingCustomer.id === customerId) {
        resetForm();
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      address: "",
      dateOfBirth: "",
    };

    if (formData.name.trim() === "") {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (formData.address.trim() === "") {
      newErrors.address = "Address is required";
      isValid = false;
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (dialogMode === "add") {
      // Generate a unique ID for new customers
      const newCustomer: Customer = {
        id: `CUS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        ...formData,
      };

      setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
    } else if (dialogMode === "edit" && editingCustomer) {
      setCustomers(prevCustomers =>
        prevCustomers.map(customer =>
          customer.id === editingCustomer.id
            ? { ...customer, ...formData }
            : customer
        )
      );
    }

    resetForm();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customer Management</h2>

      {/* Add Customer Button */}
      <div className="mb-6">
        <button
          onClick={handleAddClick}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Customer
        </button>
      </div>

      {/* Customer Dialog */}
      <Dialog 
        isOpen={isDialogOpen} 
        onClose={resetForm} 
        title={dialogMode === "add" ? "Add New Customer" : `Edit Customer ${editingCustomer?.id || ""}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                errors.name ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete address"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                errors.address ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
              }`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                errors.dateOfBirth ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
              }`}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-3">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 text-white font-medium py-2 px-4 rounded-md transition duration-150 flex items-center justify-center ${
                dialogMode === "add" 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {dialogMode === "add" ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Customer
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Update Customer
                </>
              )}
            </button>
          </div>
        </form>
      </Dialog>

      {/* Customer List */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Customer List</h3>
        <div className="text-sm text-gray-500">
          {customers.length} {customers.length === 1 ? 'customer' : 'customers'}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">Date of Birth</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{customer.id}</td>
                  <td className="py-2 px-4 border-b">{customer.name}</td>
                  <td className="py-2 px-4 border-b">{customer.address}</td>
                  <td className="py-2 px-4 border-b">{customer.dateOfBirth}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(customer)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-sm flex items-center"
                        title="Edit customer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        <span className="ml-1">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(customer.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm flex items-center"
                        title="Delete customer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-1">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                  No customers found. Click "Add Customer" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPage;