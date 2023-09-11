import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import style from "./WsTest.module.css";
import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// 웹소켓 창희님 코드

export default function WsTest() {
  const [rooms, setRooms] = useState<JSX.Element | null>(null);
  const [roomNumber, setRoomNumber] = useState(0);
  const [content, setContent] = useState<JSX.Element[]>([]);
  const [myClient, setMyClient] = useState<Client | null>(null);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [whisper, setWhisper] = useState("");

  /**방 번호 가져오기 */
  useEffect(() => {
    async () => {
      try {
        const response: AxiosResponse<number> = await axios.post(
          "http://70.12.247.90:8080/room/create"
        );

        console.log(response);
        setRoomNumber(response.data);
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
  }, []);

  function newRoom() {
    const newroom = (
      <div className={style.container}>
        <div className={style.header}>{roomNumber}</div>
        <div className={style.content}>{content}</div>
      </div>
    );
    setRooms(newroom);
  }

  function newMessage(msg: string) {
    const newmsg = (
      <li>
        {nickname}: {msg}
      </li>
    );
    setContent([...content, newmsg]);
  }

  /**방 참가 */
  async function join() {
    try {
      const response = axios.post("http://70.12.247.90:8080/room/join", {
        nickname: nickname,
        roomNumber: roomNumber,
      });
      console.log(response);

      /**웹소켓 생성 */
      const client = Stomp.over(new SockJS("http://70.12.247.90:8080/ws"));

      client.connect({}, () => {
        /**구독 */
        client.subscribe(`/receive/${roomNumber}`, (msg) => {
          console.log("received!: ", msg);
          newMessage(String(msg));
        });

        console.log(roomNumber);

        /**발행 */
        client.publish({
          destination: `/send/${roomNumber}`,
          body: JSON.stringify({
            message: `${nickname}님이 입장하였습니다.`,
            nickname: nickname,
          }),
        });
      });

      setMyClient(client);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**메세지 보내기 */
  function send() {
    if (myClient) {
      console.log(myClient);
      console.log(roomNumber);

      myClient.publish({
        destination: `/receive/${roomNumber}`,
        body: JSON.stringify({ message: message, nickname: nickname }),
      });
    }
  }

  return (
    <div>
      <h1>Welcome to Web Chatting</h1>
      <button className={style.create_button} onClick={newRoom}>
        create room
      </button>
      <div className={style.input_wrap}>
        <input
          type="text"
          placeholder="방번호"
          onChange={(e) => {
            setRoomNumber(() => Number(e.target.value));
            console.log(roomNumber);
          }}
        ></input>
        <input
          type="text"
          placeholder="닉네임"
          onChange={(e) => {
            setNickname(() => e.target.value);
            console.log(nickname);
          }}
        ></input>
        <input
          type="text"
          placeholder="메세지"
          onChange={(e) => {
            setMessage(() => e.target.value);
            console.log(message);
          }}
        ></input>
        <input
          type="text"
          placeholder="귓속말"
          onChange={(e) => {
            setWhisper(() => e.target.value);
            console.log(whisper);
          }}
        ></input>
      </div>

      <button className={style.join_button} onClick={join}>
        Join room
      </button>
      <button className={style.send_button} onClick={send}>
        send message
      </button>

      <div className={style.wrapper}>{rooms}</div>
    </div>
  );
}
