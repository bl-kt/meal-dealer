import React from 'react';
import {IconDice6Filled, IconShare, IconTrashFilled} from '@tabler/icons-react'

const Actions = ({handleReset, handleRandomise, handleShare}) => {
    return (
        <div className="actions">
            <button onClick={handleRandomise} className="actionButtonBlue">
                <IconDice6Filled size={16}/>
            </button>
            <button onClick={handleShare} className="actionButtonGrey">
                <IconShare size={16}/>
            </button>
            <button onClick={handleReset} className="actionButtonRed">
                <IconTrashFilled size={16}/>
            </button>
        </div>
    );
};

export default Actions;
