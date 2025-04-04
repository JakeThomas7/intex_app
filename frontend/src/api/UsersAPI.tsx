import User from "../types/User";

const API_URL = 'https://localhost:5000';
//const API_URL = 'https://api.byjacobthomas.com'

export const updateProfile = async (user: User | null): Promise<void> => {
    const response = await fetch(`${API_URL}/Users/updateUserProfile`, {
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

interface GetUsersParams {
    pageSize?: number;
    pageNum?: number;
    //sortBy?: string;
    //sortDirection?: 'asc' | 'desc';
    search?: string;
    role?: string;
    // filters?: {
    //   isActive?: boolean;
    //   role?: string[];
    //   // Add other filter fields as needed
    // };
  }

  export const getUsers = async (params: GetUsersParams): Promise<any> => {

    console.log(params)

     // Create URLSearchParams object
    const queryParams = new URLSearchParams();

    // Add pagination parameters
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.pageNum) queryParams.append('pageNum', params.pageNum.toString());

    // Add sorting parameters
    // if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    // if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    // Add search parameter
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);

    // Add filter parameters
    // if (params.filters) {
    //     if (params.filters.isActive !== undefined) {
    //     queryParams.append('isActive', params.filters.isActive.toString());
    //     }
    //     if (params.filters.role) {
    //     params.filters.role.forEach(role => queryParams.append('role', role));
    //     }
    // }

    console.log(queryParams.toString())
    const response = await fetch(`${API_URL}/Users/users?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('There was an unexpected error.');
    }

    const data = await response.json();
    return data;
};

export const assignRole = async (email: string, role: string): Promise<void> => {
    const response = await fetch(`${API_URL}/Users/assignRole?email=${email}&roleName=${role}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('There was an unexpected error.');
    }
};

export const deleteUser = async (email: string): Promise<void> => {
    const response = await fetch(`${API_URL}/Users/deleteUser?email=${email}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('There was an unexpected error.');
    }
};