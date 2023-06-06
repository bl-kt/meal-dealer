function MealDealItem({title, selection, toggleLock, removeItem}) {
    const item = selection.item
    return (
        <div className={'meal-deal-item'}>
            <h2>{title}</h2>
                <div title={item?.name} className={'meal-content-square'}>
                    <button title="Click to remove item" className={'invisible-button delete-item'} onClick={() => {removeItem(title)}}>
                    {item?.image && (
                        <img alt={item?.name} width="150" height="150" src={item?.image}/>
                    )}
                    </button>
                </div>
                <div className={'meal-deal-actions-bottom'}>
                    {item && (
                        <button title={selection?.isLocked ? 'Unlock Item' : 'Lock Item'} className={'meal-deal-action blue-button'} data-item-type={title} onClick={toggleLock}>
                            {selection?.isLocked ?
                                <svg data-item-type={title} xmlns="http://www.w3.org/2000/svg"
                                     className="icon icon-tabler icon-tabler-lock" width="16"
                                     height="16" viewBox="0 0 24 24" strokeWidth="1.5"
                                     stroke="#fff" fill="none" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <title>Unlock Item</title>
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path
                                        d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"/>
                                    <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/>
                                    <path d="M8 11v-4a4 4 0 1 1 8 0v4"/>
                                </svg> :
                                <svg data-item-type={title} xmlns="http://www.w3.org/2000/svg"
                                     className="icon icon-tabler icon-tabler-lock-open" width="16" height="16"
                                     viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none"
                                     strokeLinecap="round" strokeLinejoin="round">
                                    <title>Lock Item</title>
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path
                                        d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/>
                                    <path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>
                                    <path d="M8 11v-5a4 4 0 0 1 8 0"/>
                                </svg>
                            }
                        </button>

                    )}
                </div>
            <div className={'meal-content-caption'}>
            {item?.name && (
                <p><a target="_blank" href={item.link}>{item.name}</a> </p>
            )}
            </div>
        </div>
    );
}

export default MealDealItem