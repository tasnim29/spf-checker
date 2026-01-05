import React from "react";
import { TailSpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex flex-col items-center mt-5">
      <TailSpin
        height={50}
        width={50}
        color="blue" // Tailwind blue-500
        ariaLabel="loading"
      />
      <p className="mt-2 text-gray-700">Fetching SPF records...</p>
    </div>
  );
};

export default Loader;
