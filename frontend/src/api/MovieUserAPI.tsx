import MovieUser from "../types/MovieUser";

//const API_URL = 'https://api2.byjacobthomas.com'
const API_URL = 'https://localhost:5000'

export const addMovieUser = async(movieUser : MovieUser) => {

    const response = await fetch(`${API_URL}/MovieUser/CreateMovieUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(movieUser)
    });

    if (!response.ok) {
        throw new Error('Failed to add movie user');
    }
    const data = response.json()
    console.log("RESPONSE")
    console.log(data)
    return data;
}