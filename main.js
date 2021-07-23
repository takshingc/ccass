
// Import the playwright library into our scraper.
const playwright = require('playwright');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

async function main(stock_num, date, headless=true) {
    // Open a Chromium browser. We use headless: false
    // to be able to watch what's going on.
    const browser = await playwright.chromium.launch({
        headless: true
    });
    // Open a new page / tab in the browser.
    const page = await browser.newPage();

    await page.goto('https://www.hkexnews.hk/sdw/search/searchsdw_c.aspx');

    await page.$eval('#txtShareholdingDate', (el, date) => el.value = date, date);
    await page.fill('id=txtStockCode', stock_num);

    await page.click('id=btnSearch');

    await page.waitForSelector('table.table');
    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);

    let list = [];
    $('div.mobile-list-body').each((_, element) => list.push($(element).text()));

    let data = list.reduce(toPartitions(5), [])
    writeCSV(`./data/${stock_num}_${date}.csv`, data)
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

function writeCSV(file_path, data) {
    const csvWriter = createCsvWriter({
        path: file_path,
        header: [
            'id', 'name', 'address', 'shares', 'percentage'
        ]
    });

    csvWriter.writeRecords(data)
}

var myArgs = process.argv.slice(2);
const stock_num = myArgs[0] || '6060';
const date = myArgs[1] || new Date().toISOString().slice(0, 10);
const headless = myArgs[2] || true

main(stock_num, date, headless);

exports.fetcher = main;
