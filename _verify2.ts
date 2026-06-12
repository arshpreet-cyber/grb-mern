import prisma from "./lib/prisma";
async function main(){
  const created = await prisma.order.create({
    data: {
      orderNumber: `TEST-${Date.now()}`, email: "verify@test.local",
      amount: 75, currency: "USD", symbol: "$", paymentStatus: "1", status: "1", paymentMethod: "4", tokenCode: "v",
      orderDetails: { create: [{ itemName: "Google Reviews", bannerTitle: "Google Reviews", itemId: "2", quantity: 5, amount: 15, productType: "1" }] },
    }, include: { orderDetails: true },
  });
  console.log("CREATE OK — order", created.id, "detail", created.orderDetails.map(d=>d.id).join(","));
  await prisma.orderDetail.deleteMany({ where: { orderId: created.id } });
  await prisma.order.delete({ where: { id: created.id } });
  console.log("cleaned up. Cart create works on current main.");
}
main().then(()=>process.exit(0)).catch(e=>{console.error("FAILED:",e.message);process.exit(1);});
