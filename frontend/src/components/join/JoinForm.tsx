import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register, sendOtp } from '../../api/AuthenticationAPI'
import { addMovieUser } from '../../api/MovieUserAPI';

const JoinForm = () => {
    const [form, setForm] = useState({
        Email: '',
        Password: '',
        ConfirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible); // Toggle visibility state
    };

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
        e.preventDefault();

        // validate email and passwords
        if (!form.Email || !form.Password || !form.ConfirmPassword) {
            setError('Please fill in all fields.');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) {
            setError('Please enter a valid email address.');
        } else if (form.Password !== form.ConfirmPassword) {
            setError('Passwords do not match.');
        } else {

            setError('');
            setIsLoading(true);

            try {

                // 1. First try login
                console.log('LOGING USER IN')
                const movieUserData = {
                    email: form.Email
                }
                await addMovieUser(movieUserData)
                await register(form.Email, form.Password);
                await login(form.Email, form.Password, false)
                
                console.log('SENDING 2 FACTOR AUTH')
                // 2. Only if login succeeds, proceed with OTP flow
                try {
                    await sendOtp(form.Email);
                } catch (otpError) {
                    // Still navigate even if OTP fails, but show error
                    setError((otpError as Error).message);
                }
                
                console.log('NAVIGATING TO MFA')
                // 3. Navigate regardless of OTP success (but only if login succeeded)
                navigate('/mfa', {
                    state: { email: form.Email, type: 'join' }
                });


            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
            
        }
    };

    return (
        <div className="section-padding join-section d-flex justify-content-center align-items-center w-100 bg-white">
            <form className="join-form" onSubmit={handleSubmit}>
                <h3 className="mb-3">First time here?<br/>Create your own personal account.</h3>
                {/* <button className="btn btn-outline-dark w-100 mb-3"><i className="fa-brands fa-google me-2"></i>Continue with Google</button> */}

                <hr/>

                <div className="mb-3">
                    <label htmlFor="Email" className="form-label">Email</label>
                    <div className="position-relative">
                        <i className="fa-regular fa-envelope position-absolute top-50 translate-middle-y ms-3 text-muted" />
                        <input
                        type="email"
                        className="form-control ps-5"
                        id="Email"
                        placeholder="Enter your email..."
                        value={form.Email}
                        onChange={handleChange}
                        required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="Password" className="form-label">Password</label>
                    <div className="position-relative">
                        <i 
                        className={`fa-regular ${isPasswordVisible ? "fa-eye" : "fa-eye-slash"} position-absolute top-50 translate-middle-y ms-3 text-muted password-toggle`}
                        style={{ cursor: "pointer", zIndex: 2 }}
                        onClick={togglePasswordVisibility} // Toggle visibility
                        />
                        <input 
                        type={isPasswordVisible ? "text" : "password"} // Dynamically set type
                        className="form-control ps-5" 
                        id="Password" 
                        placeholder="Enter your password..." 
                        value={form.Password}
                        onChange={handleChange}
                        required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="ConfirmPassword" className="form-label">Confirm Password</label>
                    <div className="position-relative">
                        <i 
                        className={`fa-regular ${isPasswordVisible ? "fa-eye" : "fa-eye-slash"} position-absolute top-50 translate-middle-y ms-3 text-muted password-toggle`}
                        style={{ cursor: "pointer", zIndex: 2 }}
                        onClick={togglePasswordVisibility} // Toggle visibility
                        />
                        <input 
                        type={isPasswordVisible ? "text" : "password"} // Dynamically set type
                        className="form-control ps-5" 
                        id="ConfirmPassword" 
                        placeholder="Enter your password..." 
                        value={form.ConfirmPassword}
                        onChange={handleChange}
                        required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary text-white w-100 mb-3"
                    disabled={isLoading || !!error}
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