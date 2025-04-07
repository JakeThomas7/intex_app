interface DropdownExampleProps {
    options: any[];
    onChange: (option: number) => void;
    label: string;
    currentValue: any;
}

const DropdownList = ({ options, onChange, label, currentValue}:DropdownExampleProps) => {

  return (
    <ul className="dropdown-menu mt-1 p-2" aria-labelledby={label}>
      {options.map((option) => (
        <li key={option}>
          <button
            className={`dropdown-item ${currentValue === option ? "active" : ""}`}
            onClick={() => onChange(option)}
          >
            {option} per page
            {currentValue === option && (
              <span className="ms-2">
                {/* Add a checkmark icon or emoji */}
                <i className="fa-solid fa-check fa-sm"></i>
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default DropdownList;
