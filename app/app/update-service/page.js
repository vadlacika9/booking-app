/*'use client';

import { useSearchParams ,useRouter} from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';


const UpdateService = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notAllowed, setNotAllowed] = useState(false);
  const [error, setError] = useState(null);
  const inputFileRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const getService = await fetch(`/api/services/${id}`);
        if (!getService.ok) {
          throw new Error('Cannot get service!');
        }
        const data = await getService.json();
        setService(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  useEffect(() => {
    if (service && session) {
      if (service.user_id !== session.user.id) {
        setNotAllowed(true);
      }
    }
  }, [service, session]);

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const file = inputFileRef.current.files[0];
      if (!file) throw new Error("No file selected.");

      const responseImage = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!responseImage.ok) throw new Error("Image upload failed.");

      const uploadedImage = await responseImage.json();
      const imageUrl = uploadedImage.url;

      const updatedService = { ...service, images: imageUrl };

      const response = await fetch(`/api/update-services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedService),
      });

      if (!response.ok) throw new Error('Failed to update service');
      router.push(`/services/${id}`)
    } catch (error) {
      setError(error.message);
    }
  };

  return !notAllowed ? (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      {service && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Update Service</h2>

          <div>
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="service_name"
              value={service.service_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700">Description:</label>
            <input
              type="text"
              name="service_description"
              value={service.service_description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700">Price:</label>
            <input
              type="number"
              name="service_price"
              value={service.service_price}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Start Time:</label>
              <input
                type="time"
                name="duration_start_time"
                value={service.duration_start_time}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-700">End Time:</label>
              <input
                type="time"
                name="duration_end_time"
                value={service.duration_end_time}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Location:</label>
            <input
              type="text"
              name="service_location"
              value={service.service_location}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700">Address:</label>
            <input
              type="text"
              name="service_address"
              value={service.service_address}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
  <label className="block text-gray-700">Available days:</label>
  <select
    name="days_available"
    value={service.days_available}
    onChange={handleChange}
    className="w-full p-2 border rounded-lg"
  >
    <option value="Weekdays only">Weekdays only</option>
    <option value="Every day">Every day</option>
  </select>
</div>


          <div>
            <label className="block text-gray-700">Image:</label>
            <input name="images" type="file" ref={inputFileRef} className="w-full p-2 border rounded-lg" />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
            Update
          </button>
        </form>
      )}
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="text-red-500 text-lg font-bold">You dont have permission to edit this service.</div>
    </div>
  );
};

export default UpdateService;
*/

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';

const UpdateService = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notAllowed, setNotAllowed] = useState(false);
  const [error, setError] = useState(null);
  const inputFileRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const getService = await fetch(`/api/services/${id}`);
        if (!getService.ok) {
          throw new Error('Cannot get service!');
        }
        const data = await getService.json();
        setService(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  useEffect(() => {
    if (service && session) {
      if (service.user_id !== session.user.id) {
        setNotAllowed(true);
      }
    }
  }, [service, session]);

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const file = inputFileRef.current.files[0];
      if (!file) throw new Error("No file selected.");

      const responseImage = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!responseImage.ok) throw new Error("Image upload failed.");

      const uploadedImage = await responseImage.json();
      const imageUrl = uploadedImage.url;

      const updatedService = { ...service, images: imageUrl };

      const response = await fetch(`/api/update-services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedService),
      });

      if (!response.ok) throw new Error('Failed to update service');
      router.push(`/services/${id}`);
    } catch (error) {
      setError(error.message);
    }
  };

  return !notAllowed ? (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      {service && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Update Service</h2>

          <div>
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="service_name"
              value={service.service_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700">Description:</label>
            <input
              type="text"
              name="service_description"
              value={service.service_description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700">Price:</label>
            <input
              type="number"
              name="service_price"
              value={service.service_price}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Start Time:</label>
              <input
                type="time"
                name="duration_start_time"
                value={service.duration_start_time}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-700">End Time:</label>
              <input
                type="time"
                name="duration_end_time"
                value={service.duration_end_time}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Location:</label>
            <input
              type="text"
              name="service_location"
              value={service.service_location}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700">Address:</label>
            <input
              type="text"
              name="service_address"
              value={service.service_address}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700">Available days:</label>
            <select
              name="days_available"
              value={service.days_available}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Weekdays only">Weekdays only</option>
              <option value="Every day">Every day</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Image:</label>
            <input
              name="images"
              type="file"
              ref={inputFileRef}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
            Update
          </button>
        </form>
      )}
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="text-red-500 text-lg font-bold">You dont have permission to edit this service.</div>
    </div>
  );
};

const UpdateServicePage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <UpdateService />
  </Suspense>
);

export default UpdateServicePage;