import React from "react";
import { Modal, Button } from "react-bootstrap";

const CustomModal = ({ show, handleClose, title, children, header, footer , modalClickOutsideHide }) => {
    return (
        <Modal show={show}
         onHide={handleClose} 
         centered 
         size="lg"
         backdrop={modalClickOutsideHide ? "" : "static"}>
            {
                header !== false && (
                    <Modal.Header closeButton>
                        {title && <Modal.Title>{title}</Modal.Title>}
                    </Modal.Header>
                )}

            <Modal.Body>{children}</Modal.Body>

            {footer !== false && (
                <Modal.Footer>
                    <>
                        <Button variant="success" className="w-100" onClick={handleClose}>
                            Close
                        </Button>
                    </>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default CustomModal;
