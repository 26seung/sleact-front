import React from 'react';
import loadable from '@loadable/component';
import { Redirect, Route, Switch } from 'react-router-dom';

const LogIn = loadable(() => import('@pages/Login'));   // 코드 스플리팅 , 페이지가 한번에 로드되는것을 방지하여 필요할때만 불러와 사용이 가능
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
  <Switch>
    <Redirect exact path='/' to="/login" />
    <Route path={"/login"} component={LogIn} />
    <Route path={"/signUp"} component={SignUp} />
    <Route path={"/workspace"} component={Workspace} />
  </Switch>
  );
};

export default App;
