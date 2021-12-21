export default {
  API_HOST: process.env.NODE_ENV === 'production'
    ? 'https://iop-monitor-server.tk:4001'
    : 'http://localhost:4001',
};
/* export default {
  API_HOST: process.env.NODE_ENV !== 'production'
    ? 'https://iop-monitor-server.tk:4001'
    : 'http://localhost:4001',
}; */
