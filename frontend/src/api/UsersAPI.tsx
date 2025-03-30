import { User } from "../types/User";

const API_URL = 'https://localhost:5000/Users';

export const authenticateUser = async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/Authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.status == 401) {
        throw new Error("Incorrect username or password.");
    } else if (!response.ok) {
        throw new Error("There was an unexpected error.");
    }

    const data = await response.json();

    return data;
};

export const checkUsername = async (username: string) => {

    if (!username) throw new Error("Username cannot be empty.");
    
    const response = await fetch(`${API_URL}/CheckUsername/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (response.status == 409) {
        throw new Error("Username already exists.");
    } else if (!response.ok) {
        throw new Error("There was an unexpected error.");
    }
}


export const createUser = async (user: User): Promise<User> => {
    const response = await fetch(`${API_URL}/Create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error("There was an unexpected error.");
    }

    const data = await response.json();

    return data;
};