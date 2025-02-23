const Spinner = () => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 via-blue-500 to-blue-800">
    <div className="relative">
      <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
      <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
    </div>
  </div>
);

export default Spinner;