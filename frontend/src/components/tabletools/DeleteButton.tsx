import { useState } from "react";

interface DeleteButtonProps {
  handleConfirmDelete: () => Promise<void> | void;
}

const DeleteButton = ({ handleConfirmDelete }: DeleteButtonProps) => {
  const [deleteState, setDeleteState] = useState<'idle' | 'confirming' | 'deleting'>('idle');

  const handleDeleteClick = () => {
    setDeleteState('confirming');
  };

  const handleCancelDelete = () => {
    setDeleteState('idle');
  };

  const handleConfirm = async () => {
    setDeleteState('deleting');
    try {
      await handleConfirmDelete();
    } finally {
      setDeleteState('idle');
    }
  };

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
            onClick={handleConfirm}
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
          className="btn btn-outline-light"
          onClick={handleDeleteClick}
          aria-label="Delete"
        >
          <i className="fa-regular fa-trash-can fa-lg text-danger"></i>
        </button>
      );
  }
};

export default DeleteButton;