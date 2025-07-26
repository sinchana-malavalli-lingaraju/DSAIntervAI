import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

function CompanySelector({ setQuestion }) {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/companies')
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

    fetch(`http://localhost:3001/question/${company}`)
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          })
        }}
      />
    </div>
  );
}

export default CompanySelector;
