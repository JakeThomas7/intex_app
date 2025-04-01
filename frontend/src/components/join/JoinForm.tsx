import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../../api/AuthenticationAPI'
import { useAuth } from '../context/AuthContext';

const JoinForm = () => {
    const [form, setForm] = useState({
        Email: '',
        Password: '',
        ConfirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {checkAuth} = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: { target: { id: any; value: any; }; }) => {
        const { id, value } = e.target;
        setForm(prev => {
            const updatedForm = { ...prev, [id]: value };
    
            // Check password match directly in the updated form
            if (updatedForm.Password !== updatedForm.ConfirmPassword) {
                setError('Passwords do not match.');
            } else {
                setError('');
            }
    
            return updatedForm;
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {

        // validate email and passwords
        if (!form.Email || !form.Password || !form.ConfirmPassword) {
            setError('Please fill in all fields.');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) {
            setError('Please enter a valid email address.');
        } else if (form.Password !== form.ConfirmPassword) {
            setError('Passwords do not match.');
        } else {

            e.preventDefault();
            setError('');
            setIsLoading(true);

            try {
                await register(form.Email, form.Password);
                await login(form.Email, form.Password)
                await checkAuth();
                navigate('/');
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
            
        }
    };

    return (
        <div className="section-padding join-section d-flex justify-content-center align-items-center w-100">
            <form className="join-form">
                <h3 className="mb-3">First time here?<br/>Create your own personal account.</h3>
                <button className="btn btn-outline-dark w-100 mb-3"><i className="fa-brands fa-google me-2"></i>Continue with Google</button>

                <hr/>

                <div className="mb-3">
                    <label htmlFor="Email" className="form-label">Email</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="Email" 
                        placeholder="Enter your email..." 
                        value={form.Email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Password" className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="Password" 
                        placeholder="Enter your password..." 
                        value={form.Password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="ConfirmPassword" className="form-label">Confirm Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="ConfirmPassword" 
                        placeholder="Confirm your password..." 
                        value={form.ConfirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary text-white w-100 mb-3"
                    disabled={isLoading || !!error}
                    onClick={handleSubmit}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Loading...
                        </>
                    ) : (
                        'Continue'
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

export default JoinForm;