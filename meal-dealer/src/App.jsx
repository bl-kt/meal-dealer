import './App.scss'
import MealDeals from '../meals-deals.json'
import {useEffect, useState} from "react";
import MealDealItem from "./components/SelectedDealItem/index.jsx";
import DealOption from "./components/DealOption/index.jsx";

function App() {
    // Scroll event listener
    useEffect(() => {
        document.addEventListener("scroll", (event) => {
            if (window.scrollY > window.innerHeight) {
                setShowScrollToTop(true)
            } else {
                setShowScrollToTop(false)
            }
        });
    }, []);

    const [main, setMain] = useState({isLocked: false, item: null});
    const [snack, setSnack] = useState({isLocked: false, item: null});
    const [drink, setDrink] = useState({isLocked: false, item: null});

    const [allItems, setAllItems] = useState(MealDeals);

    const [showScrollToTop, setShowScrollToTop] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);

    const getItemFromQueryParam = (slot) => {
        switch (slot) {
            case 'main':
                if (urlParams.get(`${slot}`) !== ''){
                    addItem(urlParams.get(`${slot}`), 'main', false)
                }
                break;
            case 'snack':
                if (urlParams.get(`${slot}`) !== ''){
                    addItem(urlParams.get(`${slot}`), 'snack', false)
                }
                break;
            case 'drink':
                if (urlParams.get(`${slot}`) !== ''){
                    addItem(urlParams.get(`${slot}`), 'drink', false)
                }                break;
            default:
                break;
        }
    }

    // Check query params for loading shared meal deals
    useEffect(() => {
            getItemFromQueryParam('main')
            getItemFromQueryParam('snack')
            getItemFromQueryParam('drink')
    }, []);


    const determineSlot = (isRandom = false) => {
        // This could probably be done better, come back to this
        if (main.item !== null || main.isLocked){
            if (snack.item !== null || snack.isLocked){
                if ((drink.item !== null || drink.isLocked) && !isRandom){
                    return 'full'
                }
                else {
                    return 'drink'
                }
            } else {
                return 'snack'
            }
        } else {
            return 'main'
        }
    }

    // Add item to current meal deal
    const addItem = (uuid, slot = null, updateUrl = true) => {
        const item = allItems.find((item) => {
            return item.uuid === uuid
        })

        if (slot === null){
            slot = determineSlot()
        }

        if (slot !== 'full'){
            switch (slot) {
                case 'drink':
                        urlParams.set('drink', item.uuid)
                        setDrink((prev) => ({
                            ...prev,
                            item: item,
                        }));
                    break;
                case 'main':
                        urlParams.set('main', item.uuid)
                        setMain((prev) => ({
                            ...prev,
                            item: item,
                        }));

                    break;
                case 'snack':
                        urlParams.set('snack', item.uuid)
                        setSnack((prev) => ({
                            ...prev,
                            item: item,
                        }));
                    break;
                default:
                    break;
            }

            if (updateUrl){
                window.location.search = urlParams;
            }
        }
    }

    // Remove item from current meal deal
    const removeItem = (location, updateUrl = true) => {
        const slot = location.toLowerCase()
        switch (slot) {
            case 'drink':
                setDrink({isLocked: false, item: null})
                urlParams.set('drink', '')
                break;
            case 'main':
                setMain({isLocked: false, item: null})
                urlParams.set('main', '')
                break;
            case 'snack':
                setSnack({isLocked: false, item: null})
                urlParams.set('snack', '')
                break;
            default:
                break;
        }

        if (updateUrl){
            window.location.search = urlParams;
        }
    }

    // Generate random meal deal item, then add it.
    // To do: Update this for categories.
    const randomItem = (slot) => {
        const randomIndex = Math.ceil(Math.random() * (MealDeals.length - 1) + 1);
        const randomItem = allItems[randomIndex]
        switch (slot) {
            case 'drink':
                if (!drink.isLocked) addItem(randomItem.uuid, slot)
                break;
            case 'main':
                if (!main.isLocked) addItem(randomItem.uuid, slot)
                break;
            case 'snack':
                if (!snack.isLocked) addItem(randomItem.uuid, slot)
                break;
            default:
                break;
        }
    }

    // Generate random meal deal, consisting of three items, then add it.
    // To do: Update this for categories.
    const randomMealDeal = () => {
        randomItem('main');
        randomItem('snack');
        randomItem('drink');
    }

    // Clears meal deal selected
    const clearSelection = () => {
        setDrink({isLocked: false, item: null})
        setSnack({isLocked: false, item: null})
        setMain({isLocked: false, item: null})

        urlParams.set('main', '')
        urlParams.set('snack', '')
        urlParams.set('drink', '')

        window.location.search = urlParams;
    }

    // Sort Alphabetically
    function compareStrings(a, b) {
        // Assuming you want case-insensitive comparison
        a = a.toLowerCase();
        b = b.toLowerCase();

        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }

    // Search all items - not fuzzy.
    const searchAllItems = (e) => {
        const searchValue = String(e.target.value).toLowerCase()
        if (searchValue === '' || searchValue === null || !searchValue) {
            setAllItems(MealDeals)
        } else {
            setAllItems(allItems.filter((item) => {
                const itemName = String(item.name).toLowerCase()
                return itemName.includes(searchValue)
            }))
        }
    }

    // Toggles locked status on selected menu items (prevents randomizer from randomising it.)
    const toggleLock = (e) => {
        const target = e.target
        const itemType = String(target.getAttribute('data-item-type'))
        switch (itemType.toLowerCase()) {
            case 'drink':
                setDrink((prev) => ({
                    ...prev,
                    isLocked: !prev.isLocked,
                }));
                break;
            case 'main':
                setMain((prev) => ({
                    ...prev,
                    isLocked: !prev.isLocked,
                }));
                break;
            case 'snack':
                setSnack((prev) => ({
                    ...prev,
                    isLocked: !prev.isLocked,
                }));
                break;
        }
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Add meal deal items to query parameter in order to share them.
    const shareDeal = () => {
        navigator.clipboard.writeText(window.location.href)
        let alert = document.getElementById("alert");
        alert.className = "show";
        setTimeout(()=>{ alert.className = alert.className.replace("show", ""); }, 3000);
    }

  return (
    <div id={'content'}>
        <div id={'hero'}>
            {showScrollToTop && (
                <button id={'scroll-to-top'} className={'grey-button'} onClick={scrollToTop}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-big-up-line"
                     width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none"
                     strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path
                        d="M9 12h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v6h-6v-6z"/>
                    <path d="M9 21h6"/>
                </svg>
            </button>
            )}
            <header id={'header'}>
                <img width="500" alt='Meal Dealer Logo' src={'./meal_dealer.png'}/>
            </header>
            <main id={'main'}>
            <section id={'selected-meal'}>
                <article id={'meal-contents'}>
                    <MealDealItem title='Main' selection={main} toggleLock={toggleLock} removeItem={removeItem}/>
                    <MealDealItem title='Snack' selection={snack} toggleLock={toggleLock} removeItem={removeItem}/>
                    <MealDealItem title='Drink' selection={drink} toggleLock={toggleLock} removeItem={removeItem}/>
                </article>
                <article id={'actions'}>
                    <span id="alert">Deal Successfully Copied</span>
                    <button className={'blue-button'} title={"Randomize"} onClick={randomMealDeal}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-dice-6-filled"
                             width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none"
                             strokeLinecap="round" strokeLinejoin="round">
                            <title>Randomize</title>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path
                                d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.833 13a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3zm-7 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3zm0 -4.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3zm7 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3zm-7 -4.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3zm7 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3z"
                                strokeWidth="0" fill="currentColor"/>
                        </svg>
                    </button>
                    {/*To do: add sharing functionality (query params) */}
                    <button disabled={!drink || !main || !snack} className={'grey-button'} title={"Share"} onClick={shareDeal}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-share"
                             width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none"
                             strokeLinecap="round" strokeLinejoin="round">
                            <title>Share</title>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" stroke="currentColor"/>
                            <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" stroke="currentColor"/>
                            <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" stroke="currentColor"/>
                            <path d="M8.7 10.7l6.6 -3.4" stroke="currentColor"/>
                            <path d="M8.7 13.3l6.6 3.4" stroke="currentColor"/>
                        </svg>
                    </button>
                    <button title="Clear Deal" className={'red-button'} onClick={clearSelection}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="16"
                             height="16" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none"
                             strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M4 7l16 0"/>
                            <path d="M10 11l0 6"/>
                            <path d="M14 11l0 6"/>
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>
                        </svg>
                    </button>
                </article>
            </section>
        </main>
        </div>
        <section id={'meal-options'}>
                <article id={'all-options'}>
                    <div className={'option-header'}>
                        <h3> Items </h3>
                        <input title={'Search'} onChange={searchAllItems} placeholder={'Search...'}
                               type="text"/>
                    </div>
                    <ul className={'meal-choice-list'}>
                        {allItems.sort().map((item) => {
                            return (
                                <DealOption key={item.uuid} item={item} addItem={() => {addItem(item.uuid)}}/>
                            )}
                        )}
                    </ul>
                </article>
            </section>
        <footer>
            <p>&copy; <script>document.write(new Date().getFullYear())</script> BLKT / Pseudorizer </p>
            <a target="_blank" href={"https://github.com/bl-kt/meal-dealer"}>
             Github
            </a>
        </footer>
    </div>
  )
}

export default App
