import Headline from "../types/Headline";

//const API_URL = 'https://localhost:5000';
const API_URL = 'https://api.byjacobthomas.com'

export const fetchHeadlines = async (): Promise<Headline[]> => {

    // const categoryParams = selectedCategories
    //     .map((cat) => `categories=${encodeURIComponent(cat)}`)
    //     .join('&');

    const response = await fetch(`${API_URL}/Headline/GetHeadlines`);

    if (!response.ok) {
        throw new Error('Failed to get headlines');
    }

    const data = await response.json();

    return data;

}

export const createHeadline = async (newHeadline: Headline): Promise<Headline> => {
    
    const response = await fetch(`${API_URL}/Headline/CreateHeadline`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHeadline)
    });

    if (!response.ok) {
        throw new Error('Failed to add headline');
    }

    const data = await response.json();
    return data;

}

export const updateHeadline = async (headlineID: number, updatedHeadline: Headline): Promise<Headline> => {

    const response = await fetch(`${API_URL}/Headline/UpdateHeadline/${headlineID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedHeadline)
    });

    if (!response.ok) {
        throw new Error('Failed to update project');
    }        
    const data = await response.json();
    return data;
}

export const deleteHeadline = async (headlineID: number): Promise<void> => {
    try {
        await fetch(`${API_URL}/Headline/DeleteHeadline/${headlineID}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error
    }
}