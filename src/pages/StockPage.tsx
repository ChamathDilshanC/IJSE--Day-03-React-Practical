import { useState } from "react";
import { stockData } from "../data/StockData";
import type { Stock } from "../types/Stock";
import Dialog from "../components/Dialog";

const StockPage = () => {
    const [stocks, setStocks] = useState<Stock[]>(stockData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [editingStock, setEditingStock] = useState<Stock | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
        supplier: "",
        reorderLevel: ""
    });
    const [errors, setErrors] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
        reorderLevel: ""
    });

    const categories = ["Electronics", "Computers", "Audio", "Tablets", "Accessories", "Other"];

    // Reset the form and close the dialog
    const resetForm = () => {
        setFormData({
            name: "",
            category: "",
            price: "",
            quantity: "",
            description: "",
            supplier: "",
            reorderLevel: ""
        });
        setErrors({
            name: "",
            category: "",
            price: "",
            quantity: "",
            reorderLevel: ""
        });
        setIsDialogOpen(false);
        setEditingStock(null);
    };

    // Open add stock dialog
    const handleAddClick = () => {
        resetForm();
        setDialogMode("add");
        setIsDialogOpen(true);
    };

    // Initialize the edit form with stock data
    const handleEditClick = (stock: Stock) => {
        setEditingStock(stock);
        setFormData({
            name: stock.name,
            category: stock.category,
            price: stock.price.toString(),
            quantity: stock.quantity.toString(),
            description: stock.description || "",
            supplier: stock.supplier || "",
            reorderLevel: stock.reorderLevel.toString()
        });
        setDialogMode("edit");
        setIsDialogOpen(true);
    };

    // Delete a stock item
    const handleDeleteClick = (stockId: string) => {
        if (window.confirm("Are you sure you want to delete this stock item?")) {
            setStocks(stocks.filter(stock => stock.id !== stockId));

            // If we're editing this stock, close the form
            if (editingStock && editingStock.id === stockId) {
                resetForm();
            }
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: "",
            category: "",
            price: "",
            quantity: "",
            reorderLevel: ""
        };

        if (formData.name.trim() === "") {
            newErrors.name = "Product name is required";
            isValid = false;
        }

        if (formData.category.trim() === "") {
            newErrors.category = "Category is required";
            isValid = false;
        }

        if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            newErrors.price = "Valid price is required";
            isValid = false;
        }

        if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
            newErrors.quantity = "Valid quantity is required";
            isValid = false;
        }

        if (!formData.reorderLevel || isNaN(Number(formData.reorderLevel)) || Number(formData.reorderLevel) < 0) {
            newErrors.reorderLevel = "Valid reorder level is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
            // Generate a unique ID for new stock
            const newStock: Stock = {
                id: `STK-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                name: formData.name,
                category: formData.category,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                description: formData.description,
                supplier: formData.supplier,
                reorderLevel: Number(formData.reorderLevel)
            };

            setStocks((prevStocks) => [...prevStocks, newStock]);
        } else if (dialogMode === "edit" && editingStock) {
            setStocks(prevStocks =>
                prevStocks.map(stock =>
                    stock.id === editingStock.id
                        ? {
                            ...stock,
                            name: formData.name,
                            category: formData.category,
                            price: Number(formData.price),
                            quantity: Number(formData.quantity),
                            description: formData.description,
                            supplier: formData.supplier,
                            reorderLevel: Number(formData.reorderLevel)
                        }
                        : stock
                )
            );
        }

        resetForm();
    };

    // Get stocks that need reordering
    const lowStockItems = stocks.filter(stock => stock.quantity <= stock.reorderLevel);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Stock Management</h2>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>Low Stock Alert:</strong> {lowStockItems.length} item(s) need reordering
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Stock Button */}
            <div className="mb-6">
                <button
                    onClick={handleAddClick}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Stock Item
                </button>
            </div>

            {/* Stock Dialog */}
            <Dialog
                isOpen={isDialogOpen}
                onClose={resetForm}
                title={dialogMode === "add" ? "Add New Stock Item" : `Edit Stock ${editingStock?.id || ""}`}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                                    errors.name ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                                }`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                                    errors.category ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                                }`}
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price (LKR) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                                    errors.price ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                                }`}
                            />
                            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                        </div>

                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                                    errors.quantity ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                                }`}
                            />
                            {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
                        </div>

                        <div>
                            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                                Supplier
                            </label>
                            <input
                                type="text"
                                id="supplier"
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleChange}
                                placeholder="Enter supplier name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="reorderLevel" className="block text-sm font-medium text-gray-700 mb-1">
                                Reorder Level <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="reorderLevel"
                                name="reorderLevel"
                                value={formData.reorderLevel}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                                    errors.reorderLevel ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                                }`}
                            />
                            {errors.reorderLevel && <p className="mt-1 text-sm text-red-500">{errors.reorderLevel}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter product description"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                        />
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
                                    Add Stock
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Update Stock
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Dialog>

            {/* Stock List */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Stock Inventory</h3>
                <div className="text-sm text-gray-500">
                    {stocks.length} {stocks.length === 1 ? 'item' : 'items'} in inventory
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Product Name</th>
                        <th className="py-2 px-4 border-b">Category</th>
                        <th className="py-2 px-4 border-b">Price (LKR)</th>
                        <th className="py-2 px-4 border-b">Quantity</th>
                        <th className="py-2 px-4 border-b">Supplier</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stocks.length > 0 ? (
                        stocks.map((stock) => (
                            <tr key={stock.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{stock.id}</td>
                                <td className="py-2 px-4 border-b font-medium">{stock.name}</td>
                                <td className="py-2 px-4 border-b">{stock.category}</td>
                                <td className="py-2 px-4 border-b">{stock.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 border-b">
                    <span className={`font-medium ${stock.quantity <= stock.reorderLevel ? 'text-red-600' : 'text-green-600'}`}>
                      {stock.quantity}
                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">{stock.supplier || '-'}</td>
                                <td className="py-2 px-4 border-b">
                                    {stock.quantity <= stock.reorderLevel ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Low Stock
                      </span>
                                    ) : stock.quantity <= stock.reorderLevel * 2 ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Medium Stock
                      </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        In Stock
                      </span>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditClick(stock)}
                                            className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-sm flex items-center"
                                            title="Edit stock"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            <span className="ml-1">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(stock.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm flex items-center"
                                            title="Delete stock"
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
                            <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                                No stock items found. Click "Add Stock Item" to add one.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockPage;