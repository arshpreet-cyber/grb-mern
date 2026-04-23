import fetch from 'node-fetch';

(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/auth/session');
    console.log('status', res.status);
    const text = await res.text();
    console.log('bodyStart', text.slice(0, 500));
  } catch (err) {
    console.error('error', err.message);
  }
})();