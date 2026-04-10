import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Get existing users or create them
    const users = await prisma.user.findMany();
    let user1Id = users[0]?.id;
    let user2Id = users[1]?.id;

    if (!user1Id) {
      const user1 = await prisma.user.create({
        data: {
          email: 'john@example.com',
          name: 'John Doe',
          password: await bcrypt.hash('password123', 10),
          role: 'USER',
          status: 'active',
        },
      });
      user1Id = user1.id;
      console.log('✅ Created user: John Doe');
    }

    if (!user2Id) {
      const user2 = await prisma.user.create({
        data: {
          email: 'jane@example.com',
          name: 'Jane Smith',
          password: await bcrypt.hash('password123', 10),
          role: 'USER',
          status: 'active',
        },
      });
      user2Id = user2.id;
      console.log('✅ Created user: Jane Smith');
    }

    // Clear and seed orders
    await prisma.order.deleteMany({});

    const orders = [
      {
        orderNumber: '#177150846',
        userId: user1Id,
        amount: 100.0,
        paymentMethod: 'Credit Card',
        status: 'Pending',
        paymentStatus: 'Pending',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        orderNumber: '#177150847',
        userId: user2Id,
        amount: 250.0,
        paymentMethod: 'PayPal',
        status: 'Complete',
        paymentStatus: 'Complete',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        orderNumber: '#177150848',
        userId: user1Id,
        amount: 75.5,
        paymentMethod: 'Credit Card',
        status: 'Complete',
        paymentStatus: 'Complete',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        orderNumber: '#177150849',
        userId: user2Id,
        amount: 320.0,
        paymentMethod: 'Stripe',
        status: 'Pending',
        paymentStatus: 'Pending',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        orderNumber: '#177150850',
        userId: user1Id,
        amount: 149.99,
        paymentMethod: 'Credit Card',
        status: 'Complete',
        paymentStatus: 'Complete',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        orderNumber: '#177150851',
        userId: user2Id,
        amount: 89.99,
        paymentMethod: 'PayPal',
        status: 'Cancelled',
        paymentStatus: 'Failed',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        orderNumber: '#177150852',
        userId: user1Id,
        amount: 199.0,
        paymentMethod: 'Credit Card',
        status: 'Complete',
        paymentStatus: 'Complete',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        orderNumber: '#177150853',
        userId: user2Id,
        amount: 55.5,
        paymentMethod: 'Stripe',
        status: 'Pending',
        paymentStatus: 'Pending',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const order of orders) {
      await prisma.order.create({ data: order });
    }
    console.log('✅ Created 8 fake orders');

    // Clear and seed tickets
    await prisma.ticket.deleteMany({});

    const tickets = [
      {
        ticketId: '#TKT-10956',
        userId: user1Id,
        title: 'Quality issue auto accounts',
        description: 'Issue with automated account generation',
        status: 'Awaiting Reply',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        ticketId: '#TKT-10985',
        userId: user2Id,
        title: 'Review on order no. 177456031',
        description: 'Customer asking about order status',
        status: 'Open',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        ticketId: '#TKT-10944',
        userId: user1Id,
        title: 'All reviews has disappeared',
        description: 'Reviews not showing in dashboard',
        status: 'Closed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        ticketId: '#TKT-10953',
        userId: user2Id,
        title: 'Order Number - 177220728',
        description: 'Payment processing issue',
        status: 'Pending',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        ticketId: '#TKT-10952',
        userId: user1Id,
        title: 'Order Number - 177361288',
        description: 'Refund request for cancelled order',
        status: 'Open',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        ticketId: '#TKT-11001',
        userId: user2Id,
        title: 'Login issues with email',
        description: 'Cannot access account',
        status: 'Awaiting Reply',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const ticket of tickets) {
      await prisma.ticket.create({ data: ticket });
    }
    console.log('✅ Created 6 fake tickets');

    // Clear and seed revenue
    await prisma.revenue.deleteMany({});

    const revenue = [
      {
        month: 'April',
        year: 2026,
        today: 350.0,
        monthly: 3895.0,
        yearly: 55357.0,
        allTime: 1597473.0,
      },
    ];

    for (const rev of revenue) {
      await prisma.revenue.create({ data: rev });
    }
    console.log('✅ Created revenue data');

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
