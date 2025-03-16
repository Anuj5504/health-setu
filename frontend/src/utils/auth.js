export const getAdminIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id; // Make sure this matches the property name in your JWT token
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
}; 