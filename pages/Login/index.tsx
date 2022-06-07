import useInput from '@hooks/useInput';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/style';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
  
    const {data, error, mutate} = useSWR('http://localhost:3095/api/users', fetcher);
    const [logInError, setLogInError] = useState(false);
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const onSubmit = useCallback(
      (e) => {  
        e.preventDefault();
        setLogInError(false);
        axios
          .post(
            'http://localhost:3095/api/users/login',
            { email, password },
            {
              withCredentials: true,        //  Back 과 Front 사이에서 쿠키를 주고받을 수 있음
            },
          )
          .then((res) => {
              console.log("login Data1 : " + res.data)
              mutate(res.data,false);     // 성공 시 useSWR 사용됨      , true:optimisic ui / false:서버에 보내지 않고 그대로 로컬정보를 정수
          })
          .catch((error) => {
            setLogInError(error.response?.data?.statusCode === 401);
          });
      },
      [email, password],
    );
  
    if (data){
        return (<Redirect to="/workspace/channel" />);
    };
    console.log("Login data2 : " + data)
  
    // console.log(error, userData);
    // if (!error && userData) {
    //   console.log('로그인됨', userData);
    //   return <Redirect to="/workspace/sleact/channel/일반" />;
    // }
  
    return (
      <div id="container">
        <Header>Sleact</Header>
        <Form onSubmit={onSubmit}>
          <Label id="email-label">
            <span>이메일 주소</span>
            <div>
              <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
            </div>
          </Label>
          <Label id="password-label">
            <span>비밀번호</span>
            <div>
              <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
            </div>
            {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
          </Label>
          <Button type="submit">로그인</Button>
        </Form>
        <LinkContainer>
          아직 회원이 아니신가요?&nbsp;
          <Link to="/signup">회원가입 하러가기</Link>
        </LinkContainer>
      </div>
    );
  };

export default LogIn;