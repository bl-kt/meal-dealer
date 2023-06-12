import './App.scss'
import MealDeals from '../meals-deals.json'
import React, {useCallback, useEffect, useState} from "react";
import SelectedItems from "./components/SelectedItems/SelectedItems.jsx";
import Actions from "./components/Actions/Actions.jsx";
import ItemSelector from "./components/ItemSelector/ItemSelector.jsx";

export const STAGES = {
    MAIN: 0,
    SNACK: 1,
    DRINK: 2,
    DONE: 3,
}

export const items = {
    [STAGES.MAIN]: {
        stage: 'Mains',
        items: MealDeals.mains
    },
    [STAGES.SNACK]: {
        stage: 'Snacks',
        items: MealDeals.snacks
    },
    [STAGES.DRINK]: {
        stage: 'Drinks',
        items: MealDeals.drinks
    },
    [STAGES.DONE]: {
        stage: 'Complete',
        items: [],
    }
}

const random = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const App = () => {
    const [selectedItems, setSelectedItems] = useState({
        [STAGES.MAIN]: null,
        [STAGES.SNACK]: null,
        [STAGES.DRINK]: null,
    })

    console.debug('items', items)

    const [stage, setStage] = useState(0)

    const handleItemSelected = useCallback((item) => {
        setSelectedItems((prev) => ({
            ...prev,
            [stage]: item
        }))
    }, [stage])

    const handleReset = () => {
        setSelectedItems({
            [STAGES.MAIN]: null,
            [STAGES.SNACK]: null,
            [STAGES.DRINK]: null,
        })
        setStage(STAGES.MAIN)
    }

    const getShareUrl = useCallback(() => {
        const url = new URL(window.location.origin)

        url.searchParams.forEach((_, k) => {
            url.searchParams.delete(k)
        })

        Object.entries(selectedItems).forEach(([stage, item]) => {
            if (item) {
                url.searchParams.append(stage, item.id)
            }
        })

        return url.href
    }, [selectedItems])

    const handleShare = useCallback(async () => {
        const shareUrl = getShareUrl()

        await window.navigator.clipboard.writeText(shareUrl)
    }, [getShareUrl])

    const handleRemove = (stage) => {
        setSelectedItems((prev) => ({
            ...prev,
            [stage]: null,
        }))
    }

    const handleRandomise = () => {
        setSelectedItems({
            [STAGES.MAIN]: items[STAGES.MAIN].items[random(0, items[STAGES.MAIN].items.length - 1)],
            [STAGES.SNACK]: items[STAGES.SNACK].items[random(0, items[STAGES.SNACK].items.length - 1)],
            [STAGES.DRINK]: items[STAGES.DRINK].items[random(0, items[STAGES.DRINK].items.length - 1)]
        })
    }

    useEffect(() => {
        const shareUrl = getShareUrl()

        history.pushState(null, '', shareUrl)

        setStage(Object.entries(selectedItems).find(([, s]) => !s)?.at(0) ?? STAGES.DONE)
    }, [selectedItems, getShareUrl])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        const main = items[STAGES.MAIN].items.find((item) => item.id === urlParams.get(STAGES.MAIN.toString()))
        const snack = items[STAGES.SNACK].items.find((item) => item.id === urlParams.get(STAGES.SNACK.toString()))
        const drink = items[STAGES.DRINK].items.find((item) => item.id === urlParams.get(STAGES.DRINK.toString()))

        setSelectedItems({
            [STAGES.MAIN]: main,
            [STAGES.SNACK]: snack,
            [STAGES.DRINK]: drink,
        })
    }, [])

    return (
        <div id="content">
            <header id='header'>
                <img className="header-image" alt='Meal Dealer Logo' src='./meal_dealer.png'/>
            </header>
            <main>
                <SelectedItems main={selectedItems[STAGES.MAIN]} snack={selectedItems[STAGES.SNACK]}
                               drink={selectedItems[STAGES.DRINK]} handleRemove={handleRemove}/>
                <Actions handleReset={handleReset} handleShare={handleShare} handleRandomise={handleRandomise}/>
                <ItemSelector items={items[stage].items} stage={items[stage].stage}
                              handleSelectItem={handleItemSelected}/>
            </main>
        </div>
    )
}

export default App
