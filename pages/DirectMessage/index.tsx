// import Workspace from "@layouts/Workspace";
import React, { useCallback } from "react";
import { Container, Header } from "./style";
import gravatar from 'gravatar';
import useSWR from "swr";
import { IDM, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";
import axios from "axios";

// workspace 의 children 설정
const DirectMessage = () => {
    const {workspace, id } = useParams<{workspace: string; id:string}>();
    const {data: userData, error, mutate} = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
    const {data:myData} = useSWR(`/api/users`, fetcher)

    const [chat, onChangeChat, setChat] = useInput('');
    const {data:chatData, mutate:mutateChat} = useSWR<IDM[]>(
        `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
        fetcher,
    )
    const onSubmitForm = useCallback((e)=>{
        e.preventDefault();

        if (chat?.trim()){
            axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{
                content: chat
            })
            .then(()=>{
                mutateChat(e.data,false)
                setChat('');
            })
            .catch(console.error)
        }
    },[chat])


    if(!userData || !myData){
        return null;
    }

    return (  
        <Container>
            <Header>
                <img src={gravatar.url(userData.email,{s:'24px', d:'retro'})} alt={userData.nickname} />
                <span> {userData.nickname}</span>
            </Header>
            <ChatList chatData={chatData}/>
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
        </Container>
    );
};

export default DirectMessage;