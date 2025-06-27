const getDevelopmentApiUrl = () => {
  const host = window.location.hostname;
  const port = 5000; // Backend always runs on port 5000
  return `http://${host}:${port}`;
};

const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://memorymaniaback.onrender.com'
    : getDevelopmentApiUrl()
};

export default config; 