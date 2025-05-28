const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://memorymania-kc51.onrender.com'
    : 'http://localhost:5000'
};

export default config; 