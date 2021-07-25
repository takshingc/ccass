
// Import the playwright library into our scraper.
const playwright = require('playwright');
const cheerio = require('cheerio');

async function main(stock_code, date, headless = true) {
    // Open a Chromium browser. We use headless: false
    // to be able to watch what's going on.
    const browser = await playwright.chromium.launch({
        headless: headless
    });
    // Open a new page / tab in the browser.
    const page = await browser.newPage();

    await page.goto('https://www.hkexnews.hk/sdw/search/searchsdw_c.aspx');

    await page.$eval('#txtShareholdingDate', (el, date) => el.value = date, date);
    await page.fill('id=txtStockCode', stock_code);

    await page.click('id=btnSearch');

    await page.waitForSelector('table.table');
    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);

    const list = [];
    $('div.mobile-list-body').each((_, element) => list.push($(element).text()));

    const data = list.reduce(toPartitions(5), [])
    return data;
}

function toPartitions(size) {
    var partition = [];
    return function (acc, v) {
        partition.push(v);
        if (partition.length === size) {
            acc.push(partition);
            partition = [];
        }
        return acc;
    };
}

var myArgs = process.argv.slice(2);
const stock_code = myArgs[0] || '6060';
const date = myArgs[1] || new Date().toISOString().slice(0, 10);
const headless = myArgs[2] || true

main(stock_code, date, headless);

exports.downloadHoldings = main;
