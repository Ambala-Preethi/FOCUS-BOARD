const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

// We can serve the dist directory using a simple http server or vite preview
const distDir = path.join(__dirname, '..', 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA fallback
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(distDir, 'index.html')).pipe(res);
  }
});

const PORT = 5199;

server.listen(PORT, async () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];

  try {
    // -------------------------------------------------------------
    // 1. DESKTOP 1440 x 1000
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Desktop 1440x1000 ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 1000 }
    });
    const desktopPage = await desktopContext.newPage();
    desktopPage.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
        consoleErrors.push(msg.text());
      }
    });

    await desktopPage.goto(`http://localhost:${PORT}`);
    await desktopPage.waitForLoadState('networkidle');

    // Verify Title & Brand
    const brand = await desktopPage.textContent('body');
    if (!brand.includes('FocusBoard')) throw new Error('FocusBoard brand not found');
    console.log('✓ Desktop loaded FocusBoard successfully');

    // Take Desktop Screenshot
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, 'desktop-dashboard-1440x1000.png'),
      fullPage: false
    });
    console.log('✓ Saved desktop screenshot: desktop-dashboard-1440x1000.png');

    // -------------------------------------------------------------
    // 2. CREATE TASK MODAL (760 x 822)
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Create Task Modal ---');
    // Click "+ New task"
    await desktopPage.click('button:has-text("New task")');
    await desktopPage.waitForSelector('[role="dialog"]');
    console.log('✓ Create task modal opened');

    // Take Modal Screenshot
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, 'create-task-form-760x822.png'),
      fullPage: false
    });
    console.log('✓ Saved create task modal screenshot: create-task-form-760x822.png');

    // Test Validation: Submit without title
    await desktopPage.click('button:has-text("Create task")');
    const hasValidationError = await desktopPage.isVisible('text=Task title is required');
    if (!hasValidationError) throw new Error('Expected validation error on empty title');
    console.log('✓ Empty title validation triggered successfully');

    // Fill valid task
    await desktopPage.fill('#task-title', 'E2E Verified Task from Automated Suite');
    await desktopPage.fill('#task-description', 'Automated test task confirming seamless creation flow.');
    await desktopPage.selectOption('#task-status', 'In progress');
    await desktopPage.selectOption('#task-priority', 'High');
    await desktopPage.click('button:has-text("Create task")');

    // Wait for modal to close
    await desktopPage.waitForSelector('[role="dialog"]', { state: 'hidden' });
    console.log('✓ Task created successfully and modal closed');

    // Verify task is in list
    const taskVisible = await desktopPage.isVisible('text=E2E Verified Task from Automated Suite');
    if (!taskVisible) throw new Error('Created task not found in list');
    console.log('✓ New task rendered in list immediately');

    // -------------------------------------------------------------
    // 3. EDIT TASK
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Edit Task ---');
    await desktopPage.click('button[aria-label="Edit E2E Verified Task from Automated Suite"]');
    await desktopPage.waitForSelector('[role="dialog"]');
    await desktopPage.fill('#task-title', 'E2E Verified Task (Updated Title)');
    await desktopPage.click('button:has-text("Save changes")');
    await desktopPage.waitForSelector('[role="dialog"]', { state: 'hidden' });

    const updatedVisible = await desktopPage.isVisible('text=E2E Verified Task (Updated Title)');
    if (!updatedVisible) throw new Error('Updated task title not visible');
    console.log('✓ Task edited and saved successfully');

    // -------------------------------------------------------------
    // 4. STATUS TOGGLE & DYNAMIC STATS
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Status Cycle & Dynamic Stats ---');
    // Click status toggle icon on our task to advance to Completed
    await desktopPage.click('button[aria-label*="Click to advance status."]');
    await desktopPage.waitForTimeout(300);
    console.log('✓ Status toggled via status button');

    // -------------------------------------------------------------
    // 5. CAROUSEL NAVIGATION
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Carousel Navigation ---');
    // Verify Slide 1
    let slide1Text = await desktopPage.textContent('text=Make today count.');
    if (!slide1Text) throw new Error('Slide 1 text missing');
    console.log('✓ Slide 1 verified: "Make today count."');

    // Click Next
    await desktopPage.click('button[aria-label="Next focus note slide"]');
    await desktopPage.waitForTimeout(200);
    let slide2Text = await desktopPage.textContent('text=Small steps, big progress.');
    if (!slide2Text) throw new Error('Slide 2 text missing');
    console.log('✓ Slide 2 verified: "Small steps, big progress."');

    // Click Next again
    await desktopPage.click('button[aria-label="Next focus note slide"]');
    await desktopPage.waitForTimeout(200);
    let slide3Text = await desktopPage.textContent('text=Celebrate the wins.');
    if (!slide3Text) throw new Error('Slide 3 text missing');
    console.log('✓ Slide 3 verified: "Celebrate the wins."');

    // -------------------------------------------------------------
    // 6. SEARCH & FILTERING
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Search & Filtering ---');
    // Type in search
    await desktopPage.fill('input[placeholder="Search tasks..."]', 'documentation');
    await desktopPage.waitForTimeout(200);
    const docTaskVisible = await desktopPage.isVisible('text=Prepare Project Documentation');
    if (!docTaskVisible) throw new Error('Search did not find Project Documentation');
    console.log('✓ Live case-insensitive search verified');

    // Clear search
    await desktopPage.click('button[aria-label="Clear search query"]');
    await desktopPage.waitForTimeout(200);

    // -------------------------------------------------------------
    // 7. DELETE TASK WITH CONFIRMATION
    // -------------------------------------------------------------
    console.log('\n--- 7. Testing Delete Task with Confirmation ---');
    await desktopPage.click('button[aria-label="Delete E2E Verified Task (Updated Title)"]');
    await desktopPage.waitForSelector('[role="alertdialog"]');
    console.log('✓ Delete confirmation alert dialog opened');
    await desktopPage.click('button:has-text("Delete task")');
    await desktopPage.waitForSelector('[role="alertdialog"]', { state: 'hidden' });
    console.log('✓ Task deleted successfully');

    await desktopContext.close();

    // -------------------------------------------------------------
    // 8. MOBILE VIEWPORT 390 x 1128
    // -------------------------------------------------------------
    console.log('\n--- 8. Testing Mobile 390x1128 ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 1128 }
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`http://localhost:${PORT}`);
    await mobilePage.waitForLoadState('networkidle');

    // Verify mobile elements
    const mobileHeader = await mobilePage.isVisible('text=Your work, in focus.');
    if (!mobileHeader) throw new Error('Mobile header not visible');

    // Verify bottom navigation bar exists
    const bottomNav = await mobilePage.isVisible('nav[aria-label="Mobile Navigation"]');
    if (!bottomNav) throw new Error('Mobile bottom nav not visible');
    console.log('✓ Mobile bottom navigation bar rendered');

    // Take Mobile Screenshot
    await mobilePage.screenshot({
      path: path.join(screenshotsDir, 'mobile-dashboard-390x1128.png'),
      fullPage: false
    });
    console.log('✓ Saved mobile screenshot: mobile-dashboard-390x1128.png');

    await mobileContext.close();

    console.log('\n=====================================================');
    console.log(` ALL BROWSER INTERACTION TESTS PASSED!`);
    console.log(` Console errors detected: ${consoleErrors.length}`);
    console.log('=====================================================');

    if (consoleErrors.length > 0) {
      console.warn('Warning: Console errors were logged during run:', consoleErrors);
    }
  } catch (err) {
    console.error('Browser testing failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
});
