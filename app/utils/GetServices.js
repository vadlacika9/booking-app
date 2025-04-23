export default async function getServices() {
  try {
    const response = await fetch(`http://localhost:3000/api/services`, {
      cache: 'no-store' // For dynamic data, alternatively use { next: { revalidate: 60 } }
    });
    
    if (!response.ok) {
      throw new Error('Cannot get services!');
    }
    
    return response.json();
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}