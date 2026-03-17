// ЗАГЛУШКА: Обработка платежей
// В реальности здесь pre_checkout_query и successful_payment

export async function handlePreCheckout(ctx) {
  await ctx.answerPreCheckoutQuery(true).catch(() => {});
}

export async function handleSuccessfulPayment(ctx) {
  const payment = ctx.message.successful_payment;
  await ctx.reply(
    `✅ Оплата прошла успешно!\n\n` +
    `Товар: ${payment.invoice_payload}\n` +
    `Сумма: ${payment.total_amount} ${payment.currency}\n\n` +
    `Токены начислены на баланс.`
  );
}
