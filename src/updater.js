import got from 'got';
import {parse} from 'node-html-parser';
import fs from 'fs/promises';
import {CookieJar, MemoryCookieStore} from "tough-cookie";

const API_URL = 'https://www.tesco.com/groceries/en-GB/resources';
const MEAL_DEALS_URL = 'https://www.tesco.com/groceries/en-GB/shop/fresh-food/chilled-soup-sandwiches-and-salad-pots/lunch-meal-deals';
const VERIFY_URL = 'https://www.tesco.com/_sec/verify?provider=interstitial'
const HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Upgrade-Insecure-Requests': '1',
    'Pragma': 'no-cache',
    'Origin': 'https://www.tesco.com',
};

const SHELVES = {
    mains: '£3.90 Meal Deal Mains',
    snacks: 'Meal Deal Snacks',
    drinks: 'Meal Deal Drinks',
}

// Remove brands ('Tesco', 'T.P/Chef', 'Express Cuisine', etc) and measurements (300ml, 250g, etc) from name
const trimName = (name) => {
    return name.replace(/\d{1,3}(g|ml)/i, '').replace('Tesco', '').replace('T.P/Chef', '').replace('Express Cuisine', '')
}

const cookieJar = new CookieJar(new MemoryCookieStore());

const fetchMealDealType = async (type, page) => {
    console.log(`Fetching page ${page} of ${type}`)

    return await got.post(API_URL, {
        headers: HEADERS,
        json: {
            resources: [
                {
                    "type": "productsByCategory",
                    "params": {
                        "aisle": "lunch-meal-deals",
                        "department": "chilled-soup-sandwiches-and-salad-pots",
                        "query": {
                            // 48 is the max
                            "count": "48",
                            "page": String(page),
                            "shelf": type,
                            "viewAll": "shelf",
                        },
                        "superdepartment": "fresh-food"
                    },
                }
            ],
        },
        cookieJar,
        timeout: {
            request: 10000,
        },
    }).json();
}

const fetchMealDeals = async () => {
    const parsedProducts = {
        mains: [],
        snacks: [],
        drinks: [],
    };
    let page = 1;

    for (const [key, value] of Object.entries(SHELVES)) {
        let pageInfo;

        do {
            const json = await fetchMealDealType(value, page++);

            pageInfo = json.productsByCategory.data.results.pageInformation;
            const results = json.productsByCategory.data.results.productItems.map((p) => p.product);

            const mappedResults = results.map((product) => ({
                name: trimName(product.title).trim(),
                image: product.defaultImageUrl.split('?')[0],
                link: `https://www.tesco.com/groceries/en-GB/products/${product.id}`,
                id: product.id,
            }));

            parsedProducts[key].push(...mappedResults);

            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true)
                }, 200)
            });
        } while (pageInfo.count === pageInfo.pageSize);

        page = 1;
    }

    return parsedProducts;
};

const initCookies = async () => {
    console.log('Completing challenges...')
    const headers = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    }


    const challengeResponse = await got.get(MEAL_DEALS_URL, {
        headers: {
            ...headers,
            Origin: 'https://www.tesco.com',
        },
        cookieJar,
    });

    const challengeHtml = parse(challengeResponse.body)

    const mathChallenge = challengeHtml.querySelector('html > head > script').textContent

    const mathChallengeMatches = [...mathChallenge.matchAll(/i = (\d+).+\n.+number\("(\d+)"\s\+\s"(\d+)"/gmi)][0];

    const base = mathChallengeMatches[1];
    const pow1 = mathChallengeMatches[2];
    const pow2 = mathChallengeMatches[3];

    const total = Number(base) + (Number(pow1) + Number(pow2));

    const challengeResolverScript = challengeHtml.querySelector('html > script').textContent;

    const bmVerifyMatches = [...challengeResolverScript.matchAll(/"bm-verify":\s+"(.+)"/gmi)][0];

    const bmVerify = bmVerifyMatches[1];

    await got.post(VERIFY_URL, {
        headers: {
            ...headers,
            Origin: 'https://www.tesco.com',
        },
        cookieJar,
        json: {
            'bm-verify': bmVerify,
            pow: total,
        }
    });

    const finalResponse = await got.get(MEAL_DEALS_URL, {
        headers: {
            ...headers,
            Referer: MEAL_DEALS_URL,
        },
        cookieJar,
    });

    const finalResponseParsed = parse(finalResponse.body);

    const finalResponseBody = finalResponseParsed.querySelector('body');

    HEADERS['X-Csrf-Token'] = finalResponseBody.getAttribute('data-csrf-token');

    return cookieJar.serializeSync().cookies.some((c) => c.key === '_csrf');
};

const sortByName = (a, b) => {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
};

const mergeProducts = (allNewProducts, oldProducts) => {
    const oldProductIds = oldProducts.map((product) => product.id)

    const newProducts = allNewProducts.filter((product) => !oldProductIds.includes(product.id));

    console.debug('newProducts', newProducts)

    oldProducts.push(...newProducts);

    return oldProducts;
}

const main = async () => {
    const result = await initCookies();

    if (result) {
        console.debug('Challenges complete');
    } else {
        console.debug('Challenges failed, aborting');
        process.exit(1);
        return;
    }

    const parsedProducts = await fetchMealDeals()

    let currentProductsBody;

    try {
        currentProductsBody = await fs.readFile('meals-deals.json', { encoding: 'utf-8' });
    } catch (e)
    {
    }

    if (currentProductsBody) {
        const currentProducts = JSON.parse(currentProductsBody);

        parsedProducts.mains = mergeProducts(parsedProducts.mains, currentProducts.mains)
        parsedProducts.drinks = mergeProducts(parsedProducts.drinks, currentProducts.drinks)
        parsedProducts.snacks = mergeProducts(parsedProducts.snacks, currentProducts.snacks)
    }

    parsedProducts.mains = parsedProducts.mains.sort(sortByName)
    parsedProducts.drinks = parsedProducts.drinks.sort(sortByName)
    parsedProducts.snacks = parsedProducts.snacks.sort(sortByName)

    const json = JSON.stringify(parsedProducts, null, 2);

    await fs.writeFile('meals-deals.json', json);
};

await main();
