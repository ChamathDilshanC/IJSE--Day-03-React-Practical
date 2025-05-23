export interface Stock {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
    supplier?: string;
    reorderLevel: number;
}