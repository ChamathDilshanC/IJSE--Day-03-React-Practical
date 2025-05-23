import type { Stock } from "../types/Stock";

export const stockData: Stock[] = [
    {
        id: "STK-001",
        name: "Samsung Galaxy S24",
        category: "Electronics",
        price: 125000.00,
        quantity: 25,
        description: "Latest Samsung flagship smartphone",
        supplier: "Samsung Electronics",
        reorderLevel: 5
    },
    {
        id: "STK-002",
        name: "iPhone 15",
        category: "Electronics",
        price: 180000.00,
        quantity: 15,
        description: "Apple iPhone 15 with advanced features",
        supplier: "Apple Inc.",
        reorderLevel: 3
    },
    {
        id: "STK-003",
        name: "Dell XPS 13",
        category: "Computers",
        price: 220000.00,
        quantity: 8,
        description: "Ultra-portable laptop with premium build",
        supplier: "Dell Technologies",
        reorderLevel: 2
    },
    {
        id: "STK-004",
        name: "Sony WH-1000XM5",
        category: "Audio",
        price: 45000.00,
        quantity: 30,
        description: "Premium noise-canceling headphones",
        supplier: "Sony Corporation",
        reorderLevel: 10
    },
    {
        id: "STK-005",
        name: "iPad Air",
        category: "Tablets",
        price: 95000.00,
        quantity: 12,
        description: "Apple iPad Air with M1 chip",
        supplier: "Apple Inc.",
        reorderLevel: 4
    }
];

export default stockData;