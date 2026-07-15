// Client-side order history, backed by localStorage. No backend — orders live
// only in this browser, newest first.

export interface OrderItem {
    id: string;
    name: string;
    brand: string;
    image: string;
    qty: number;
    salePrice: number;
}

export interface Address {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
}

export type PaymentMethod = 'cod' | 'card' | 'upi';

export interface Order {
    orderNumber: string;
    placedAt: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    address: Address;
    paymentMethod: PaymentMethod;
}

const ORDERS_KEY = 'ansari_orders';

export function getOrders(): Order[] {
    try {
        const raw = localStorage.getItem(ORDERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveOrder(order: Order) {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getOrder(orderNumber: string): Order | undefined {
    return getOrders().find((o) => o.orderNumber === orderNumber);
}
