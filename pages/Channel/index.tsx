import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";
import Workspace from "@layouts/Workspace";
import axios from "axios";
import React, { useCallback } from "react";
import { Container, Header } from "./style";

// workspace 의 children 설정
const Channel = () => {

    const [chat, onChangeChat,setChat] = useInput('');
    const onSubmitForm = useCallback((e)=>{
        e.preventDefault();
        setChat('');
        console.log("submit")
    },[])

    return (
        <Container>
            <Header>
              채널
            </Header>
            {/* <ChatList /> */}
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
        </Container>
    // <Workspace>     
    //     <div>
    //         로그인에 성공하였습니다.
    //     </div>
    // </Workspace>
    )
};

export default Channel;