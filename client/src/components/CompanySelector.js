import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function CompanySelector({ setQuestion }) {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/companies`)
      .then(res => res.json())
      .then(data => {
        const options = data.map(company => ({
          label: company,
          value: company
        }));
        setCompanies(options);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (selectedOption) => {
    const company = selectedOption.value;

    fetch(`${API_URL}/question/${company}`)
      .then(res => res.json())
      .then(data => {
        setQuestion(data);
        localStorage.setItem('leetcodeLink', data.link);
        navigate('/solve');
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <Select
        options={companies}
        onChange={handleChange}
        placeholder="Select a Company"
        menuPlacement="bottom"
        styles={{
          control: (base) => ({
            ...base,
            padding: '8px',
            borderRadius: '12px',
            fontSize: '16px',
            boxShadow: '0 4px 12px var(--shadow-medium)',
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-secondary)',
            '&:hover': {
              borderColor: 'var(--accent-primary)',
            },
            '&:focus': {
              borderColor: 'var(--accent-primary)',
              boxShadow: '0 0 0 3px var(--focus-ring)',
            }
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-secondary)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px var(--shadow-medium)',
            zIndex: 9999,
          }),
          menuList: (base) => ({
            ...base,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '8px',
            maxHeight: '200px',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected 
              ? 'var(--accent-primary)' 
              : state.isFocused 
                ? 'var(--hover-bg)' 
                : 'transparent',
            color: state.isSelected 
              ? 'white' 
              : 'var(--text-secondary)',
            borderRadius: '8px',
            padding: '12px 16px',
            margin: '2px 0',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            '&:hover': {
              backgroundColor: state.isSelected 
                ? 'var(--accent-primary)' 
                : 'var(--hover-bg)',
            }
          }),
          placeholder: (base) => ({
            ...base,
            color: 'var(--text-muted)',
          }),
          singleValue: (base) => ({
            ...base,
            color: 'var(--text-secondary)',
          }),
          input: (base) => ({
            ...base,
            color: 'var(--text-secondary)',
          }),
          indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: 'var(--border-primary)',
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: 'var(--text-secondary)',
            '&:hover': {
              color: 'var(--accent-primary)',
            }
          }),
          clearIndicator: (base) => ({
            ...base,
            color: 'var(--text-secondary)',
            '&:hover': {
              color: 'var(--accent-primary)',
            }
          })
        }}
      />
    </div>
  );
}

export default CompanySelector;
