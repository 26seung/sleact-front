### 환경설정

##### DB설정

Docker 사용하여 DB 설정 진행 하였음

    docker run --platform linux/amd64 -p 3306:3306 --name sleact -e MYSQL_ROOT_PASSWORD=1234 -d mysql

사용 시 MYSQL 사용 가능 하며,

    docker run --platform linux/amd64 -p 3306:3306 --name sleact -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=sleact -e MYSQL_USER=seung -e MYSQL_PASSWORD=1234 -d mysql
 사용 시 `sleact` DB까지 구축 할 수 있다.

 그 후 back 폴더 로 이동 하여 npm i 커맨드 사용

 

#### Hooks - useInput

useInput 를 이용하여 중복되는 코드들을 줄여 줄 수 있다.
useState 사용 시 `onChangEmail` 같은 동일한 코드를 나열하게 되는데 이를 재거할 수 있다.

타입스크립트 사용 시 타입선언을 해주어야 하는데, (any, 제네릭타입 <T>) 사용방법이 있다.
any 사용 시 에러는 나지 않지만, <T>사용을 권장  - any 사용시 return 에 같은 타입을 반환하지 않기 때문 


#### SWR
로그인 시 정보를 저장하기 위해서 `리덕스` 가 필요하다.
그외에 `컨텍스트 API / SWR` 등도 사용이 가능하다
state 사용 시에는 해당 컴포넌트에만 저장하는 개념 , 모든 전역 컴포넌트에 활용하기 위해 `리덕스` 같은 사용이 필요하다.

SWR 은 기본적으로 GET 요청을 저장하는 개념이다.
