
function Modal({isOpen, onClose, children}) {
    return (
        <>
            {isOpen && (
                <div className="right-modal">
                    <button onClick={onClose} className="close-modal-btn">Close</button>
                    {children}
                </div>
            )}
        </>
    )
}

export default Modal;