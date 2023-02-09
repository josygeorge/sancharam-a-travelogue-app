import React from 'react'
import { createPortal } from 'react-dom'
import './Backdrop.css'

//
//
const Backdrop = () => {
    /* createPortal lets you render some children into a different part of the DOM. */
    return createPortal(
        <div className="backdrop" onClick={props.onClick}></div>,
        document.getElementById('backdrop-hook')
    )
}

export default Backdrop