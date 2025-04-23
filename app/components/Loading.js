'use client';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="spinner border-t-4 border-b-4 border-indigo-500 rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );
};

export default Loading;