import type {OrderItem} from "./OrderItem.ts";

export interface Order {
    id: string;
    customerId?: string;
    customerName?: string;
    items: OrderItem[];
    totalAmount: number;
    orderDate: string;
    status: 'pending' | 'completed' | 'cancelled';
    paymentMethod: 'cash' | 'card' | 'mobile';
}