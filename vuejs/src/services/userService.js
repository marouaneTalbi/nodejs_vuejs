import Cookies from 'js-cookie';

export const getCurrentUser = () => {
    const token = Cookies.get('token');
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    const userId = decodedPayload.id;
    return userId;
}