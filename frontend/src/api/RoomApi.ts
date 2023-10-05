import axios from 'axios';
import { CompatClient } from '@stomp/stompjs';

/**서버 ip 주소 */
export const ipAddress = "https://modooseoul.online";
// export const ipAddress = "http://modooseoul.online:8081";
// export const ipAddress = "http://70.12.108.93:8080";
// export const ipAddress = "http://10.96.10.136:8080";
// export const ipAddress = "http://70.12.247.63:8080";
/**api 기본 주소 */
const apiAddress = `${ipAddress}/api/v1`;

/**방 생성 및 방 정보 요청 */
export const createRoom = async () => {
	try {
		const { data } = await axios.post(`${apiAddress}/games`);
		console.log('createRoom');
		console.log('Room Info: ', data);

		/* data 형태 예시:
      {
        "message": "success",
        "data": {
            "id": "0b16c0e2-db7a-4eab-891c-09cbc04b8054",
            "players": null,
            "isStart": false,
            "createDate": "2023-09-11T16:15:01.1458221"
        }
      }
    */

		return data;
	} catch (error) {
		console.error('서버 오류: Error fetching Room Info:', error);
		throw error;
	}
};

/**방 참가 요청 */
export const joinRoom = async (
	nickname: string,
	/**pk값 받아오는거라 undefined일 수 있어서 타입을 이렇게 설정함 */
	gameId: string | undefined
) => {
	try {
		const { data } = await axios.post(`${apiAddress}/players/join`, {
			nickname: nickname,
			gameId: gameId,
		});
		console.log('joinRoom');
		console.log('response: ', data);

		/* data 형태 예시:

      {
        "message": "success",
        "data": {
            "id": "2e1f3f32-4935-4d58-9eea-28560d41d4c0"
        }
      }
    */

		return data;
	} catch (error) {
		console.error('서버 오류: Error fetching joinRoom response:', error);
		throw error;
	}
};

/**대기방에서 구독된 채널들 끊기 */
export const unsubscribeRoom = (
	socketClient: CompatClient | null,
	playerId: string,
	gameId: string
) => {
	if (socketClient !== null) {
		socketClient.unsubscribe(`/receive/game/join/${gameId}`);
		socketClient.unsubscribe(`/receive/game/ready/${playerId}`);
	}
};
