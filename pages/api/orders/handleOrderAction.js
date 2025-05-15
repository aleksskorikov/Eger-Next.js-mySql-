// utils/handleOrderAction.js
export const handleOrderAction = async ({ url, method, data, token, onSuccess, onError }) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Помилка при обробці запиту');
        }

        if (onSuccess) onSuccess(result);
        return result;
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Сталася помилка');
        if (onError) onError(error);
    }
};
