import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const JoinForm = () => {

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('sample error')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e: { target: { id: any; value: any; }; }) => {
        const { id, value } = e.target;
        setForm(prev => ({
            ...prev,
            [id]: value
        }));
    };

    return (
        <div className="section-padding join-section d-flex justify-content-center align-items-center w-100">
            <form className="join-form">
                <h3>First time here?<br/>Create your own personal account.</h3>
                <hr/>

                <div className="mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="firstName" 
                    placeholder="Enter your first name..." 
                    value={form.firstName}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="lastName" 
                    placeholder="Enter your last name..." 
                    value={form.lastName}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="username" 
                    placeholder="Enter your username..." 
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                </div>
                
                <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    placeholder="Enter your password..." 
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input 
                    type="confirmPassword" 
                    className="form-control" 
                    id="confirmPassword" 
                    placeholder="Confirm your password..." 
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary text-white w-100 mb-3"
                    disabled={isLoading}
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
    )
}

export default JoinForm