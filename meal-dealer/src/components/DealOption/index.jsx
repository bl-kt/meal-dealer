function DealOption({item, addItem }) {
    return (
        <li className={'meal-choice-list-item'}>
            <div className={'meal-choice-list-item'}
                 onClick={addItem}>
                <a href={item.link}>
                    <img loading="lazy" width="100%" src={item.image} alt={item.name}/>
                    <div className={'main-choice-list-item-about'}>
                            <p>{item.name}</p>
                    </div>
                </a>
                <div className={'meal-deal-choice-action'}>
                    {item && (
                        <button title={'Add Item'} className={'blue-button'} onClick={addItem}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus"
                                 width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff"
                                 fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M12 5l0 14"/>
                                <path d="M5 12l14 0"/>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
}

export default DealOption