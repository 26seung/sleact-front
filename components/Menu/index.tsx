import React, { CSSProperties, FC, useCallback } from "react";
import { CloseModalButton, CreateMenu } from "./style";

// 타입스크립트 경우 props 를 적어주어야 한다.
interface Props {
    show: boolean;
    onCloseModal: (e:any) => void;
    style: CSSProperties;
    closeButton?: boolean;
}
const Menu: FC<Props> = ({children, style, show, onCloseModal, closeButton}) => {
    const stopPropagation = useCallback((e)=> {
        e.stopPropagation();
    },[])
    return (
        <CreateMenu onClick={onCloseModal}>
            <div style={style} onClick={stopPropagation}>
                {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
                {children}
            </div>
        </CreateMenu>
    )
};
Menu.defaultProps = {
    closeButton: true,
};

export default Menu;