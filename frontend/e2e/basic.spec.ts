import { test, expect } from '@playwright/test';

test('fluxo principal', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Seu nome').fill('Avaliador');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/clients/);
  await page.getByText('Novo cliente').isVisible();
});
