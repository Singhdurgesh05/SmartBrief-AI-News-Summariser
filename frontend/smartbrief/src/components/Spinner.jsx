import React from 'react';
import { Loader } from 'lucide-react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
};

export default Spinner;