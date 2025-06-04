import { renderUniversityCard } from './UniversityCard.js';

export function renderUniversityList(universities) {
  const listContainer = document.createElement('div');
  listContainer.className = 'university-list';
  
  if (universities.length === 0) {
    const noResults = document.createElement('p');
    noResults.className = 'no-results';
    noResults.textContent = 'No universities found. Try adjusting your search criteria.';
    listContainer.appendChild(noResults);
  } else {
    const resultCount = document.createElement('p');
    resultCount.className = 'result-count';
    resultCount.textContent = `Found ${universities.length} universities`;
    listContainer.appendChild(resultCount);
    
    const list = document.createElement('div');
    list.className = 'university-grid';
    
    universities.forEach(university => {
      list.appendChild(renderUniversityCard(university));
    });
    
    listContainer.appendChild(list);
  }
  
  return listContainer;
}