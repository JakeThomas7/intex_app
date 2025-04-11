import RoleDropdown from './RoleDropdown';
import { assignRole, deleteUser } from '../../../api/UsersAPI';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserTableRow = ({ user, onUserDeleted }: { user: any; onUserDeleted: () => void }) => {
  const [deleteState, setDeleteState] = useState<
    'idle' | 'confirming' | 'deleting'
  >('idle');

  const { user: CurrentUser } = useAuth();
  const updateRoleOnServer = async (newRole: string) => {
    await assignRole(user.email, newRole);
  };

  const handleDeleteClick = () => {
    setDeleteState('confirming');
  };

  const handleCancelDelete = () => {
    setDeleteState('idle');
  };

  const handleConfirmDelete = async () => {
    setDeleteState('deleting');
    try {
      await deleteUser(user.email);
      onUserDeleted();
    } catch (error) {
      // console.error('Delete failed:', error);
      setDeleteState('idle');
    }
  };

  // Render delete button based on user role and state
  const renderDeleteButton = () => {

    switch (deleteState) {
      case 'confirming':
        return (
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-outline-light me-2" 
              onClick={handleCancelDelete}
              aria-label="Cancel delete"
            >
              <i className="fa-solid fa-xmark text-dark"></i>
            </button>
            <button 
              className="btn btn-danger" 
              onClick={handleConfirmDelete}
              aria-label="Confirm deletion"
            >
              Delete
            </button>
          </div>
        );
      case 'deleting':
        return (
          <button className="btn btn-danger" disabled>
            <span 
              className="spinner-border spinner-border-sm me-2" 
              role="status" 
              aria-hidden="true"
            ></span>
            Deleting
          </button>
        );
      default:
        return (
          <button 
            className={`btn btn-outline-light ${CurrentUser?.role !== 'Super Admin' ? 'disabled' : ''}`}
            onClick={handleDeleteClick}
            aria-label="Delete user"
          >
            <i className="fa-regular fa-trash-can fa-lg text-danger"></i>
          </button>
        );
    }
  };

  return (
    <tr key={user.email}>
      <td>
        <div className="me-4">
          <div>
            <h3 className="lead">
              {user.firstName} {user.lastName}
            </h3>
          </div>
          <h5>{user.email}</h5>
        </div>
      </td>
      <td>
          <RoleDropdown 
            currentRole={user.role} 
            onRoleChange={updateRoleOnServer} 
          />
      </td>
      <td>
        {renderDeleteButton()}
      </td>
    </tr>
  );
};

export default UserTableRow;