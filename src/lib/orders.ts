// Order history — backed by the real /api/orders endpoint (requires login).
import { customerApi, ApiError } from './customer-api';

export interface OrderItem {
    id: string;
    name: string;
    brand: string;
    image: string;
    qty: number;
    salePrice: number;
    status: 'PLACED' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

export interface OrderAddress {
    name: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
}

export interface Order {
    orderNumber: string;
    placedAt: string;
    status: 'PENDING' | 'PAYMENT_FAILED' | 'PLACED' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentMethod: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    discount: number;
    couponCode: string | null;
    total: number;
    address: OrderAddress;
}

export function getOrders(): Promise<Order[]> {
    return customerApi.get<Order[]>('/orders');
}

export async function getOrder(orderNumber: string): Promise<Order | undefined> {
    try {
        return await customerApi.get<Order>(`/orders/${orderNumber}`);
    } catch (err) {
        if (err instanceof ApiError && err.status === 404) return undefined;
        throw err;
    }
}

export function cancelOrder(orderNumber: string, reason?: string, itemIds?: string[]): Promise<Order> {
    return customerApi.patch<Order>(`/orders/${orderNumber}/cancel`, { reason, itemIds });
}
