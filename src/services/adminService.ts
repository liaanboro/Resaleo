
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Helper to get token (assuming it's stored in localStorage, modify if using cookies)
const getAuthHeader = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

// Create axios instance
const adminApi = axios.create({
    baseURL: API_URL,
});

// Interceptor to add token
adminApi.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return config;
});

export const getStats = async () => {
    const response = await adminApi.get('/stats');
    return response.data;
};

export const getUsers = async () => {
    const response = await adminApi.get('/users');
    return response.data;
};

export const toggleBlockUser = async (id: string) => {
    const response = await adminApi.put(`/users/${id}/block`);
    return response.data;
};

export const getListings = async () => {
    const response = await adminApi.get('/listings');
    return response.data;
};

export const deleteListing = async (id: string) => {
    const response = await adminApi.delete(`/listings/${id}`);
    return response.data;
};

export const updateListingStatus = async (id: string, status: string) => {
    const response = await adminApi.put(`/listings/${id}/status`, { status });
    return response.data;
};

export const getChats = async () => {
    const response = await adminApi.get('/chats');
    return response.data;
};

export const getMessages = async (chatId: string) => {
    const response = await adminApi.get(`/chats/${chatId}/messages`);
    return response.data;
};

export const deleteChat = async (id: string) => {
    const response = await adminApi.delete(`/chats/${id}`);
    return response.data;
};

export const deleteMessage = async (id: string) => {
    const response = await adminApi.delete(`/messages/${id}`);
    return response.data;
};

export const getReports = async () => {
    const response = await adminApi.get('/reports');
    return response.data;
};

export const updateReportStatus = async (id: string, status: string) => {
    const response = await adminApi.put(`/reports/${id}`, { status });
    return response.data;
};
