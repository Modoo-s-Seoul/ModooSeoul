import axios from "axios";

const ipAddress = "http://modooseoul.online:8081/api/v1";

export const createRoom = async () => {
  try {
    const { data } = await axios.post(`${ipAddress}/rooms`);
    console.log("Room Info: ", data);

    return data;
  } catch (error) {
    console.error("서버 오류: Error fetching Room Info:", error);
    throw error;
  }
};

export const joinRoom = async (
  nickname: string,
  roomId: string | undefined
) => {
  try {
    const { data } = await axios.post(`${ipAddress}/players/join`, {
      nickname: nickname,
      roomId: roomId,
    });
    console.log("Room Info: ", data);

    return data;
  } catch (error) {
    console.error("서버 오류: Error fetching Room Info:", error);
    throw error;
  }
};
