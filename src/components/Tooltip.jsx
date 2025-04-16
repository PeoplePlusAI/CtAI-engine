import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Popover } from 'react-bootstrap';


const CustomTooltip = ({ tooltip_content }) => {
    return (
        <OverlayTrigger
            key="top"
            placement="bottom"
            overlay={
                <Popover id="popover-basic">
                    <Popover.Body>{tooltip_content}</Popover.Body>
                </Popover>
            }
        >
            <span className="cup ms-1">
            ℹ️
            </span>
        </OverlayTrigger>
    )
}

export default CustomTooltip