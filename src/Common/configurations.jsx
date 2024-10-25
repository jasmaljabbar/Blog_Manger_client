// config.js
export const config = {
  headers: {  // Change header to headers
      "Content-Type": "application/json",
      "Accept": "application/json"
  },
  withCredentials: true,
  credentials: 'include'  // Add this
};

export const configMultiPart = {
  headers: {
      "Content-Type": "multipart/form-data",
      "Accept": "application/json"
  },
  withCredentials: true,
  credentials: 'include'  // Add this
};