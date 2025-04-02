import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../../api/AuthenticationAPI";
import { updateProfile } from "../../api/UsersAPI";

const Account = () => {
    const { user, checkAuth } = useAuth();
    const navigate = useNavigate();
    
    // State management
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Initialize form data with user data
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || ''
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSave = async () => {
        if (!user) return;
        
        setIsSaving(true);
        setError('');
        
        try {
            // Call API with updated data
            await updateProfile({
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName
            });
            
            setIsEditing(false);
            await checkAuth(); // Refresh user data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            await checkAuth();
            navigate('/');
        } catch (err) {
            setError('Failed to logout. Please try again.');
        }
    };

    const getDisplayValue = (value?: string) => {
        return value ? value : <span className="text-muted">Not provided</span>;
    };

    const hasProfileInfo = user?.firstName || user?.lastName;

    return (
        <div className="section-padding account-section d-flex justify-content-center align-items-center w-100">
            <div className="container">
                <div className="">
                    {/* User Info Column */}
                    <div className="col-lg-6 col-md-12 mb-4">
                        <div className="card bg-light">
                            <div className="card-body">
                                <div className="p-2">
                                    <h3 className="fw-bold">Account</h3>
                                    <hr />

                                    <div className="mb-1">Email</div>
                                    <div className="lead mb-3">{getDisplayValue(user?.email)}</div>

                                    <div className="mb-1">Password</div>
                                    <div className="lead mb-3">********</div>

                                    <div className="mt-3">
                                        <button
                                            className="btn btn-dark btn-lg me-2 grow"
                                            onClick={handleLogout}
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Column */}
                    <div className="col-lg-6 col-md-12">
                        <div className="card bg-light">
                            <div className="card-body">
                                <div className="p-2">
                                    <h3 className="fw-bold">Profile</h3>
                                    <hr />
                                    
                                    <div className="mb-1">First Name</div>
                                    {isEditing ? (
                                        <input
                                            id="firstName"
                                            placeholder="Enter your first name..."
                                            className="form-control mb-3"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <div className="lead mb-3">{getDisplayValue(user?.firstName)}</div>
                                    )}

                                    <div className="mb-1">Last Name</div>
                                    {isEditing ? (
                                        <input
                                            id="lastName"
                                            placeholder="Enter last name..."
                                            className="form-control mb-3"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <div className="lead mb-3">{getDisplayValue(user?.lastName)}</div>
                                    )}

                                    {isEditing ? (
                                        <div>
                                            <button
                                                className="btn btn-primary text-white btn-lg me-2 grow"
                                                onClick={handleSave}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                className="btn btn-dark btn-lg grow"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setError('');
                                                }}
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className={`btn btn-dark btn-lg grow ${hasProfileInfo ? '' : 'btn-primary'}`}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            {hasProfileInfo ? 'Edit Profile' : 'Add Profile'}
                                        </button>
                                    )}

                                    {error && (
                                        <div className="mt-3 text-danger">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;