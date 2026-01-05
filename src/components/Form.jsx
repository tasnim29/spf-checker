import React, { useState } from "react";
import { designedSpfRecord } from "../HelperFunction/Helper";
import Loader from "./Loader/Loader";

const Form = () => {
  const [expandedIncludes, setExpandedIncludes] = useState({});

  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [spfRecords, setSpfRecords] = useState([]);

  // check domain is valid or not
  const isValidDomain = (domain) => {
    const domainRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
    return domainRegex.test(domain);
  };

  const fetchIncludedSpf = async (includeDomain) => {
    if (expandedIncludes[includeDomain]) return;
    try {
      const res = await fetch(
        `https://dns.google/resolve?name=${includeDomain}&type=TXT`
      );
      const data = await res.json();

      const spf = (data.Answer || [])
        .filter((r) => r.type === 16)
        .map((r) => r.data.replace(/"/g, ""))
        .filter((txt) => txt.toLowerCase().startsWith("v=spf1"));

      setExpandedIncludes((prev) => ({
        ...prev,
        [includeDomain]: spf.length ? spf : ["No SPF found"],
      }));
    } catch {
      setExpandedIncludes((prev) => ({
        ...prev,
        [includeDomain]: ["Failed to load SPF"],
      }));
    }
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
      console.log(spf);
    } catch (error) {
      setError("Failed to fetch DNS records");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl px-4 py-10 md:py-16 mx-auto bg-white border-2 border-gray-300 shadow-md rounded-lg">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
        SPF Checker
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-center gap-4 mb-6 "
      >
        <input
          type="text"
          placeholder="Enter domain "
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-purple-600 cursor-pointer"
        >
          Check SPF
        </button>
      </form>

      {/* Loading */}
      {loading && <Loader />}

      {/* Error */}
      {error && (
        <p className="text-center text-red-500 font-medium ">{error}</p>
      )}

      {/* SPF Records */}
      {spfRecords.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            SPF Records:
          </h2>
          <ul className="space-y-4">
            {spfRecords.map((record, index) => (
              <li
                key={index}
                className="bg-gray-50 p-4 rounded-md shadow-sm border-2 border-gray-200"
              >
                {/* Main SPF record */}
                <div className="font-mono text-gray-800 mb-2">
                  {designedSpfRecord(record, fetchIncludedSpf)}
                </div>

                {/* Expanded includes */}
                {Object.entries(expandedIncludes).map(([domain, records]) => (
                  <div
                    key={domain}
                    className="ml-4 mt-3 pl-4 border-l-2 border-blue-300"
                  >
                    <p className="font-medium text-blue-600 mb-1">
                      Included SPF: {domain}
                    </p>
                    <ul className="space-y-1">
                      {records.map((r, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition"
                        >
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Form;
