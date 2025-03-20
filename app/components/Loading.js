'use client';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-100 bg-opacity-50 z-50">
      <div className="text-white text-3xl font-semibold">
        Loading...
      </div>
    </div>
  );
};

export default Loading;
