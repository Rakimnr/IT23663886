import { test, expect } from '@playwright/test';

// Normalize text so tiny differences (punctuation, extra spaces, ZWJ/NBSP) won’t fail the test
function cleanText(s) {
  return (s ?? '')
    .replace(/\u00A0/g, ' ') // NBSP -> normal space
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width chars (ZWS/ZWNJ/ZWJ/BOM)
    // ignore common punctuation differences (English + Sinhala danda)
    .replace(/[.?!,;:"'`“”‘’(){}\[\]<>|/\\—–-]|[।]/g, '')
    .replace(/\s+/g, ' ') // collapse multiple spaces/newlines/tabs
    .trim();
}

async function expectSinhalaContains(page, expectedSinhala) {
  const expected = cleanText(expectedSinhala);

  await expect
    .poll(
      async () => {
        const bodyText = await page.locator('body').innerText();
        return cleanText(bodyText);
      },
      { timeout: 20000 }
    )
    .toContain(expected);
}

test.describe('Negative Functional Tests – Singlish to Sinhala (Neg_Fun_0001–Neg_Fun_0010)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/', { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
  });

  test('Neg_Fun_0001 - Case-sensitive Singlish breaks', async ({ page }) => {
    await page.fill('textarea', 'api iilaga sathiyee yamu.');
    await expectSinhalaContains(page, 'අපි ඊළඟ සතියේ යමු.');
  });

  test('Neg_Fun_0002 - Joined words reduce readability', async ({ page }) => {
    await page.fill('textarea', 'matapaankannaoonee');
    await expectSinhalaContains(page, 'මට පාන් කන්න ඕනේ');
  });

  test('Neg_Fun_0003 - Wrong meaning for "math" (should become "මාත්")', async ({ page }) => {
    await page.fill('textarea', 'math ekka yanna.');
    await expectSinhalaContains(page, 'මාත් එක්ක යන්න.');
  });

  test('Neg_Fun_0004 - Typo letters cause incorrect conversion', async ({ page }) => {
    await page.fill('textarea', 'mmoaa vaedaa karnva');
    await expectSinhalaContains(page, 'මම වැඩ කරනවා');
  });

  test('Neg_Fun_0005 - Missing correct Singlish combo causes wrong "ළ"', async ({ page }) => {
    await page.fill('textarea', 'mata podi udhavvak karanna puluvandha?');
    await expectSinhalaContains(page, 'මට පොඩි උදව්වක් කරන්න පුළුවන්ද?');
  });

  test('Neg_Fun_0006 - Place suffix typo causes wrong conversion', async ({ page }) => {
    await page.fill('textarea', 'api gallea yamu.');
    await expectSinhalaContains(page, 'අපි ගාල්ලේ යමු.');
  });

  test('Neg_Fun_0007 - Special symbol breaks expected output', async ({ page }) => {
    await page.fill('textarea', 'mama @ gedhara innee.');
    await expectSinhalaContains(page, 'මම ගෙදර ඉන්නේ.');
  });

  test('Neg_Fun_0008 - Multi-line slang question not fully converted', async ({ page }) => {
    await page.fill('textarea', 'ado machan uba campus giya ned?\nkawadda awe?');
    await expectSinhalaContains(page, 'අඩෝ මචං උබ කැම්පස් ගියා නේද? කවද්ද ආවේ?');
  });

  test('Neg_Fun_0009 - Excess punctuation prevents conversion', async ({ page }) => {
    await page.fill('textarea', 'oyaa ude giya da???');
    await expectSinhalaContains(page, 'ඔයා උදේ ගියාද?');
  });

  test('Neg_Fun_0010 - Long mixed input causes partial incorrect conversion', async ({ page }) => {
    await page.fill(
      'textarea',
      'adoo machan, mama exam eka nisaa late vuna. oyata puluvannam notes tika whatsapp eken evanna. mama campus enakota print karala ganna oni, ethakota leesine. assignment eka gana api passe canteen eke tikak katha karamu. time ekak dhanna group eke anith ayatath enna puluvanne. eeta passe mama balala reply karannam. oyata avulak naethnam siraavatama araka dhanna mama ena gaman.'
    );

    await expectSinhalaContains(
      page,
      'අඩෝ මචන්, මම exam එක නිසා late වුනා. ඔයාට පුලුවන්නම් notes ටික whatsapp එකෙන් එවන්න. මම campus එනකොට print කරල ගන්න ඕනි, එතකොට ලේසිනේ. assignment එක ගැන අපි පස්සෙ canteen eke ටිකක් කතා කරමු. time එකක් දාන්න group eke අනිත් අයටත් එන්න පුලුවන්නේ. ඒට පස්සෙ මම බලලා reply කරන්නම්. ඔයට අවුලක් නැත්නම් සිරාවටම අරක දන්න මම එන ගමන්.'
    );
  });
});
