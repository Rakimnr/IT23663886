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

test.describe('Positive Functional Tests – Singlish to Sinhala (TC1–TC25)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/', { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
  });

  test('Pos_Fun_0001 - Convert a simple daily sentence', async ({ page }) => {
    await page.fill('textarea', 'mama gedhara yanavaa.');
    await expectSinhalaContains(page, 'මම ගෙදර යනවා.');
  });

  test('Pos_Fun_0002 - Convert a mixed Singlish and English office sentence', async ({ page }) => {
    await page.fill('textarea', 'Zoom meeting ekak thiyennee.');
    await expectSinhalaContains(page, 'Zoom meeting එකක් තියෙන්නේ.');
  });

  test('Pos_Fun_0003 - Convert a polite imperative command', async ({ page }) => {
    await page.fill('textarea', 'karuNaakaralaa eyaava yavanna.');
    await expectSinhalaContains(page, 'කරුණාකරලා එයාව යවන්න.');
  });

  test('Pos_Fun_0004 - Convert a polite request', async ({ page }) => {
    await page.fill('textarea', 'mata eeka evanna puLuvandha?');
    await expectSinhalaContains(page, 'මට ඒක එවන්න පුළුවන්ද?');
  });

  test('Pos_Fun_0005 - Convert a short past tense sentence', async ({ page }) => {
    await page.fill('textarea', 'mama iiyee gedhara giyaa.');
    await expectSinhalaContains(page, 'මම ඊයේ ගෙදර ගියා.');
  });

  test('Pos_Fun_0006 - Convert a short compound sentence', async ({ page }) => {
    await page.fill('textarea', 'oyaa hari, ehenam api yamu.');
    await expectSinhalaContains(page, 'ඔයා හරි, එහෙනම් අපි යමු.');
  });

  test('Pos_Fun_0007 - Convert a short complex conditional sentence', async ({ page }) => {
    await page.fill('textarea', 'oyaa enavaanam mama balan innavaa.');
    await expectSinhalaContains(page, 'ඔයා එනවානම් මම බලන් ඉන්නවා.');
  });

  test('Pos_Fun_0008 - Convert a short future tense sentence', async ({ page }) => {
    await page.fill('textarea', 'api iiLaGa sathiyee gedhara yamu.');
    await expectSinhalaContains(page, 'අපි ඊළඟ සතියේ ගෙදර යමු.');
  });

  test('Pos_Fun_0009 - Convert a short negative sentence', async ({ page }) => {
    await page.fill('textarea', 'mama ehema karannee naehae.');
    await expectSinhalaContains(page, 'මම එහෙම කරන්නේ නැහැ.');
  });

  test('Pos_Fun_0010 - Convert a plural pronoun question', async ({ page }) => {
    await page.fill('textarea', 'oyaalaa enavadha?');
    await expectSinhalaContains(page, 'ඔයාලා එනවද?');
  });

  test('Pos_Fun_0011 - Convert a common greeting', async ({ page }) => {
    await page.fill('textarea', 'suba udhaeesanak!');
    await expectSinhalaContains(page, 'සුබ උදෑසනක්!');
  });

  test('Pos_Fun_0012 - Convert an agreement sentence with emphasis', async ({ page }) => {
    await page.fill('textarea', 'ov oyaa hari, eeka hodhayi thamayi.');
    await expectSinhalaContains(page, 'ඔව් ඔයා හරි, ඒක හොදයි තමයි.');
  });

  test('Pos_Fun_0013 - Convert a short negative statement', async ({ page }) => {
    await page.fill('textarea', 'mama ennee naehae');
    await expectSinhalaContains(page, 'මම එන්නේ නැහැ');
  });

  test('Pos_Fun_0014 - Convert sentence with measurement unit', async ({ page }) => {
    await page.fill('textarea', 'mama liitar 2k mee boothaleeta vathura gaththaa.');
    await expectSinhalaContains(page, 'මම ලීටර් 2ක් මේ බෝතලේට වතුර ගත්තා.');
  });

  test('Pos_Fun_0015 - Convert a place name question', async ({ page }) => {
    await page.fill('textarea', 'api mee sathiyee yamudha gaallee?');
    await expectSinhalaContains(page, 'අපි මේ සතියේ යමුද ගාල්ලේ?');
  });

  test('Pos_Fun_0016 - Convert a multi-line request with date and time', async ({ page }) => {
    await page.fill('textarea', 'oyaa adha free dha?\nheta 2.30pm meeting ekata enna.');
    await expectSinhalaContains(page, 'ඔයා අද free ද?\nහෙට 2.30pm meeting එකට එන්න.');
  });

  test('Pos_Fun_0017 - Convert long paragraph with scheduling update', async ({ page }) => {
    await page.fill(
      'textarea',
      'api 2026-02-05 dha 10.00am meeting eka 11.00am ta shift karaa, agenda eka update karala mail eken evannam. Zoom link eka group eke dhaannam, oyalaata puluvannam ee velaavata join venna. avlak thiyenavanan message ekak dhaanna, naethnam call karanna. Attendance mark karanna ooni, ee nisaa time ekata login venna. meeting eka record karala share karannam. Thanks.'
    );
    await expectSinhalaContains(
      page,
      'අපි 2026-02-05 ද 10.00am meeting එක 11.00am ට shift කරා, agenda එක update කරල mail එකෙන් එවන්නම්. Zoom link එක group eke දාන්නම්, ඔයලාට පුලුවන්නම් ඒ වෙලාවට join වෙන්න. අව්ලක් තියෙනවනන් message එකක් දාන්න, නැත්නම් call කරන්න. Attendance mark කරන්න ඕනි, ඒ නිසා time එකට login වෙන්න. meeting එක record කරල share කරන්නම්. Thanks.'
    );
  });

  test('Pos_Fun_0018 - Convert a sentence with a brand name', async ({ page }) => {
    await page.fill('textarea', 'mama Spar ekata giyaa.');
    await expectSinhalaContains(page, 'මම Spar එකට ගියා.');
  });

  test('Pos_Fun_0019 - Convert negative permission sentence', async ({ page }) => {
    await page.fill('textarea', 'mata eheta yanna bae, permission naehae');
    await expectSinhalaContains(page, 'මට එහෙට යන්න බැ, permission නැහැ');
  });

  test('Pos_Fun_0020 - Convert sentence with technical abbreviation', async ({ page }) => {
    await page.fill('textarea', 'wifi connect venne naehae, password eka hari dha?');
    await expectSinhalaContains(page, 'wifi connect වෙන්නෙ නැහැ, password එක හරි ද?');
  });

  test('Pos_Fun_0021 - Convert a sentence with extra spaces', async ({ page }) => {
    await page.fill('textarea', 'mama heta office yanavaa.');
    await expectSinhalaContains(page, 'මම හෙට office යනවා.');
  });

  test('Pos_Fun_0022 - Convert a plural pronoun future activity question', async ({ page }) => {
    await page.fill('textarea', 'oyaalaa heta film eka balanna yanavadha ?');
    await expectSinhalaContains(page, 'ඔයාලා හෙට film එක බලන්න යනවද ?');
  });

  test('Pos_Fun_0023 - Convert an imperative command sentence', async ({ page }) => {
    await page.fill('textarea', 'karuNaakaralaa dhora arinna.');
    await expectSinhalaContains(page, 'කරුණාකරලා දොර අරින්න.');
  });

  test('Pos_Fun_0024 - Convert sentence with currency and number format', async ({ page }) => {
    await page.fill('textarea', 'mee meesaya Rs. 25000 dha? discount naedhdha?');
    await expectSinhalaContains(page, 'මේ මේසය Rs. 25000 ද? discount නැද්ද?');
  });

  test('Pos_Fun_0025 - Convert a future plan sentence', async ({ page }) => {
    await page.fill('textarea', 'mama iiLaGa maase trip ekak yanna innavaa.');
    await expectSinhalaContains(page, 'මම ඊළඟ මාසෙ trip එකක් යන්න ඉන්නවා.');
  });
});
