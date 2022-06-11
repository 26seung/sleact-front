import Modal from "@components/Modal";
import useInput from "@hooks/useInput";
import { Button, Input, Label } from "@pages/SignUp/style";
import { IChannel, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FC, useCallback, VFC } from "react";
import { useParams } from "react-router";
import useSWR from "swr";

// 타입스크립트 경우 props 를 적어주어야 한다.
// children 안쓰면 VFC
interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowCreateChannelModal: (flag: boolean) => void;
}
const CreateChannelModal: VFC<Props> = ({show, onCloseModal, setShowCreateChannelModal}) => {
    const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
    const {workspace, channel} = useParams<{workspace:string; channel:string}>();

    //
    const {data: userData, error, mutate} = useSWR<IUser|false>('http://localhost:3095/api/users', fetcher,{
        dedupingInterval: 30000      // 캐시의 유지기간 , 30초동안은 1번만 요청이 감  , 서버에 요청 부담을 줄일수 있음
    });
    const {data: channelData, mutate: mutateChannel} = useSWR<IChannel[]>(userData? `http://localhost:3095/api/workspaces/${workspace}/channels`:null, fetcher);
    //

    const onCreateChannel = useCallback((e)=> {
        e.preventDefault();
        axios.post(
          `http://localhost:3095/api/workspaces/${workspace}/channels`,
        {name: newChannel},
        {withCredentials: true}
        ).then((res)=>{
          setShowCreateChannelModal(false);
          mutateChannel();
          setNewChannel('');  
        }).catch((error)=>{
            console.dir(error)
        });
    },[newChannel]);

    return (
        <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateChannel}>
          <Label id="channel-label">
            <span>채널</span>
            <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    );
  };

export default CreateChannelModal;