const getDevelopmentApiUrl = () => {
  const host = window.location.hostname;
  return `http://${host}:5000`;
};

const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://memorymania-kc51.onrender.com'
    : getDevelopmentApiUrl()
};

export default config; 