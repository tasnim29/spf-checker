import React, { useState } from "react";

const Form = () => {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [spfRecords, setSpfRecords] = useState([]);

  // check domain is valid or not
  const isValidDomain = (domain) => {
    const domainRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
    return domainRegex.test(domain);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSpfRecords([]);

    const trimmedDomain = domain.trim();

    if (!isValidDomain(trimmedDomain)) {
      setError("Invalid domain format");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://dns.google/resolve?name=${trimmedDomain}&type=TXT`
      );

      const data = await response.json();
      const answer = data.Answer;

      console.log(data);

      if (data.Status !== 0 || !data.Answer) {
        setError(" Domain not found");
        return;
      }

      //Extract TXT records

      const txtRecords = answer
        .filter((record) => record.type === 16)
        .map((record) => record.data.replace(/"/g, ""));

      const spf = txtRecords.filter((txt) =>
        txt.toLowerCase().startsWith("v=spf1")
      );

      if (spf.length === 0) {
        setError(" No SPF record found for this domain");
        return;
      }

      setSpfRecords(spf);
    } catch (error) {
      setError("Failed to fetch DNS records");
      console.log(error);
    } finally {
      setLoading(false);
    }
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

      {/* Loading  */}
      {loading && <p>Loading...</p>}

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* result */}

      {spfRecords.length > 0 && (
        <div>
          <h1>SPF Records:</h1>
          <ul className="space-y-3">
            {spfRecords.map((record, index) => (
              <li key={index}>{record}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Form;
