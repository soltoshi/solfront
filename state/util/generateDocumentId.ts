const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";

const generateDocumentId = (prefix: String) => {
  const randomArray = Array.from(
    {length: 20},
    (v, k) => chars[Math.floor(Math.random() * chars.length)],
  );

  const generatedId = prefix + '_' + randomArray.join("");

  return generatedId;
};

export default generateDocumentId;
