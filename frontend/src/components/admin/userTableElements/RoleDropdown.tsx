import { useState, useEffect, useRef } from "react";

const RoleDropdown = ({ currentRole, onRoleChange }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(currentRole);
    const [error, setError] = useState<string | null>(null);

    const [confirm, setConfrim] = useState(false);


    const dropdownRef = useRef<HTMLDivElement>(null);
  
    const roles = ['Super Admin', 'Admin', 'User'];
  
    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRoleChange = async (role: string) => {
        setError(null)
        setSelectedRole(role)
        setIsOpen(false);
        if (role === selectedRole) {
            return;
        }
        
        setIsLoading(true);
        try {
            await onRoleChange(role);
            setSelectedRole(role);
        } catch (error) {
            setSelectedRole(currentRole);
            //setError("Error assigning role")
            console.error('Role update failed:', error);
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };
  
    return (
        <div>

        <div className="dropdown" ref={dropdownRef} style={{ display: 'inline-block' }}>
            <button
                className="btn btn-primary text-white btn dropdown-toggle"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {selectedRole}
                    </>
                ) : (
                    selectedRole
                )}
            </button>
            
            <div className={`dropdown-menu mt-1 ${isOpen ? 'show' : ''}`} >
                {roles.map((role) => (
                    <button
                        key={role}
                        className={`dropdown-item d-flex justify-content-between align-items-center py-2 ${
                            selectedRole === role ? 'active' : ''
                        }`}
                        onClick={() => handleRoleChange(role)}
                        disabled={isLoading}
                    >
                        {role}
                        {selectedRole === role && (
                            <span className="ms-2">✓</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    </div>
    );
};

export default RoleDropdown;