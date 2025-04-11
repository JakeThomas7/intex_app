import { useEffect, useState } from 'react';
import Select from 'react-select';
import { fetchGenres } from '../../api/MoviesAPI';
import Genre from '../../types/Genre';

// Define the option type explicitly
interface SelectOption {
  value: number; // Assuming genreId is number
  label: string;
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderColor: '#ced4da',
    boxShadow: 'none',
    borderRadius: '18px',
    '&:hover': {
      borderColor: '#aaa',
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#6c757d',
  }),
};

interface MultiSelectProps {
  onChange: (selectedOptions: Genre[]) => void;
  selectedValues: Genre[];
}

const GenreSelect2 = ({ onChange, selectedValues }: MultiSelectProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (error) {
        // console.error('Error fetching genres:', error);
      }
    };
    getGenres();
  }, []);

  // Convert Genre[] to SelectOption[]
  const genreOptions: SelectOption[] = genres.map((genre) => ({
    value: genre.genreId,
    label: genre.genreName,
  }));

  // Convert selectedValues to SelectOption[]
  const selectedOptions = selectedValues.map((genre) => ({
    value: genre.genreId,
    label: genre.genreName,
  }));

  const handleChange = (selected: readonly SelectOption[]) => {
    // Convert back to Genre[]
    const selectedGenres = genres.filter(genre => 
      (selected as SelectOption[]).some(opt => opt.value === genre.genreId)
    );
    onChange(selectedGenres);
  };

  return (
    <div>
      <Select<SelectOption, true>
        options={genreOptions}
        isMulti
        value={selectedOptions}
        onChange={handleChange}
        styles={customStyles}
        placeholder="Select genres..."
      />
    </div>
  );
};

export default GenreSelect2;