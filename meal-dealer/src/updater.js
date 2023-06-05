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
    'Cookie': 'consumer=default; trkid=c118753f-deb2-4f8d-8694-d25aad04b2a3; atrc=92ea65a6e6103af7420342351ef389cd; DCO=wdc; _csrf=agtsarZgR_XMQ-rp6_2RYHGF; ighs-sess=eyJhbmFseXRpY3NTZXNzaW9uSWQiOiJlOTM3Yzg3MGZlMjgyMDIwODI0NzgwMjUwMDk4Njg1ZiIsInN0b3JlSWQiOiIzMDYwIn0=; ighs-sess.sig=pBtY-iacyoYvz0dVCDaQLIvlNmA; AKA_A2=A; ak_bmsc=59E1CCCB49173607027D1FD0EF5D118D~000000000000000000000000000000~YAAQV0wQAkn3M4mIAQAAbPZiixQJnbliTK2qvDerIGpZl28c/h/ZctrQyW1NvqxkO8yJ50U+qAWKquq7vPrh8CXfsRNl9gVuaTy0ypR36+G6GNDENuNHFihk/MuUppEl52qgogyo6GZ/vxzESEyXEThhyMdeK8rWohZSehTj5vhCTB3x5R3kp6QNb3z6a4fkXmBhKk+oTaYw8WpPpN8k+ac142eKN2KKuf8inJ1tknwpFCfXrR3mfz7HmYoSjIvJTV2CSkT9ky+yWHAyDt/48mKbr7RmxLE+P0BDRTAZGuhzgT7ZTYPNAxfU/Sr935rqWOmm1Ld0wRMSWcw8R2SLCg3YmSMyh4YIozL0mSkHeOuX2pmrW+nDWjdDPZOobsLM7vCblXs7uU+v; bm_sz=9B8D2BFA84B1253331F597E7D89BD8C1~YAAQV0wQAkv3M4mIAQAAbPZiixTylcKeuQOVmQ7acuNxrU0daYFLb9kjy/BRbI8yEoK/453R2+XYq8zxCD48Q2GAzTIf/+KQ/G6ceGnv+CEQQI4ggoYUM7hBz4gdsuWhf1nO/moXmemGh116vAT9He+TZDZdCcFWq5F5JotPfHRxqt1lLxUm6o1pCcYg38+9ftNxBWB1F69FmOHJaZIyNyuLMIQmoNST6Z37wYNv2z4czPMz2qMF3XwFnIcV+OqquAEyK65ny3CIjEshb45Ot1sROiXJCCBP4BFYBhnPIenACw==~4600131~3228228; _abck=746F9724748EA64A5443A2C909046949~0~YAAQV0wQAsD8M4mIAQAADRZjiwrFr7SWYTazWzVxEacqn34U8Qcg7Yz+0jC0vb/3v7EnQJiW+U7P+Wznf06Yfyc/V1lAiWskZpSGvnqZKnsfiR7PZNX16xX2qMCB9tt4SHfPeOmip7ZEn62IaKNM0zr6QDxVwm5TXH6TMeq74RHsAB4lQFzFP6L1diAOPaDfuaqrCT6r9jxezlI5YFZugHa4QGnEiA7Xx+mNyp8Xk5eWBqtyjXfW4YdHeQMRurRzptEVFZFKWAVWUmmJL+HZZfpW1RSYYaeTaOAyhcUyprivUwBhy5qdYiVnszimqaAHmNmcymjgsw280GS3br0Z8WahQrHA21h1V4X8PnXxrmPE6E3gmaff8i009Wqufv5G7Ih/vQiSuGyIW77x6gGvLQkoxRAFyg==~-1~-1~1685969264; akavpau_tesco_groceries=1685966037~id=d057dbc947c1742d5266b95e86d1363d; bm_sv=BDD99288C518E36B2A4CF31357AB019C~YAAQV0wQAvoSNImIAQAAUM1jixQhQOeEFrtKFhOpfHPoSZgR/skLdY9aUlxlwhFB0DEbC4O+/+xCXKtKojNSMOeLrAy1YDnb+i+6HwcwVU5kvMiV3GqLq+m4Wrrp7C98qSOvZ+7Ulx4NHon6iJ1RHmdWWn8o1aUdN81TzCn05MQco7oaNe0QORWvuy43fx1NVvBXYHiBY62gq1AhuqS5kVCwF8fncABPuZDmAjfhSrHVYu+PlHdZqU64t8QiURs=~',
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
