import got from 'got';
import {parse} from 'node-html-parser';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

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

// Remove brands ('Tesco', 'T.P/Chef', 'Express Cuisine', etc) and measurements (300ml, 250g, etc) from name
const trimName = (name) => {
    return name.replace(/\d{1,3}(g|ml)/i, '').replace('Tesco', '').replace('T.P/Chef', '').replace('Express Cuisine', '')
}

const fetchMealDeal = async () => {
    console.log(`Fetching page`);

    const res = await got.get(URL, {
        headers: HEADERS,
        timeout: {
            request: 5000,
        },
    });

    const html = parse(res.body);

    const products = html.querySelectorAll('div[class^="styles__StyledTiledContent"]');

    const urlRegex = /^.+jpeg/i;

    const parsedProducts = [];

    products.forEach((product) => {
        const image = product.querySelector('a img');
        const name = product.querySelector('div.product-details--wrapper > h3 span');
        const link = product.querySelector('div.product-details--wrapper > h3 > a');

        const src = image?.getAttribute('srcSet');
        const srcMatches = src?.match(urlRegex);

        parsedProducts.push({
            name: trimName(name?.textContent ?? ''),
            image: !srcMatches || srcMatches.length === 0 ? '' : srcMatches[0],
            link: 'https://www.tesco.com' + link?.getAttribute('href'),
        });
    });

    return parsedProducts;
};

const fetchMealDeals = async () => {
    const parsedProducts = await fetchMealDeal()

    let oldData = null;

    try {
        oldData = await fs.readFile('meals-deals.json', { encoding: 'utf8' })
    } catch (e) {
    }

    let finalData;

    if (oldData) {
        const parsedOldData = JSON.parse(oldData)
        const parsedOldDataNames = parsedOldData.map((po) => po.name)

        const k = parsedProducts
            .filter((p) => !parsedOldDataNames.includes(p.name))
            .map((p) => ({
                uuid: uuidv4(),
                ...p
            }))

        parsedOldData.push(...k)
        finalData = parsedOldData
    } else {
        finalData = parsedProducts.map((p) => ({
            uuid: uuidv4(),
            ...p,
        }))
    }

    finalData = finalData.sort(function (a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });

    const json = JSON.stringify(finalData, null, 2);

    await fs.writeFile('meals-deals.json', json);
};

await fetchMealDeals();
