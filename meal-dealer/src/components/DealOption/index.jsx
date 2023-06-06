function MealDealItem({ title, item, toggleLock }) {
    return (
        <div className={'meal-deal-item'}>
            <h2>{title}</h2>
            <div className={'meal-content-square'}>
            </div>
            <button data-item-type="drink" onClick={toggleLock}>
                {item?.isLocked ?
                    <svg xmlns="http://www.w3.org/2000/svg"
                         className="icon icon-tabler icon-tabler-lock" width="16"
                         height="16" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="#000000" fill="none" stroke-linecap="round"
                         stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path
                            d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"/>
                        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/>
                        <path d="M8 11v-4a4 4 0 1 1 8 0v4"/>
                    </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg"
                         className="icon icon-tabler icon-tabler-lock-open" width="16" height="16"
                         viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none"
                         stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path
                            d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/>
                        <path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>
                        <path d="M8 11v-5a4 4 0 0 1 8 0"/>
                    </svg>
                }
            </button>
        </div>
    );
}

export default MealDealItem