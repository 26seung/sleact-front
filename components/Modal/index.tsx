import React, { FC, useCallback } from "react";
import { CloseModalButton, CreateModal } from "./style";

// 타입스크립트 경우 props 를 적어주어야 한다.
interface Props {
    show: boolean;
    onCloseModal: () => void;
}
const Modal: FC<Props> = ({show, children, onCloseModal}) => {
    const stopPropagation = useCallback((e)=> {
        e.stopPropagation();
    },[]);

    if(!show){
        return null;
    }

    return (
        <CreateModal onClick={onCloseModal}>
            <div onClick={stopPropagation}>
                <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
                {children}
            </div>
        </CreateModal>
    )
};

export default Modal;