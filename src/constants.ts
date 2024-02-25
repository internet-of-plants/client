export default {
  API_HOST:
    true || process.env.NODE_ENV === 'production'
      ? 'https://api.internet-of-plants.org:4001'
      : 'http://localhost:4001'
}
