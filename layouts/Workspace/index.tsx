import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FC, useCallback, useState, VFC } from "react";
import { Redirect, Route, Switch, useParams } from "react-router";
import useSWR from "swr";
import { Header, ProfileImg, RightMenu, WorkspaceWrapper, Workspaces, Channels, Chats, MenuScroll, WorkspaceName, ProfileModal, LogOutButton, WorkspaceButton, AddButton, WorkspaceModal } from "./style";
import gravatar from 'gravatar';
import loadable from "@loadable/component";
import Menu from "@components/Menu";
import { Link } from "react-router-dom";
import { IChannel, IUser } from "@typings/db";
import { Button, Input, Label } from "@pages/SignUp/style";
import useInput from "@hooks/useInput";
import Modal from "@components/Modal";
import CreateChannelModal from "@components/CreateChannelModal";
import InviteChannelModal from "@components/InviteChannelModal";
import InviteWorkspaceModal from "@components/InviteWorkspaceModal";
import ChannelList from "@components/ChannelList";
import DMList from "@components/DMList";

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
                                            // Channel 폴더내에 Workspace로 감싼 부분이 children 이 된다.
const Workspace: VFC = () => {     // children 을 안쓰는 컴포넌트는 VFC 사용 , 사용하는 컴포넌트는 FC 사용

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

    // 
    const {data: userData, error, mutate} = useSWR<IUser|false>('/api/users', fetcher,{
        dedupingInterval: 30000      // 캐시의 유지기간 , 2초동안은 1번만 요청이 감  , 서버에 요청 부담을 줄일수 있음
    });
    const { workspace } = useParams<{ workspace: string }>();
    const {data: channelData} = useSWR<IChannel[]>(userData? `/api/workspaces/${workspace}/channels`:null, fetcher);
    const {data: memberData } = useSWR<IUser[]>(
        userData ? `/api/workspaces/${workspace}/members` : null,
        fetcher,
      );
    //

    const onLogout = useCallback(()=> {
        axios.post("/api/users/logout",
        null,{
            withCredentials: true,      // 쿠키를 서로 공유 하기 위해서 삽입
        })
        .then((res)=>{
            console.log("Workspace onLogout (res.data) : " + res.data)
            mutate(false,false);       // user 정보가 false로 변경 , mutate 사용 시 
        });
    },[])

    const onCloseUserProfile = useCallback((e) => {
        e.stopPropagation();        // 중복 Click 요청을 하지 않기 위해서 사용
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
    const onCreateWorkspace = useCallback((e) => {
        e.preventDefault();
        if(!newWorkspace || !newWorkspace.trim()) return;
        if(!newUrl || !newUrl.trim()) return;
        axios.post("/api/workspaces",{
            workspace : newWorkspace,
            url : newUrl,
        },{
            withCredentials: true,
        })
        .then((res)=> {
            mutate(res.data);   // mutate 해주어야 캐시를 전달 함으로 바로 값이 변경진행 됨 , 없으면 새로고침 해야함
            setShowCreateWorkspaceModal(false);
            setNewWorkspace('');
            setNewUrl('');
        })
        .catch((error)=> {
            console.log(error);
        })
    },[newWorkspace,newUrl]);

    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false);
        setShowCreateChannelModal(false);
        setShowInviteWorkspaceModal(false);
        setShowInviteChannelModal(false);
    },[])
    const toggleWorkspaceModal = useCallback(()=>{
        setShowWorkspaceModal((prev)=>!prev);
    },[])
    const onClickAddChannel = useCallback(()=>{
        setShowCreateChannelModal(true)
    },[])
    const onClickInviteWorkspace = useCallback(()=>{
        setShowInviteWorkspaceModal(true)
    },[])

    // console.log("userData: "+ JSON.stringify(userData))
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
                        {userData?.Workspaces?.map((ws)=> {
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
                    <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
                    <MenuScroll>
                        <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{top:95, left:80}}>
                            <WorkspaceModal >
                                <h2>Sleact</h2>
                                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                                <button onClick={onClickAddChannel}>채널 만들기</button>
                                <button onClick={onLogout}>로그아웃</button>
                            </WorkspaceModal>
                        </Menu>
                        <ChannelList />
                        <DMList />
                    </MenuScroll>
                </Channels>
                <Chats>
                    {/* {children} */}
                    <Switch>
                        <Route path={"/workspace/:workspace/channel/:channel"} component={Channel} />
                        <Route path={"/workspace/:workspace/dm/:id"} component={DirectMessage} />
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
            <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal} setShowCreateChannelModal={setShowCreateChannelModal}/>
            <InviteWorkspaceModal show={showInviteWorkspaceModal} onCloseModal={onCloseModal} setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}/>
            <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} setShowInviteChannelModal={setShowInviteChannelModal}/>
        </div>
    )
};

export default Workspace;