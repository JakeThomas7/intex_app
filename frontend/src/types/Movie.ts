import Genre from "./Genre";

interface Movie {
    showId?: string;
    title?: string;
    director?: string ;
    cast?: string ;
    country?: string;
    type?: string ;
    releaseYear?: number | undefined;
    rating?: string;
    duration?: string;
    description?: string;
    image_url_suffix? : string;
    genres?: Genre[];
}

export default Movie