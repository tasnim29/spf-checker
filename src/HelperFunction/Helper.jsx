export const designedSpfRecord = (record, fetchIncludedSpf) => {
  return record.split(" ").map((part, index) => {
    // include
    if (part.startsWith("include:")) {
      const domain = part.replace("include:", "");
      return (
        <button
          key={index}
          onClick={() => fetchIncludedSpf(domain)}
          className="text-green-500 underline mb-1 block hover:text-green-800 cursor-pointer"
        >
          {part}
        </button>
      );
    }

    // redirect
    if (part.startsWith("redirect=")) {
      return (
        <span key={index} className="text-green-500 font-semibold">
          {part}{" "}
        </span>
      );
    }

    return <span key={index}>{part} </span>;
  });
};
