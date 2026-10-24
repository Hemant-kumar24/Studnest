
const pickText = (value) =>
  typeof value === "string" && value.trim()
    ? value.trim()
    : null;

// ==========================================
// GET API ERROR MESSAGE
// Supports { message }, { msg }, and { error }
// ==========================================

export const getApiErrorMessage = (error) => {
  const data = error?.response?.data;

  return (
    pickText(data?.message) ||
    pickText(data?.msg) ||
    pickText(data?.error) ||
    pickText(error?.message) ||
    "Something went wrong. Please try again."
  );
};
