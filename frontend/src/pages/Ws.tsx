// 웹소켓 창의님 코드

// import { useEffect, useState } from "react";
// import axios from "axios";
// import style from "./app.module.css";
// import { Client, Stomp } from "@stomp/stompjs";
// import SockJS from "sockjs-client";

// function App() {
//   const [rooms, setRooms] = useState();
//   const [createNumb, setCreateNumb] = useState();
//   const [content, setContent] = useState([]);
//   const [myClient, setMyClient] = useState();
//   let message = "";
//   let roomnumb;
//   let nickname = "";
//   let whisper = "";
//   let client;

//   useEffect(() => {
//     axios.post("http://localhost:8080/room/create").then((res) => {
//       console.log(res);
//       setCreateNumb(res.data);
//     });
//   }, []);

//   function newRoom() {
//     const newroom = (
//       <div className={style.container}>
//         <div className={style.header}>{createNumb}</div>
//         <div className={style.content}>{content}</div>
//       </div>
//     );
//     setRooms(newroom);
//   }

//   function newMessage(msg) {
//     const newmsg = (
//       <li>
//         {nickname}: {msg}
//       </li>
//     );
//     setContent([...content, newmsg]);
//   }

//   async function join() {
//     axios
//       .post("http://localhost:8080/room/join", {
//         nickname: nickname,
//         roomNumber: roomnumb,
//       })
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     client = Stomp.over(new SockJS("http://localhost:8080/ws"));
//     client.connect({}, (frame) => {
//       console.log("connected: ", frame);

//       client.subscribe(`/receive/${roomnumb}`, (msg) => {
//         console.log("received!: ", msg);
//         newMessage(msg);
//       });

//       console.log(roomnumb);
//       client.publish({
//         destination: `/send/${roomnumb}`,
//         body: JSON.stringify({
//           message: `${nickname}님이 입장하였습니다.`,
//           nickname: nickname,
//         }),
//       });
//     });
//     setMyClient(client);
//   }

//   function send() {
//     if (myClient) {
//       console.log(myClient);
//       console.log(roomnumb);
//       myClient.publish({
//         destination: `/receive/${roomnumb}`,
//         body: JSON.stringify({ message: message, nickname: nickname }),
//       });
//     }
//   }

//   return (
//     <div>
//       <h1>Welcome to Web Chatting</h1>
//       <button className={style.create_button} onClick={newRoom}>
//         create room
//       </button>
//       <div className={style.input_wrap}>
//         <input
//           type="text"
//           placeholder="방번호"
//           onChange={(e) => {
//             roomnumb = e.target.value;
//             console.log(roomnumb);
//           }}
//         ></input>
//         <input
//           type="text"
//           placeholder="닉네임"
//           onChange={(e) => {
//             nickname = e.target.value;
//           }}
//         ></input>
//         <input
//           type="text"
//           placeholder="메세지"
//           onChange={(e) => (message = e.target.value)}
//         ></input>
//         <input
//           type="text"
//           placeholder="귓속말"
//           onChange={(e) => (whisper = e.target.value)}
//         ></input>
//       </div>

//       <button className={style.join_button} onClick={join}>
//         Join room
//       </button>
//       <button className={style.send_button} onClick={send}>
//         send message
//       </button>

//       <div className={style.wrapper}>{rooms}</div>
//     </div>
//   );
// }

// export default App;
