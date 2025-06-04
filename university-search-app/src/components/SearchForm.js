import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [country, setCountry] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(query, country);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="university-name">University Name:</label>
                <input
                    type="text"
                    id="university-name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Harvard, Stanford"
                />
            </div>
            <div className="form-group">
                <label htmlFor="country">Country:</label>
                <input
                    type="text"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g., United States, Canada"
                />
            </div>
            <button type="submit" className="search-button">
                Search Universities
            </button>
        </form>
    );
};

export default SearchForm;

export function renderSearchForm(onSearch) {
    const formContainer = document.createElement('div');
    formContainer.className = 'search-container';

    const form = document.createElement('form');
    form.className = 'search-form';

    // Name input
    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'University Name:';
    nameLabel.setAttribute('for', 'university-name');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'university-name';
    nameInput.placeholder = 'e.g., Harvard, Stanford';

    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);

    // Country input
    const countryGroup = document.createElement('div');
    countryGroup.className = 'form-group';

    const countryLabel = document.createElement('label');
    countryLabel.textContent = 'Country:';
    countryLabel.setAttribute('for', 'country');

    const countryInput = document.createElement('input');
    countryInput.type = 'text';
    countryInput.id = 'country';
    countryInput.placeholder = 'e.g., United States, Canada';

    countryGroup.appendChild(countryLabel);
    countryGroup.appendChild(countryInput);

    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'search-button';
    submitBtn.textContent = 'Search Universities';

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        onSearch(nameInput.value.trim(), countryInput.value.trim());
    });

    // Assemble the form
    form.appendChild(nameGroup);
    form.appendChild(countryGroup);
    form.appendChild(submitBtn);
    formContainer.appendChild(form);

    return formContainer;
}