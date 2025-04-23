'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef, Suspense } from 'react';
import Loading from '@/components/Loading';

const UpdateService = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notAllowed, setNotAllowed] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const inputFileRef = useRef(null);
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const getService = await fetch(`/api/services/${id}`);
        if (!getService.ok) {
          throw new Error('Cannot get service details!');
        }
        const data = await getService.json();
        setService(data);

        if (data && data.images) {
          setExistingImages(data.images.map(image => ({ 
            path: image.path,
            id: image.id || Math.random().toString(36).substring(2, 9) // Generate temp ID if none exists
          })));
        }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setFilePreview(filePreviews);
  };

  const handleRemoveExistingImage = async (index, path) => {
    try{
      const deletePicture = await fetch("/api/remove-picture",{
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({path})
      })

      setExistingImages(current => current.filter((_, idx) => idx !== index));
      
    }catch(error){
      console.log(error)
      setError(error)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    
    try {
      // Upload new images if any are selected
      const newUploadedUrls = [];

      for (const file of selectedFiles) {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
          setError("❌ Invalid file type.");
          setSubmitting(false);
          return;
        }

        const res = await fetch(`/api/upload?filename=${file.name}`, {
          method: 'POST',
          body: file,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        newUploadedUrls.push({
          path: data.url,
          id: Math.random().toString(36).substring(2, 9) // Generate temp ID
        });
      }

      // Combine existing images with new uploads
      const combinedImages = [...existingImages, ...newUploadedUrls].map(img => img.path);
      
      // Create updated service data with combined images
      const updatedService = { 
        ...service, 
        images: combinedImages 
      };
  
      const response = await fetch(`/api/update-services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedService),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update service.");
      }
      
      setSuccess("Service updated successfully!");
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push(`/services/${id}`);
      }, 1500);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) return <Loading />;

  if (notAllowed) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-100 p-3 rounded-full inline-flex mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Access Denied</h2>
            <p className="text-gray-600 mb-6">You don&apos;t have permission to edit this service.</p>
            <button 
              onClick={() => router.push('/services')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition w-full"
            >
              Return to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Update Service</h2>
        
        {/* Status messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        {service && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="mb-8 p-6 border border-indigo-100 rounded-xl bg-indigo-50">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Service Images</h3>
              
              {/* Current/Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {existingImages.map((image, idx) => (
                      <div key={`existing-${image.id}`} className="relative group">
                        <img
                          src={image.path}
                          alt={`Service image ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(idx, image.path)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Upload New Images */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-full sm:w-64 h-48 mb-4 sm:mb-0 border-2 border-dashed border-indigo-200 rounded-lg overflow-hidden cursor-pointer" onClick={() => inputFileRef.current.click()}>
                  {filePreview.length > 0 ? (
                    <div className="py-2 grid grid-cols-2 gap-4 p-2">
                      {filePreview.map((preview, idx) => (
                        <img
                          key={idx}
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="max-h-40 mx-auto rounded-lg"
                        />
                      ))}
                      <p className="text-sm col-span-2 text-center text-indigo-600">Click to change images</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg className="w-12 h-12 text-indigo-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="font-medium text-indigo-600">Click to upload image</p>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG, GIF or WEBP</p>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images</label>
                  <input
                    name="images"
                    type="file"
                    multiple
                    ref={inputFileRef}
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedFiles.length > 0 
                      ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
                      : 'Upload high-quality images (JPG, PNG, GIF, WEBP)'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <input
                    type="text"
                    name="service_name"
                    value={service.service_name || ""}
                    onChange={handleChange}
                    placeholder="Service name"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="service_price"
                    value={service.service_price || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Time Slots */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Days</label>
                  <select
                    name="days_available"
                    value={service.days_available || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select availability</option>
                    <option value="Weekdays only">Weekdays only</option>
                    <option value="Every day">Every day</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      name="duration_start_time"
                      value={service.duration_start_time || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      name="duration_end_time"
                      value={service.duration_end_time || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="service_description"
                value={service.service_description || ""}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Describe your service"
              />
            </div>
            

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push(`/services/${id}`)}
                className="sm:w-1/3 bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={submitting}
                className={`sm:w-2/3 p-3 rounded-lg text-white flex items-center justify-center ${
                  submitting 
                    ? "bg-indigo-400 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700"
                } transition shadow-sm hover:shadow`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Update Service
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const UpdateServicePage = () => (
  <Suspense fallback={<Loading />}>
    <UpdateService />
  </Suspense>
);

export default UpdateServicePage;