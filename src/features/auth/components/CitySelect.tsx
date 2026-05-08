import { useState, useMemo, useRef, useEffect } from 'react';
import Select, { type GroupBase, type SelectInstance } from 'react-select';
import { getCities } from '../api/citiesApi';
import './CitySelect.css';

interface CityOption {
  value: number;
  label: string;
}

interface CitySelectProps {
  value: number | null;
  onChange: (cityId: number | null) => void;
  disabled?: boolean;
}

export function CitySelect({ value, onChange, disabled }: CitySelectProps) {
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCityLabel, setSelectedCityLabel] = useState<string | null>(null);
  const selectRef = useRef<SelectInstance<CityOption, false, GroupBase<CityOption>> | null>(null);
  const fieldsContainerRef = useRef<HTMLElement | null>(null);

  const selectedOption = useMemo(() => {
    if (!value) return null;
    const found = options.find((option) => option.value === value);
    return found || (selectedCityLabel ? { value, label: selectedCityLabel } : null);
  }, [options, value, selectedCityLabel]);

  const loadOptions = async (search: string = '', isLoadMore: boolean = false) => {
    setLoading(true);
    try {
      const currentPage = isLoadMore ? page + 1 : 1;
      const response = await getCities(currentPage, 10, search);

      const newOptions: CityOption[] = response.cities.map((city) => ({
        value: city.id,
        label: city.name,
      }));

      if (isLoadMore) {
        setOptions((prev) => [...prev, ...newOptions]);
        setPage(currentPage);
      } else {
        setOptions(newOptions);
        setPage(1);
      }

      setHasMore(response.cities.length === 10 && currentPage * 10 < response.total);
    } catch (error) {
      console.error('Failed to load cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (inputValue: string) => {
    setSearchInput(inputValue);
    if (inputValue.length >= 2) {
      loadOptions(inputValue);
    } else {
      setOptions([]);
      setPage(1);
      setHasMore(true);
    }
  };

  const handleMenuScrollToBottom = () => {
    if (!loading && hasMore) {
      loadOptions('', true);
    }
  };

  const handleChange = (option: CityOption | null) => {
    if (option) {
      setSelectedCityLabel(option.label);
      onChange(option.value);
    } else {
      setSelectedCityLabel(null);
      onChange(null);
    }
  };

  // Set up scroll listener to close menu when fields are scrolled
  useEffect(() => {
    const fieldsElement = document.querySelector('.auth-form__fields') as HTMLElement | null;
    fieldsContainerRef.current = fieldsElement;

    const handleScroll = () => {
      if (menuIsOpen && selectRef.current) {
        selectRef.current.blur();
        setMenuIsOpen(false);
      }
    };

    if (fieldsElement) {
      fieldsElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (fieldsElement) {
        fieldsElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [menuIsOpen]);

  return (
    <div className="auth-form__field">
      <label htmlFor="city-select" className="auth-form__label">
        City
      </label>
      <Select
        ref={selectRef}
        id="city-select"
        value={selectedOption}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        onMenuScrollToBottom={handleMenuScrollToBottom}
        options={options}
        isLoading={loading}
        isDisabled={disabled}
        placeholder="Search for a city..."
        noOptionsMessage={() => (searchInput.length < 2 ? 'Start typing...' : 'No results')}
        className="city-select"
        classNamePrefix="city-select"
        menuPlacement="top"
        components={{
          IndicatorSeparator: () => null,
        }}
        menuPortalTarget={document.body}
      />
    </div>
  );
}
