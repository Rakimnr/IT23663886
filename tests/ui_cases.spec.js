import { test, expect } from '@playwright/test';

function cleanText(s) {
  return (s ?? '')
    .replace(/\u00A0/g, ' ')
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[.?!,;:"'`“”‘’(){}\[\]<>|/\\—–-]|[।]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function expectSinhalaContains(page, expectedSinhala) {
  const expected = cleanText(expectedSinhala);

  await expect
    .poll(
      async () => cleanText(await page.locator('body').innerText()),
      { timeout: 20000 }
    )
    .toContain(expected);
}

async function expectSinhalaNotPresent(page, text) {
  const expected = cleanText(text);

  await expect
    .poll(
      async () => cleanText(await page.locator('body').innerText()),
      { timeout: 20000 }
    )
    .not.toContain(expected);
}

test.describe('UI Tests – SwiftTranslator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/', { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
  });

  test('Pos_UI_0001 - Verify input clear resets output field', async ({ page }) => {
    const input = page.locator('textarea');

    await input.fill('mama gedhara aavaa');
    await expectSinhalaContains(page, 'මම ගෙදර ආවා');

    await input.fill('');
    await expect(input).toHaveValue('');

    await expectSinhalaNotPresent(page, 'මම ගෙදර ආවා');
  });
});
