### 환경설정

##### DB설정

Docker 사용하여 DB 설정 진행 하였음

    docker run --platform linux/amd64 -p 3306:3306 --name sleact -e MYSQL_ROOT_PASSWORD=1234 -d mysql

사용 시 MYSQL 사용 가능 하며,

    docker run --platform linux/amd64 -p 3306:3306 --name sleact -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=sleact -e MYSQL_USER=seung -e MYSQL_PASSWORD=1234 -d mysql
 사용 시 `sleact` DB까지 구축 할 수 있다.

 그 후 back 폴더 로 이동 하여 npm i 커맨드 사용
 
---

#### Hooks - useInput

useInput 를 이용하여 중복되는 코드들을 줄여 줄 수 있다.
useState 사용 시 `onChangEmail` 같은 동일한 코드를 나열하게 되는데 이를 재거할 수 있다.

타입스크립트 사용 시 타입선언을 해주어야 하는데, (any, 제네릭타입 <T>) 사용방법이 있다.
any 사용 시 에러는 나지 않지만, <T>사용을 권장  - any 사용시 return 에 같은 타입을 반환하지 않기 때문 

---

#### SWR

로그인 시 정보를 저장하기 위해서 `리덕스` 가 필요하다.
그외에 `컨텍스트 API / SWR` 등도 사용이 가능하다
state 사용 시에는 해당 컴포넌트에만 저장하는 개념 , 모든 전역 컴포넌트에 활용하기 위해 `리덕스` 같은 사용이 필요하다.

SWR 은 기본적으로 GET 요청을 저장하는 개념이다.
POST 도 사용은 가능하다. 

util 폴더내 fetcher 파일내 함수 `fetcher2` 식으로 추가 생성하여 사용 가능

```
const fetcher2 = (url: string) => 
    axios.post(url,{
        withCredentials: true
    })
    .then((response) => response.data);
```

서버에 요청을 보내는 것을 자제하려면,
`dedupingInterval:1000` 기능을 사용하면 서버에 요청을 보내는것이 아닌 캐시를 사용

---

#### 중첩라우트 사용

기존 Channel 폴더내의 index.tsx 경우
```
import Workspace from "@layouts/Workspace";
import React from "react";

const Channel = () => {
    return (
    <Workspace>     
        <div>
            로그인에 성공하였습니다.
        </div>
    </Workspace>
    )
};

export default Channel;
```
`<Workspace>` 로 감싸주고 `{children}`으로 사용하는 방법과

`{children}` 자리에 `<Switch>` 내부 `<Route>`를 사용하여 직접 선택하게 하는 방법이 있다.
사용 시 주소가 계층적인 구조를 가져야 한다. (App.)안에 사용한 주소를 포함해서 경로 설정 해야 함

---

#### 메뉴만들기

-  && 사용시 값이 true 면 보이고 false 면 보이지 않는다.
    - A && B 인 경우, A 가 true 면 B 가 표시 되고 false 면 보이지 않는다
- `&times;` 사용시 x 표시 생성

typscript 사용하는 경우 interface 사용하여 props 설정 해주고, 아니라면 defaultprops 기능을 사용하여 준다.

---

#### 라우트 주소 설계

라우트 주소 설계시 
```
<Route path={"/workspace"} component={Workspace} />
<Route path={"/workspace/:workspace"} component={Workspace} />
```

`/:` 사용 하여 모든 값을 받아올 수 있는 파라미터 사용이 가능하며 , 사용 시 그렇지 않은것보다 아래에 위치하여 사용해야 한다.

component 안의 useParams 를 사용하여 파라미터 값들을 받아올수 있다.

---

#### 06.18 *(chatBox 만들기)

채팅은 props 이용하여 전역에서 사용하도록 설정

스크롤 기능은 

    npm i autosize
    npm i --save-dev @types/autosize

이용하여 사용


---

#### 채팅보내기

웹소켓 사용
socket.io 는 리액트와 어울리지 않음
한번 연결되면 전역적인 특징을 가지기 때무에 다른 컴포넌트로 이동하면 연결이 끊어지는 문제가 발생할 수 있음
그렇기 때문에 공통적인 컴포넌트 안에 넣어줄 것 임 (hhok 안에)