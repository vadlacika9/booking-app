import getServices from '../../utils/GetServices'
import getCategories from '../../utils/GetCategories'
import ServicesClient from '@/components/ServicesClient';


export default async function Services() {
  const services = await getServices();
  const categories = await getCategories();

  // If needed, handle errors
  if (!services || services.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load services.</p>
      </div>
    );
  }

  return (
    <div className="flex px-4 md:px-8 mt-10 max-w-7xl mx-auto">
      {/* We need a client component wrapper for the filter controls */}
      <ServicesClient initialServices={services} categories={categories} />
    </div>
  );
}