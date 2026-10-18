import { expect, test } from '@playwright/test';

test('emojis dos produtos não são requisitados como imagens, inclusive após recarregar', async ({ page }) => {
  const imageRequests: string[] = [];
  page.on('request', request => { if (request.resourceType() === 'image') imageRequests.push(request.url()); });
  await page.goto('/');
  const addButtons = page.getByRole('button', { name: /Adicionar/ });
  await expect(addButtons).toHaveCount(6);
  for (const button of await addButtons.all()) await button.click();
  await expect(page.getByRole('list', { name: 'Produtos no carrinho' }).getByRole('listitem')).toHaveCount(6);
  await expect(page.locator('.market-cart__image').filter({ hasText: '🍅' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('list', { name: 'Produtos no carrinho' }).getByRole('listitem')).toHaveCount(6);
  await expect(page.locator('.market-cart__image').filter({ hasText: '🍅' })).toBeVisible();
  expect(imageRequests).toEqual([]);
});

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
    await page.route('https://brasilapi.com.br/api/cep/v1/*', route => route.fulfill({ json: { street: 'Praça da Sé', neighborhood: 'Sé', city: 'São Paulo', state: 'SP' } }));
    await page.getByLabel('CEP', { exact: true }).fill('01001000');
    await expect(page.getByLabel('Rua ou avenida')).toHaveValue('Praça da Sé');
    await page.getByLabel('Número', { exact: true }).fill('123');
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();
    await expect(page.getByRole('heading', { name: 'Compra realizada!' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Carrinho 0' })).toBeVisible();
  } finally {
    await testInfo.attach('browser-evidence', { body: evidence.join('\n'), contentType: 'text/plain' });
    console.log(evidence.join('\n'));
  }
});

test('consulta indisponível permite preenchimento manual no mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.route('https://brasilapi.com.br/api/cep/v1/*', route => route.fulfill({ status: 404, json: { message: 'CEP não encontrado' } }));
  await page.goto('/checkout');
  await page.getByLabel('CEP', { exact: true }).fill('99999999');
  await expect(page.getByRole('status')).toContainText('CEP não encontrado');
  await page.getByLabel('Rua ou avenida').fill('Rua manual');
  await expect(page.getByLabel('Rua ou avenida')).toHaveValue('Rua manual');
  for (const path of ['/', '/cart', '/checkout']) {
    await page.goto(path);
    if (path === '/') {
      await page.getByRole('button', { name: /Adicionar/ }).first().click();
      await expect(page.getByRole('list', { name: 'Produtos no carrinho' })).toBeVisible();
    } else if (path === '/cart') await expect(page.getByRole('button', { name: /Ir para checkout/ })).toBeVisible();
    else await expect(page.getByLabel('Rua ou avenida')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
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
