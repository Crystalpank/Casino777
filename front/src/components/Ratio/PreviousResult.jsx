import React from 'react';

const PreviousResult = ({ setColorPrevCoef, coef }) => {
    return (
        <li><div className={`crash-value ${setColorPrevCoef(coef)}`}><span>x{coef}</span></div></li>
    );
}

export default PreviousResult;
