interface MovieUser {
    name: string | undefined;
    email: string | undefined;     
    phone: string | undefined;    
    age: number | undefined;      
    gender: string | undefined;   
    city: string | undefined;     
    state: string | undefined;    
    zip:number | undefined; 
    streamingServiceIds: number[] | string[] | []; 
}

export default MovieUser;