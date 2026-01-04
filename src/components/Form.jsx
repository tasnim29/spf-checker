import React, { useState } from "react";

const Form = () => {
  const [domain, setDomain] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-6xl px-4 py-10 md:py-16 mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold text-center">
        SPF Checker
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter domain (example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="border border-amber-300"
        />
        <button type="submit" className="px-5 py-1 bg-red-500 text-white">
          Check SPF
        </button>
      </form>
    </div>
  );
};

export default Form;
