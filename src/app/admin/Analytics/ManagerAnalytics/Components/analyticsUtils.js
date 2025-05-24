export function getManagerAnalytics(managerId, data) {
    const {
        orders = [],
        completedOrders = [],
        rejectedOrders = [],
        inProgressOrders = [],
        orderItems = [],
        products = []
    } = data;

    const managerOrders = orders.filter(o => o.staff_id === managerId);
    const managerCompleted = completedOrders.filter(o => o.staff_id === managerId);
    const managerRejected = rejectedOrders.filter(o => o.staff_id === managerId);
    const managerInProgress = inProgressOrders.filter(o => o.staff_id === managerId);
    const completedOrderIds = new Set(managerCompleted.map(o => o.order_id));
    const completedItems = orderItems.filter(item => completedOrderIds.has(item.order_id));
    const productsMap = new Map();

    completedItems.forEach(item => {
        const key = `${item.product_id}_${item.price}`;
        if (!productsMap.has(key)) {
            const product = products.find(p => String(p.id) === String(item.product_id)) || {};
            productsMap.set(key, {
                name: product.name || `Неизвестный товар #${item.product_id}`,
                quantity: 0,
                price: item.price,
                totalPrice: 0,
            });
        }
        const prod = productsMap.get(key);
        prod.quantity += item.quantity;
        prod.totalPrice += item.price * item.quantity;
    });

    const productsList = Array.from(productsMap.values());
    const totalSales = productsList.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalProducts = productsList.reduce((sum, item) => sum + item.quantity, 0);

    const avgProcessingTime =
        managerCompleted.length > 0
            ? (
                managerCompleted.reduce((sum, order) => {
                    const start = new Date(order.created_at);
                    const end = new Date(order.completed_at);
                    if (isNaN(start) || isNaN(end)) return sum;
                    return sum + (end - start);
                }, 0) / managerCompleted.length / 1000 / 60 / 60
            ).toFixed(1)
            : 0;

    const uniqueCustomers = new Set(managerCompleted.map(o => o.user_id)).size;

    return {
        totalOrders: managerOrders.length,
        completedCount: managerCompleted.length,
        rejectedCount: managerRejected.length,
        inProgressCount: managerInProgress.length,
        totalProducts,
        totalSales,
        avgProcessingTime,
        uniqueCustomers,
        products: productsList,
    };
}












