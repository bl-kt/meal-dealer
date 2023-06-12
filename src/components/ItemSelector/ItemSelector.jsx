import React, {useState} from 'react';
import LazyLoad from 'react-lazyload';

const ItemSelector = ({items, stage, handleSelectItem}) => {
    const [query, setQuery] = useState('');

    return (
        <div className="itemSelector">
            <h2>Currently Selecting: {stage}</h2>
            <div className="itemSelectorMain">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..."/>
                <div className="itemSelectorContent">
                    {items.map((item) => {
                        const display = item.name.toLowerCase().includes(query.toLowerCase()) ? null : 'none'

                        return (
                            <button key={item.id} className="itemSelectorContentItem"
                                    onClick={() => handleSelectItem(item)}
                                    style={{display: display}}>
                                <LazyLoad height={150} once>
                                    <img src={item.image} alt={item.name} height={150}/>
                                </LazyLoad>
                                <h3>{item.name}</h3>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ItemSelector;
