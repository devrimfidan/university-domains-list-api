export const filterUniversities = (universities, searchTerm) => {
    if (!searchTerm) return universities;
    return universities.filter(university =>
        university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const sortUniversities = (universities, sortBy) => {
    return universities.sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'location') {
            return a.location.localeCompare(b.location);
        }
        return 0;
    });
};