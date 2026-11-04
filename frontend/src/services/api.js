
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const transactionAPI = {
  getAll: () => apiRequest("/transactions"),

  getById: (id) => apiRequest(`/transactions/${id}`),

  create: (transaction) =>
    apiRequest("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    }),

  update: (id, transaction) =>
    apiRequest(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transaction),
    }),

  delete: (id) =>
    apiRequest(`/transactions/${id}`, {
      method: "DELETE",
    }),

  uploadCSV: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest("/transactions/upload", {
      method: "POST",
      body: formData,
    });
  },
};
