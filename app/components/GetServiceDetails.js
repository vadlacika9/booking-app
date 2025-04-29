export default async function getServiceDetails(id) {
  console.log(id)
  try {
    const response = await fetch(`http://localhost:3000/api/services/${id}`, {
      cache: 'no-store' // For dynamic data
    });
    
    if (!response.ok) {
      throw new Error('Cannot get service!');
    }
    
    return response.json();
  } catch (error) {
    console.error("Failed to fetch service details:", error);
    return null;
  }
}