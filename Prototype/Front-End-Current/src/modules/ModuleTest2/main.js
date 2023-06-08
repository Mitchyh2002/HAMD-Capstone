import React, {useState, useEffect} from "react";

export default function Test2(){
    const [time, setTime] = useState();
    const [hello, setHello] = useState();

    const getTime = () =>{
       const data = fetch("http://localhost:5000/time").json;
       console.log(time);
        console.log(data);
        setTime(data);
    } 

    const getHello = () =>{
       // const data = fetch("http://localhost:5000/hello");
        console.log(data);
        setHello(data);
    }

    useEffect(() => {
        getTime();
        //getHello();
    })



    return (<h1>Another Test</h1>)
}
