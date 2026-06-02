const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + process.cwd() + '/index.html');
  await page.waitForSelector('h1');

  // Verify main headings
  const title = await page.innerText('h1');
  console.log('Title:', title);

  // Take screenshot of the updated Batching section
  await page.click('button:has-text("O Batch de Treino")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verification/final_batching.png' });

  // Take screenshot of the updated Hardware section
  await page.click('button:has-text("Especialista HPC")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Hardware & Blackwell")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verification/final_hardware_b200.png' });

  await browser.close();
})();
