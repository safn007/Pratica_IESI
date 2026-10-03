export default {
  server: { proxy: {
    '/produtos': 'http://127.0.0.1:3000',
    '/estoque': 'http://127.0.0.1:3000'
  } }
};
