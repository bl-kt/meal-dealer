import React from 'react';

const SelectedItem = ({item, title, handleRemove, stage}) => {
    return (
        <div className="selectedItem">
            <h2 className="selectedItemTitle">{title}</h2>
            <div className="selectedItemImage" onClick={() => handleRemove(stage)}>
                {item?.image && (
                    <button className="selectedItemImageButton">
                        <img src={item?.image} alt={`${title} image`} height='150px' loading='lazy'/>
                    </button>
                )}
            </div>
            <a href={item?.link} rel="noopener noreferrer" target="_blank" className="selectedItemName">{item?.name}</a>
        </div>
    );
};

export default SelectedItem;
