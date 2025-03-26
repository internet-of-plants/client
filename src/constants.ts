export default {
  API_HOST: process.env.NODE_ENV === 'production'
      ? 'https://back.internet-of-plants.org'
      : 'http://localhost:4001'
}
