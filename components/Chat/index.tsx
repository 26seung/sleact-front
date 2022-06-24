import { ChatWrapper } from '@components/Chat/style';
import { IDM, IChat } from '@typings/db';
import React, { VFC, memo, useMemo } from 'react';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';

interface Props {
  data: IDM | IChat;
}

// const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';
const Chat: VFC<Props> = ({ data }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const user = 'Sender' in data ? data.Sender : data.User;


//  안의 내용을 찾겠다는 문법 , g가 붙으면 모두 찾겠다,  \ (이스케이프) 는 무력화\
// \d 는 숫자 , + 는 1개이상 , ? 는 0개 이상 , g는 모두찾기 , +?는 최대한 조금
// @[이유승]12](7)

const result = useMemo(()=> regexifyString({
  input: data.content,
  pattern: /@\[(.+?)\]\((\d+?)\)|\n/g,
  decorator(match,index){
    const arr = match.match(/@\[(.+?)\]\((\d+?)\)/)!;
    if(arr){
      return(
        <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
          @{arr[1]}
        </Link>
      )
    }
    return <br key={index} />
  }            
}),[data.content]);

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);