import prisma from '../lib/prisma';

async function main() {
  const statuses = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
  });
  console.log('Status counts:', statuses);

  const paymentStatuses = await prisma.order.groupBy({
    by: ['paymentStatus'],
    _count: true,
  });
  console.log('Payment status counts:', paymentStatuses);
}

main();
