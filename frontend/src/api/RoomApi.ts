import axios from "axios";

/**서버 ip 주소 */
export const ipAddress = "http://modooseoul.online:8081";
// export const ipAddress = "http://70.12.108.93:8080";
/**api 기본 주소 */
const apiAddress = `${ipAddress}/api/v1`;

/**방 생성 및 방 정보 요청 */
export const createRoom = async () => {
  try {
    const { data } = await axios.post(`${apiAddress}/rooms`);
    console.log("createRoom");
    console.log("Room Info: ", data);

    return data;
  } catch (error) {
    console.error("서버 오류: Error fetching Room Info:", error);
    throw error;
  }
};

/**방 참가 요청 */
export const joinRoom = async (
  nickname: string,
  roomId: string | undefined
) => {
  try {
    const { data } = await axios.post(`${apiAddress}/players/join`, {
      nickname: nickname,
      roomId: roomId,
    });
    console.log("joinRoom");
    console.log("response: ", data);

    return data;
  } catch (error) {
    console.error("서버 오류: Error fetching joinRoom response:", error);
    throw error;
  }
};
