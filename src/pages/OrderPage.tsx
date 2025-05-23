import { useState } from "react";
import { orderData } from "../data/OrderData";
import { stockData } from "../data/StockData";
import { customerData } from "../data/CustomerData";
import type { Order } from "../types/Order";
import type { OrderItem } from "../types/OrderItem.ts";
import type { Stock } from "../types/Stock";
import type { Customer } from "../types/Customer";
import Dialog from "../components/Dialog";

const OrderPage = () => {
    const [orders, setOrders] = useState<Order[]>(orderData);
    const [stocks] = useState<Stock[]>(stockData);
    const [customers] = useState<Customer[]>(customerData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit" | "view">("add");
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [formData, setFormData] = useState({
        customerId: "",
        customerName: "",
        paymentMethod: "cash" as "cash" | "card" | "mobile",
        status: "pending" as "pending" | "completed" | "cancelled"
    });
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [newItem, setNewItem] = useState({
        stockId: "",
        quantity: ""
    });
    const [errors, setErrors] = useState({
        items: "",
        customer: ""
    });

    // Reset the form and close the dialog
    const resetForm = () => {
        setFormData({
            customerId: "",
            customerName: "",
            paymentMethod: "cash",
            status: "pending"
        });
        setOrderItems([]);
        setNewItem({
            stockId: "",
            quantity: ""
        });
        setErrors({
            items: "",
            customer: ""
        });
        setIsDialogOpen(false);
        setEditingOrder(null);
    };

    // Open add order dialog
    const handleAddClick = () => {
        resetForm();
        setDialogMode("add");
        setIsDialogOpen(true);
    };

    // View order details
    const handleViewClick = (order: Order) => {
        setEditingOrder(order);
        setFormData({
            customerId: order.customerId || "",
            customerName: order.customerName || "",
            paymentMethod: order.paymentMethod,
            status: order.status
        });
        setOrderItems(order.items);
        setDialogMode("view");
        setIsDialogOpen(true);
    };

    // Initialize the edit form with order data
    const handleEditClick = (order: Order) => {
        setEditingOrder(order);
        setFormData({
            customerId: order.customerId || "",
            customerName: order.customerName || "",
            paymentMethod: order.paymentMethod,
            status: order.status
        });
        setOrderItems([...order.items]);
        setDialogMode("edit");
        setIsDialogOpen(true);
    };

    // Delete an order
    const handleDeleteClick = (orderId: string) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            setOrders(orders.filter(order => order.id !== orderId));

            if (editingOrder && editingOrder.id === orderId) {
                resetForm();
            }
        }
    };

    // Handle customer selection
    const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const customerId = e.target.value;
        const customer = customers.find(c => c.id === customerId);

        setFormData(prev => ({
            ...prev,
            customerId,
            customerName: customer ? customer.name : ""
        }));

        if (errors.customer) {
            setErrors(prev => ({ ...prev, customer: "" }));
        }
    };

    // Add item to order
    const handleAddItem = () => {
        if (!newItem.stockId || !newItem.quantity || Number(newItem.quantity) <= 0) {
            return;
        }

        const stock = stocks.find(s => s.id === newItem.stockId);
        if (!stock) return;

        const quantity = Number(newItem.quantity);
        const existingItemIndex = orderItems.findIndex(item => item.stockId === newItem.stockId);

        if (existingItemIndex >= 0) {
            // Update existing item
            const updatedItems = [...orderItems];
            updatedItems[existingItemIndex].quantity += quantity;
            updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * stock.price;
            setOrderItems(updatedItems);
        } else {
            // Add new item
            const orderItem: OrderItem = {
                stockId: stock.id,
                stockName: stock.name,
                price: stock.price,
                quantity: quantity,
                total: stock.price * quantity
            };
            setOrderItems([...orderItems, orderItem]);
        }

        setNewItem({ stockId: "", quantity: "" });
        if (errors.items) {
            setErrors(prev => ({ ...prev, items: "" }));
        }
    };

    // Remove item from order
    const handleRemoveItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    // Update item quantity
    const handleUpdateItemQuantity = (index: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveItem(index);
            return;
        }

        const updatedItems = [...orderItems];
        updatedItems[index].quantity = newQuantity;
        updatedItems[index].total = newQuantity * updatedItems[index].price;
        setOrderItems(updatedItems);
    };

    // Calculate total amount
    const calculateTotal = () => {
        return orderItems.reduce((sum, item) => sum + item.total, 0);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            items: "",
            customer: ""
        };

        if (orderItems.length === 0) {
            newErrors.items = "At least one item is required";
            isValid = false;
        }

        if (!formData.customerId && !formData.customerName.trim()) {
            newErrors.customer = "Customer information is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const totalAmount = calculateTotal();
        const orderDate = new Date().toISOString().split('T')[0];

        if (dialogMode === "add") {
            const newOrder: Order = {
                id: `ORD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                customerId: formData.customerId || undefined,
                customerName: formData.customerName || "Walk-in Customer",
                items: orderItems,
                totalAmount,
                orderDate,
                status: formData.status,
                paymentMethod: formData.paymentMethod
            };

            setOrders(prevOrders => [...prevOrders, newOrder]);
        } else if (dialogMode === "edit" && editingOrder) {
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === editingOrder.id
                        ? {
                            ...order,
                            customerId: formData.customerId || undefined,
                            customerName: formData.customerName || "Walk-in Customer",
                            items: orderItems,
                            totalAmount,
                            status: formData.status,
                            paymentMethod: formData.paymentMethod
                        }
                        : order
                )
            );
        }

        resetForm();
    };

    // Get status badge color
    const getStatusBadge = (status: string) => {
        const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
        switch (status) {
            case "completed":
                return `${baseClasses} bg-green-100 text-green-800`;
            case "pending":
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case "cancelled":
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const availableStocks = stocks.filter(stock => stock.quantity > 0);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Order Management</h2>

            {/* Add Order Button */}
            <div className="mb-6">
                <button
                    onClick={handleAddClick}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Order
                </button>
            </div>

            {/* Order Dialog */}
            <Dialog
                isOpen={isDialogOpen}
                onClose={resetForm}
                title={
                    dialogMode === "add" ? "Create New Order" :
                        dialogMode === "edit" ? `Edit Order ${editingOrder?.id || ""}` :
                            `Order Details - ${editingOrder?.id || ""}`
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Customer Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
                                Select Customer
                            </label>
                            <select
                                id="customerId"
                                name="customerId"
                                value={formData.customerId}
                                onChange={handleCustomerChange}
                                disabled={dialogMode === "view"}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                            >
                                <option value="">Select Customer</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                                Or Enter Customer Name
                            </label>
                            <input
                                type="text"
                                id="customerName"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleFormChange}
                                placeholder="Walk-in customer name"
                                disabled={dialogMode === "view" || !!formData.customerId}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                            />
                            {errors.customer && <p className="mt-1 text-sm text-red-500">{errors.customer}</p>}
                        </div>
                    </div>

                    {/* Payment Method and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Method
                            </label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleFormChange}
                                disabled={dialogMode === "view"}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="mobile">Mobile Payment</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleFormChange}
                                disabled={dialogMode === "view"}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Add Items Section */}
                    {dialogMode !== "view" && (
                        <div className="border-t pt-4">
                            <h4 className="text-lg font-medium mb-3">Add Items</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div>
                                    <label htmlFor="stockId" className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Product
                                    </label>
                                    <select
                                        id="stockId"
                                        value={newItem.stockId}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, stockId: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">Select Product</option>
                                        {availableStocks.map(stock => (
                                            <option key={stock.id} value={stock.id}>
                                                {stock.name} - LKR {stock.price.toLocaleString()} (Qty: {stock.quantity})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                                        placeholder="0"
                                        min="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
                                    >
                                        Add Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Items List */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-medium mb-3">Order Items</h4>
                        {orderItems.length > 0 ? (
                            <div className="space-y-2">
                                {orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.stockName}</p>
                                            <p className="text-sm text-gray-600">
                                                LKR {item.price.toLocaleString()} × {item.quantity} = LKR {item.total.toLocaleString()}
                                            </p>
                                        </div>
                                        {dialogMode !== "view" && (
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleUpdateItemQuantity(index, Number(e.target.value))}
                                                    min="1"
                                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="border-t pt-2 mt-2">
                                    <p className="text-lg font-bold text-right">
                                        Total: LKR {calculateTotal().toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No items added to this order</p>
                        )}
                        {errors.items && <p className="mt-1 text-sm text-red-500">{errors.items}</p>}
                    </div>

                    {/* Form Actions */}
                    <div className="flex space-x-3 pt-3">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150"
                        >
                            {dialogMode === "view" ? "Close" : "Cancel"}
                        </button>
                        {dialogMode !== "view" && (
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
                                        Create Order
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Update Order
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </Dialog>

            {/* Orders List */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Orders List</h3>
                <div className="text-sm text-gray-500">
                    {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="py-2 px-4 border-b">Order ID</th>
                        <th className="py-2 px-4 border-b">Customer</th>
                        <th className="py-2 px-4 border-b">Items</th>
                        <th className="py-2 px-4 border-b">Total Amount</th>
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Payment</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b font-medium">{order.id}</td>
                                <td className="py-2 px-4 border-b">{order.customerName}</td>
                                <td className="py-2 px-4 border-b">{order.items.length} item(s)</td>
                                <td className="py-2 px-4 border-b font-medium">
                                    LKR {order.totalAmount.toLocaleString()}
                                </td>
                                <td className="py-2 px-4 border-b">{order.orderDate}</td>
                                <td className="py-2 px-4 border-b capitalize">{order.paymentMethod}</td>
                                <td className="py-2 px-4 border-b">
                    <span className={getStatusBadge(order.status)}>
                      {order.status}
                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleViewClick(order)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm flex items-center"
                                            title="View order"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="ml-1">View</span>
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(order)}
                                            className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-sm flex items-center"
                                            title="Edit order"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            <span className="ml-1">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(order.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm flex items-center"
                                            title="Delete order"
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
                                No orders found. Click "Create New Order" to add one.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderPage;