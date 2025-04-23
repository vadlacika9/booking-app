export default async function getCategories() {
  try {
    const response = await fetch(`http://localhost:3000/api/get-categories`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Cannot get categories');
    }
    
    return response.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}