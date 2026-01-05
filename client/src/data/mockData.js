export const DOC_TYPES = [
  "aadhaar",
  "pan",
  "education",
  "experience",
  "addressProof",
];

export const initialCandidate = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  documents: DOC_TYPES.reduce((acc, d) => {
    acc[d] = { status: "pending", comments: [] };
    return acc;
  }, {}),
};
