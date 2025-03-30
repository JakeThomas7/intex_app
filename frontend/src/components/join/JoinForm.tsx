import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkUsername, createUser } from '../../api/UsersAPI'

const JoinForm = () => {
    const [form, setForm] = useState({
        FirstName: '',
        LastName: '',
        Username: '',
        Password: '',
        ConfirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [usernameAvailable, setUsernameAvailable] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState('');

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

    const isAvailable = async (username: string) => {
        try {
            await checkUsername(username);
            setUsernameAvailable(true)
            setUsernameMessage('')
        } catch (err) {
            setUsernameMessage((err as Error).message);
            setUsernameAvailable(false)
        }
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await createUser(form);
            navigate('/');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="section-padding join-section d-flex justify-content-center align-items-center w-100">
            <form className="join-form" onSubmit={handleSubmit}>
                <h3>First time here?<br/>Create your own personal account.</h3>
                <hr/>

                <div className="mb-3">
                    <label htmlFor="FirstName" className="form-label">First Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="FirstName" 
                        placeholder="Enter your first name..." 
                        value={form.FirstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="LastName" className="form-label">Last Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="LastName" 
                        placeholder="Enter your last name..." 
                        value={form.LastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Username" className="form-label">Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="Username" 
                        placeholder="Enter your username..." 
                        value={form.Username}
                        onChange={(e) => {
                            handleChange(e);
                            isAvailable(e.target.value);
                        }}
                        required
                    />
                </div>
                <div className="text-center text-danger mb-3">
                    {usernameMessage}
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
                    disabled={isLoading || !!error || !usernameAvailable}
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