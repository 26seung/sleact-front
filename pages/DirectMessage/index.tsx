// import Workspace from "@layouts/Workspace";
import React from "react";
import { Container, Header } from "./style";
import gravatar from 'gravatar';
import useSWR from "swr";
import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";

// workspace 의 children 설정
const DirectMessage = () => {
    const {workspace, id } = useParams<{workspace: string; id:string}>();
    const {data: userData, error, mutate} = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher,{
        dedupingInterval: 30000      // 캐시의 유지기간 , 2초동안은 1번만 요청이 감  , 서버에 요청 부담을 줄일수 있음
    });
    const {data:myData} = useSWR(`/api/users`, fetcher)

    if(!userData || !myData){
        return null;
    }

    return (  
        <Container>
            <Header>
                <img src={gravatar.url(userData.email,{s:'24px', d:'retro'})} alt={userData.nickname} />
                <span> {userData.nickname}</span>
            </Header>
            <ChatList />
            <ChatBox chat="" />
        </Container>
    )
};

export default DirectMessage;