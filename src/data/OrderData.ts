import type { Order } from "../types/Order";

export const orderData: Order[] = [
    {
        id: "ORD-001",
        customerId: "1",
        customerName: "Chamath Perera",
        items: [
            {
                stockId: "STK-001",
                stockName: "Samsung Galaxy S24",
                price: 125000.00,
                quantity: 1,
                total: 125000.00
            },
            {
                stockId: "STK-004",
                stockName: "Sony WH-1000XM5",
                price: 45000.00,
                quantity: 1,
                total: 45000.00
            }
        ],
        totalAmount: 170000.00,
        orderDate: "2024-01-15",
        status: "completed",
        paymentMethod: "card"
    },
    {
        id: "ORD-002",
        customerId: "2",
        customerName: "Kavindi Silva",
        items: [
            {
                stockId: "STK-005",
                stockName: "iPad Air",
                price: 95000.00,
                quantity: 1,
                total: 95000.00
            }
        ],
        totalAmount: 95000.00,
        orderDate: "2024-01-16",
        status: "pending",
        paymentMethod: "cash"
    },
    {
        id: "ORD-003",
        customerName: "Walk-in Customer",
        items: [
            {
                stockId: "STK-003",
                stockName: "Dell XPS 13",
                price: 220000.00,
                quantity: 1,
                total: 220000.00
            }
        ],
        totalAmount: 220000.00,
        orderDate: "2024-01-17",
        status: "completed",
        paymentMethod: "mobile"
    }
];

export default orderData;