/**
 * Service for fetching university data from the API
 */
export async function searchUniversities(name = "", country = "") {
  let url = "http://universities.hipolabs.com/search";
  
  // Add query parameters if provided
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (country) params.append("country", country);
  
  // Append params to URL if any exist
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
}