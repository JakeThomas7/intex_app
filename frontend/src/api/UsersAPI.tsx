import User from "../types/User";

//const API_URL = 'https://localhost:5000';
const API_URL = 'https://api.byjacobthomas.com'

export const updateProfile = async (user: User | null): Promise<void> => {
    const response = await fetch(`${API_URL}/Identity/updateUserProfile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error('There was an unexpected error.');
    }
};

export const getUsers = async (): Promise<any> => {
    const response = await fetch(`${API_URL}/Identity/users`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('There was an unexpected error.');
    }

    const data = await response.json();
    return data;
};