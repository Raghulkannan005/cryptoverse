import { FaSpinner } from 'react-icons/fa';

const Spinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <FaSpinner className="animate-spin text-4xl text-blue-500" />
  </div>
);

export default Spinner;