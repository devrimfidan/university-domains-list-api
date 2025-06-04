import React, { useState, useEffect } from 'react';
import { searchUniversities } from '../api/universityService.js';
import { renderSearchForm } from './SearchForm.js';
import { renderUniversityList } from './UniversityList.js';

export function initApp() {
  const app = document.getElementById('root');
  
  // Create app container
  const appContainer = document.createElement('div');
  appContainer.className = 'app-container';
  
  // Create header
  const header = document.createElement('header');
  header.className = 'app-header';
  
  const title = document.createElement('h1');
  title.textContent = 'University Search';
  header.appendChild(title);
  
  // Create main content area
  const main = document.createElement('main');
  main.className = 'app-main';
  
  // Initial state
  let universities = [];
  
  // Render search form with callback for search submit
  const searchForm = renderSearchForm(async (name, country) => {
    try {
      const results = await searchUniversities(name, country);
      universities = results;
      updateResults();
    } catch (error) {
      console.error('Search failed:', error);
    }
  });
  
  // Create results container
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'results-container';
  
  // Function to update results display
  const updateResults = () => {
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(renderUniversityList(universities));
  };
  
  // Assemble the DOM
  main.appendChild(searchForm);
  main.appendChild(resultsContainer);
  
  appContainer.appendChild(header);
  appContainer.appendChild(main);
  app.appendChild(appContainer);
}