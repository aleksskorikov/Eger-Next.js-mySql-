import React from 'react';
import { Printer } from 'lucide-react';
import styles from './_btns.module.scss';

const PrintOrderButton = ({ order }) => {
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const orderHtml = `
            <html>
            <head>
                <title>Замовлення #${order.id}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { font-size: 20px; margin-bottom: 10px; }
                    p { margin: 5px 0; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                </style>
            </head>
            <body>
                <h1>Замовлення #${order.id}</h1>
                <p><strong>Клієнт:</strong> ${order.surname} ${order.name} ${order.patronymic}</p>
                <p><strong>Телефон:</strong> ${order.phone}</p>
                <p><strong>Доставка:</strong> ${order.delivery_method}, ${order.address}, ${order.city}, ${order.region}</p>
                <p><strong>Відділення:</strong> ${order.department || '—'}</p>
                <table>
                    <thead>
                        <tr><th>Товар</th><th>Ціна</th><th>К-сть</th><th>Сума</th></tr>
                    </thead>
                    <tbody>
                        ${order.OrderItems?.map(item => `
                            <tr>
                                <td>${item.Product?.name || '—'}</td>
                                <td>$${item.price.toFixed(2)}</td>
                                <td>${item.quantity}</td>
                                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p><strong>Разом:</strong> $${order.total_price}</p>
            </body>
            </html>
        `;

        printWindow.document.write(orderHtml);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className={styles.orderButtons}>
            <button className={styles.printButton} onClick={handlePrint} title="Роздрукувати замовлення">
                <Printer size={20} />
            </button>
        </div>
    );
};

export default PrintOrderButton;
