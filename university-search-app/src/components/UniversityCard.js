import React from 'react';
import PropTypes from 'prop-types';
import './components.css';

const UniversityCard = ({ university }) => {
    return (
        <div className="university-card">
            <h2 className="university-name">{university.name}</h2>
            <p className="university-country">Location: {university.country}</p>
            <p className="university-domains">Web domains: {university.domains.join(', ')}</p>
            <a className="university-website" href={university.web_pages[0]} target="_blank" rel="noopener noreferrer">Visit Website</a>
        </div>
    );
};

UniversityCard.propTypes = {
    university: PropTypes.shape({
        name: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
        domains: PropTypes.arrayOf(PropTypes.string).isRequired,
        web_pages: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};

export function renderUniversityCard(university) {
  const card = document.createElement('div');
  card.className = 'university-card';
  
  const name = document.createElement('h2');
  name.className = 'university-name';
  name.textContent = university.name;
  
  const country = document.createElement('p');
  country.className = 'university-country';
  country.textContent = university.country;
  
  const domains = document.createElement('p');
  domains.className = 'university-domains';
  domains.textContent = `Web domains: ${university.domains.join(', ')}`;
  
  const websiteLink = document.createElement('a');
  websiteLink.className = 'university-website';
  websiteLink.href = university.web_pages[0];
  websiteLink.textContent = 'Visit Website';
  websiteLink.target = '_blank';
  websiteLink.rel = 'noopener noreferrer';
  
  // Assemble the card
  card.appendChild(name);
  card.appendChild(country);
  card.appendChild(domains);
  card.appendChild(websiteLink);
  
  return card;
}

export default UniversityCard;