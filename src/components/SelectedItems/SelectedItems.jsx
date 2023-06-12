import React from 'react'
import SelectedItem from "./SelectedItem/SelectedItem.jsx";
import {items, STAGES} from "../../App.jsx";

const SelectedItems = ({main, snack, drink, handleRemove}) => {
    return (
        <div className="selectedItems">
            <SelectedItem item={main} title={items[STAGES.MAIN].title} handleRemove={handleRemove} stage={STAGES.MAIN}/>
            <SelectedItem item={snack} title={items[STAGES.SNACK].title} handleRemove={handleRemove} stage={STAGES.SNACK}/>
            <SelectedItem item={drink} title={items[STAGES.DRINK].title} handleRemove={handleRemove} stage={STAGES.DRINK}/>
        </div>
    )
}

export default SelectedItems
