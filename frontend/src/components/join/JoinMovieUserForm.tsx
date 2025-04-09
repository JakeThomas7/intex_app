import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { addMovieUser } from '../../api/MovieUserAPI';
import "../../styles/JoinMovieUserPage.css"

interface StreamingService {
    id: number;
    name: string;
}

const MovieUserProfileForm = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        age: '',
        gender: '',
        city: '',
        state: '',
        zip: '',
        streamingServiceIds: [] as number[]
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingServices, setStreamingServices] = useState<StreamingService[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch streaming services when component mounts
    useEffect(() => {
        const fetchStreamingServices = async () => {
            try {
                // Replace with your actual API call
                // const services = await getStreamingServices();
                // setStreamingServices(services);
                
                // Mock data for demonstration
                setStreamingServices([
                    { id: 1, name: 'Netflix' },
                    { id: 2, name: 'Amazon Prime' },
                    { id: 3, name: 'Disney+' },
                    { id: 4, name: 'Hulu' },
                    { id: 5, name: 'HBO Max' },
                    { id: 6, name: 'Apple TV+' },
                    { id: 7, name: 'Peacock' },
                    { id: 8, name: 'Paramount+' }
                ]);
            } catch (err) {
                setError('Failed to load streaming services');
            }
        };
        
        fetchStreamingServices();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setForm(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleCheckboxChange = (serviceId: number) => {
        setForm(prev => {
            const newServices = prev.streamingServiceIds.includes(serviceId)
                ? prev.streamingServiceIds.filter(id => id !== serviceId)
                : [...prev.streamingServiceIds, serviceId];
            
            return {
                ...prev,
                streamingServiceIds: newServices
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        // if (!form.firstName || !form.lastName) {
        //     setError('First and last name are required');
        //     return;
        // }

        if (form.age && isNaN(Number(form.age))) {
            setError('Age must be a number');
            return;
        }

        if (form.zip && isNaN(Number(form.zip))) {
            setError('ZIP code must be a number');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const movieUserData = {
                ...form,
                name: `${form.firstName} ${form.lastName}`,
                email: user?.email,
                age: form.age ? parseInt(form.age) : undefined,
                zip: form.zip ? parseInt(form.zip) : undefined
            };
            console.log(movieUserData)
            await addMovieUser(movieUserData);
            navigate('/browse'); // Or wherever you want to redirect after success
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="section-padding join-movie-user-section d-flex justify-content-center align-items-center w-100 bg-white">
            <form className="profile-form" onSubmit={handleSubmit}>
                <h3 className="mb-3 mt-2">Complete Your Profile<br/>Tell us more about yourself to personalize your experience.</h3>
                <button 
                    type="submit" 
                    className="btn btn-outline-dark btn-outline-custom-white w-100 mb-3"
                    onClick={handleSubmit}
                >Skip for now <i className="fa-solid fa-arrow-right"></i></button>
                <hr/>

                <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder="First name"
                            value={form.firstName}
                            onChange={handleChange}
                            
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder="Last name"
                            value={form.lastName}
                            onChange={handleChange}
                            
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        placeholder="(123) 456-7890"
                        value={form.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="row mb-3">
                    <div className="col-md-4 mb-3 mb-md-0">
                        <label htmlFor="age" className="form-label">Age</label>
                        <input
                            type="number"
                            className="form-control"
                            id="age"
                            placeholder="Age"
                            min="1"
                            max="120"
                            value={form.age}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-8">
                        <label htmlFor="gender" className="form-label">Gender</label>
                        <select
                            className="form-select"
                            id="gender"
                            value={form.gender}
                            onChange={handleChange}
                        >
                            <option value="">Prefer not to say</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non-binary</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <label htmlFor="city" className="form-label">City</label>
                        <input
                            type="text"
                            className="form-control"
                            id="city"
                            placeholder="City"
                            value={form.city}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="state" className="form-label">State</label>
                        <input
                            type="text"
                            className="form-control"
                            id="state"
                            placeholder="State"
                            value={form.state}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="zip" className="form-label">ZIP</label>
                        <input
                            type="text"
                            className="form-control"
                            id="zip"
                            placeholder="ZIP code"
                            value={form.zip}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label">Streaming Services</label>
                    <div className="d-flex flex-wrap gap-3">
                        {streamingServices.map(service => (
                            <div key={service.id} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`service-${service.id}`}
                                    checked={form.streamingServiceIds.includes(service.id)}
                                    onChange={() => handleCheckboxChange(service.id)}
                                />
                                <label className="form-check-label" htmlFor={`service-${service.id}`}>
                                    {service.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary text-white w-100 mb-3"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                        </>
                    ) : (
                        'Save Profile'
                    )}
                </button>

                {error && (
                    <div className="text-center text-danger">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
};

export default MovieUserProfileForm;