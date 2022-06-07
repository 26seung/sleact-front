import axios from "axios";

// {} 체크 중요,,  {} 있으면 데이터 안넘어감
const fetcher = (url: string) => 
    axios.get(url,{
        withCredentials: true
    })
    .then((response) => response.data);


export default fetcher;