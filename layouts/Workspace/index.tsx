import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FC, useCallback, useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import useSWR from "swr";
import { Header, ProfileImg, RightMenu, WorkspaceWrapper, Workspaces, Channels, Chats, MenuScroll, WorkspaceName, ProfileModal, LogOutButton, WorkspaceButton, AddButton } from "./style";
import gravatar from 'gravatar';
import loadable from "@loadable/component";
import Menu from "@components/Menu";
import { Link } from "react-router-dom";
import { IUser } from "@typings/db";
import { Button, Input, Label } from "@pages/SignUp/style";
import useInput from "@hooks/useInput";
import Modal from "@components/Modal";

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
                                            // Channel 폴더내에 Workspace로 감싼 부분이 children 이 된다.
const Workspace: FC = ({children}) => {     // children 을 안쓰는 컴포넌트는 VFC 사용 , 사용하는 컴포넌트는 FC 사용

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

    const {data: userData, error, mutate} = useSWR<IUser|false>('http://localhost:3095/api/users', fetcher,{
        dedupingInterval: 30000      // 캐시의 유지기간 , 2초동안은 1번만 요청이 감  , 서버에 요청 부담을 줄일수 있음
    });
    const onLogout = useCallback(()=> {
        axios.post("http://localhost:3095/api/users/logout",
        null,{
            withCredentials: true,      // 쿠키를 서로 공유 하기 위해서 삽입
        })
        .then((res)=>{
            console.log("Workspace onLogout (res.data) : " + res.data)
            mutate(false,false);       // user 정보가 false로 변경 , mutate 사용 시 
        });
    },[])

    const onCloseUserProfile = useCallback((e) => {
        e.stopPropagation();
        setShowUserMenu(false)
        console.log("close : " + showUserMenu)
    },[]);
    const onClickUserProfile = useCallback(() => {
        setShowUserMenu(prev => !prev)
        console.log("click : " + showUserMenu)
    },[]);
    const onClickCreateWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true);
    },[])
    const onCreateWorkspace = useCallback(() => {
        
    },[])
    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false);
    },[])

    if (!userData) {
        return <Redirect to="/login" />
    }

    return(
        <div>
            <Header>
                test1
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(userData.nickname,{size:'28px',default:'retro'})} alt={userData.nickname}/>
                        {showUserMenu && (
                            <Menu style={{right:0,top:38}} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                            <ProfileModal>
                                <img src={gravatar.url(userData.nickname,{size:'36px',default:'retro'})} />
                                <div>
                                    <span id="profile-name">{userData.nickname}</span>
                                    <span id="profile-active">Active</span>
                                </div>
                            </ProfileModal>
                            <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                        </Menu>
                        )}
                    </span>
                </RightMenu>
            </Header>
            {/* <button onClick={onLogout}>로그아웃</button> */}

            <WorkspaceWrapper>
                    <Workspaces>
                        {userData.Workspaces.map((ws)=> {
                            return (
                                <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                                    <WorkspaceButton>
                                        {ws.name.slice(0,1).toUpperCase()}
                                    </WorkspaceButton>
                                </Link>
                            );
                        })}
                        <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                    </Workspaces>
                <Channels>
                    <WorkspaceName>Sleact</WorkspaceName>
                    <MenuScroll>MenuScroll</MenuScroll>
                </Channels>
                <Chats>
                    {/* {children} */}
                    <Switch>
                        <Route path={"/workspace/channel"} component={Channel} />
                        <Route path={"/workspace/dm"} component={DirectMessage} />
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>워크스페이스 이름</span>
                        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
                    </Label>
                    <Label id="workspace-url-label">
                        <span>워크스페이스 URL</span>
                        <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
                    </Label>
                    <Button type="submit">생성하기</Button>
                </form>
            </Modal>
        </div>
    )
};

export default Workspace;