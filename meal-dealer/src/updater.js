import got from 'got';
import {parse} from 'node-html-parser';
import fs from 'fs/promises';

const URL = 'https://www.tesco.com/groceries/en-GB/promotions/88669885';
const HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Upgrade-Insecure-Requests': '1',
    'Pragma': 'no-cache',
    'Cookie': '',
};

const parsedProducts = [];

const fetchMealDeal = async (page) => {
    console.log(`Fetching page ${page}`);

    const res = await got.get(URL + `?page=${page}`, {
        headers: HEADERS,
        timeout: {
            request: 5000,
        },
    });

    const html = parse(res.body);

    const products = html.querySelectorAll('div[class^="styles__StyledTiledContent"]');

    const urlRegex = /^.+jpeg/i;

    products.forEach((product) => {
        const image = product.querySelector('a img');
        const name = product.querySelector('div.product-details--wrapper > h3 span');

        const src = image?.getAttribute('srcSet');
        const srcMatches = src?.match(urlRegex);

        parsedProducts.push({
            name: name?.textContent ?? '',
            image: !srcMatches || srcMatches.length === 0 ? '' : srcMatches[0],
        });
    });

    return products.length > 0;
};

const fetchMealDeals = async () => {
    let page = 1;

    while ((await fetchMealDeal(page))) {
        page++;
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(true)
            }, 200);
        });
    }

    const json = JSON.stringify(parsedProducts, null, 2);

    await fs.writeFile('meals-deals.json', json);
};

await fetchMealDeals();
