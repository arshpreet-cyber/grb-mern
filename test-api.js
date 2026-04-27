import fetch from 'node-fetch';

async function testTicketAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'test-user',
        subject: 'Test Ticket',
        query: 'This is a test ticket',
        name: 'Test User',
        email: 'test@example.com'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testTicketAPI();