document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const searchForm = document.getElementById('search-form');
    const nameInput = document.getElementById('name');
    const countrySelect = document.getElementById('country');
    const loadingEl = document.getElementById('loading');
    const resultsStatsEl = document.getElementById('results-stats');
    const resultCountEl = document.getElementById('result-count');
    const universityGridEl = document.getElementById('university-grid');
    const universityTableEl = document.getElementById('university-table');
    const tableBodyEl = document.getElementById('table-body');
    const noResultsEl = document.getElementById('no-results');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const tableViewBtn = document.getElementById('table-view-btn');

    // Base API URL
    const API_URL = 'http://universities.hipolabs.com/search';

    // Current view state
    let currentView = 'grid';
    let universities = [];
    let sortConfig = {
        column: 'name',
        direction: 'asc'
    };

    // Event listeners
    searchForm.addEventListener('submit', handleSearch);
    gridViewBtn.addEventListener('click', () => setView('grid'));
    tableViewBtn.addEventListener('click', () => setView('table'));

    // Table header sort listeners
    document.querySelectorAll('th[data-sort]').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            // Toggle direction if clicking same column
            if (sortConfig.column === column) {
                sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
            } else {
                sortConfig.column = column;
                sortConfig.direction = 'asc';
            }
            
            sortUniversities();
            
            // Update sort indicators
            document.querySelectorAll('.sort-icon').forEach(icon => {
                icon.textContent = '↕';
            });
            
            const currentIcon = header.querySelector('.sort-icon');
            currentIcon.textContent = sortConfig.direction === 'asc' ? '↓' : '↑';
            
            updateTableView();
        });
    });

    // Initialize country dropdown
    initCountryDropdown();

    // Initialize country dropdown from API data
    async function initCountryDropdown() {
        try {
            // Get all universities to extract countries
            const response = await fetch(`${API_URL}?name=`);
            if (!response.ok) throw new Error('Failed to fetch university data');
            const data = await response.json();
            
            // Extract unique countries
            const countries = [...new Set(data.map(uni => uni.country))].filter(Boolean).sort();
            
            // Populate dropdown
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error initializing country dropdown:', error);
            // Add a placeholder option if there's an error
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Country list unavailable";
            countrySelect.appendChild(option);
        }
    }

    // Handle search form submission
    async function handleSearch(e) {
        e.preventDefault();
        
        // Get search terms
        const name = nameInput.value.trim();
        const country = countrySelect.value.trim();
        
        // Show loading state
        showLoading();
        
        try {
            // Fetch results from API
            universities = await searchUniversities(name, country);
            
            // Display results
            displayResults(universities);
        } catch (error) {
            console.error('Error searching universities:', error);
            universities = [];
            universityGridEl.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-red-600">Error loading universities. Please try again later.</p>
                </div>
            `;
            tableBodyEl.innerHTML = '';
        } finally {
            hideLoading();
        }
    }

    // Search universities API function
    async function searchUniversities(name = '', country = '') {
        // Build query parameters
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (country) params.append('country', country);
        
        // Make API request
        const url = `${API_URL}?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    // Display results function
    function displayResults(universities) {
        // Update stats
        resultCountEl.textContent = universities.length;
        
        // Show/hide elements based on results
        if (universities.length === 0) {
            resultsStatsEl.classList.add('hidden');
            noResultsEl.classList.remove('hidden');
            universityGridEl.innerHTML = '';
            tableBodyEl.innerHTML = '';
        } else {
            resultsStatsEl.classList.remove('hidden');
            noResultsEl.classList.add('hidden');
            
            // Sort universities
            sortUniversities();
            
            // Update view based on current selection
            updateCurrentView();
        }
    }

    // Sort universities based on current sort configuration
    function sortUniversities() {
        universities.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortConfig.column) {
                case 'name':
                    valueA = a.name || '';
                    valueB = b.name || '';
                    break;
                case 'country':
                    valueA = a.country || '';
                    valueB = b.country || '';
                    break;
                case 'domain':
                    valueA = (a.domains && a.domains[0]) || '';
                    valueB = (b.domains && b.domains[0]) || '';
                    break;
                default:
                    valueA = a.name || '';
                    valueB = b.name || '';
            }
            
            // String comparison
            if (sortConfig.direction === 'asc') {
                return valueA.localeCompare(valueB);
            } else {
                return valueB.localeCompare(valueA);
            }
        });
    }

    // Update view based on current selection
    function updateCurrentView() {
        if (currentView === 'grid') {
            updateGridView();
        } else {
            updateTableView();
        }
    }

    // Set view (grid or table)
    function setView(view) {
        if (view === currentView) return;
        
        currentView = view;
        
        if (view === 'grid') {
            gridViewBtn.classList.remove('bg-gray-200', 'text-gray-700');
            gridViewBtn.classList.add('bg-blue-600', 'text-white');
            tableViewBtn.classList.remove('bg-blue-600', 'text-white');
            tableViewBtn.classList.add('bg-gray-200', 'text-gray-700');
            
            universityGridEl.classList.remove('hidden');
            universityTableEl.classList.add('hidden');
            
            updateGridView();
        } else {
            tableViewBtn.classList.remove('bg-gray-200', 'text-gray-700');
            tableViewBtn.classList.add('bg-blue-600', 'text-white');
            gridViewBtn.classList.remove('bg-blue-600', 'text-white');
            gridViewBtn.classList.add('bg-gray-200', 'text-gray-700');
            
            universityGridEl.classList.add('hidden');
            universityTableEl.classList.remove('hidden');
            
            updateTableView();
        }
    }

    // Update grid view
    function updateGridView() {
        universityGridEl.innerHTML = '';
        
        universities.forEach(university => {
            const card = createUniversityCard(university);
            universityGridEl.appendChild(card);
        });
    }

    // Update table view
    function updateTableView() {
        tableBodyEl.innerHTML = '';
        
        universities.forEach(university => {
            const row = createTableRow(university);
            tableBodyEl.appendChild(row);
        });
    }

    // Create university card element for grid view
    function createUniversityCard(university) {
        const cardEl = document.createElement('div');
        cardEl.className = 'bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition';
        
        // Format website URL for display
        const websiteUrl = university.web_pages && university.web_pages[0] ? university.web_pages[0] : '#';
        const displayUrl = websiteUrl.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
        
        cardEl.innerHTML = `
            <h3 class="text-xl font-semibold text-blue-600 mb-2">${university.name}</h3>
            <div class="text-gray-700 mb-2">
                <span class="font-medium">Country:</span> ${university.country || 'N/A'}
            </div>
            ${university.domains && university.domains.length > 0 ? `
                <div class="text-gray-600 text-sm mb-4">
                    <span class="font-medium">Domain:</span> ${university.domains[0]}
                </div>
            ` : ''}
            <a href="${websiteUrl}" target="_blank" rel="noopener noreferrer" 
               class="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-100 transition">
                Visit Website
            </a>
        `;
        
        return cardEl;
    }
    
    // Create table row for table view
    function createTableRow(university) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition';
        
        // Format website URL
        const websiteUrl = university.web_pages && university.web_pages[0] ? university.web_pages[0] : '#';
        
        row.innerHTML = `
            <td class="py-3 px-4 border-b">${university.name}</td>
            <td class="py-3 px-4 border-b">${university.country || 'N/A'}</td>
            <td class="py-3 px-4 border-b">${university.domains && university.domains.length > 0 ? university.domains[0] : 'N/A'}</td>
            <td class="py-3 px-4 border-b">
                <a href="${websiteUrl}" target="_blank" rel="noopener noreferrer" 
                   class="text-blue-600 hover:text-blue-800 hover:underline">
                    ${websiteUrl !== '#' ? 'Visit Website' : 'N/A'}
                </a>
            </td>
        `;
        
        return row;
    }

    // UI Helper functions
    function showLoading() {
        loadingEl.classList.remove('hidden');
        resultsStatsEl.classList.add('hidden');
        noResultsEl.classList.add('hidden');
    }
    
    function hideLoading() {
        loadingEl.classList.add('hidden');
    }
});