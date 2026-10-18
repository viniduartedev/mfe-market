import { expect, test } from '@playwright/test';

test('catálogo → carrinho → checkout → pedido confirmado', async ({ page }, testInfo) => {
  const evidence: string[] = [];
  page.on('console', message => evidence.push(`console ${message.type()}: ${message.text()}`));
  page.on('pageerror', error => evidence.push(`pageerror: ${error.message}`));
  page.on('requestfailed', request => evidence.push(`failed: ${request.url()} ${request.failure()?.errorText}`));
  page.on('response', response => { if (response.url().includes('3003') || response.status() >= 400) evidence.push(`response: ${response.status()} ${response.url()}`); });
  try {
    await page.goto('/');
    await page.getByRole('button', { name: /Adicionar/ }).first().click();
    await expect(page.getByRole('list', { name: 'Produtos no carrinho' }).getByRole('listitem')).toHaveCount(1);
    await page.getByRole('button', { name: /Ir para checkout/ }).click();
    evidence.push(`URL depois do botão: ${page.url()}`);
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByRole('heading', { name: 'Seu pedido' })).toBeVisible();
    await page.getByLabel('Onde devemos entregar?').fill('Rua de Teste, 123');
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();
    await expect(page.getByRole('heading', { name: 'Compra realizada!' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Carrinho 0' })).toBeVisible();
  } finally {
    await testInfo.attach('browser-evidence', { body: evidence.join('\n'), contentType: 'text/plain' });
    console.log(evidence.join('\n'));
  }
});

test('botão da rota /cart navega com as quantidades atualizadas', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Adicionar/ }).first().click();
  await page.getByRole('link', { name: 'Carrinho 1' }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await page.getByRole('button', { name: /Aumentar/ }).click();
  await page.getByRole('button', { name: /Ir para checkout/ }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole('region', { name: 'Checkout', exact: true })).toContainText('2 itens');
  await expect(page.getByRole('complementary', { name: 'Resumo do pedido' })).toContainText('2×');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Seu pedido' })).toBeVisible();
});

test('checkout vazio não permite confirmar pedido', async ({ page }) => {
  await page.goto('/checkout');
  await expect(page.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled();
  await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible();
});
