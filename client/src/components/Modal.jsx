
function Modal({isOpen, onClose, children}) {
    return (
        <>
            {isOpen && (
                <div className="right-modal">
                    <button onClick={onClose} className="close-modal-btn">X</button>
                    {children}
                </div>
            )}
        </>
    )
}

export default Modal;