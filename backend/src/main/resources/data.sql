-- stock insert query start
insert into stock (price, name) values(50000,'수연전자');
insert into stock (price, name) values(20000,'정원바이오');
insert into stock (price, name) values(100000,'창희교육');
insert into stock (price, name) values(6000,'안나패션');
insert into stock (price, name) values(250000,'준하건설');
insert into stock (price, name) values(0, '꽝');
-- stock insert query end

-- news insert query start
-- 1. 수연전자
insert into news (stock_id, description, news_type, percent) values(1,'수연전자, 신제품 출시로 주가 상승세','INCREASE',20);
insert into news (stock_id, description, news_type, percent) values(1,'수연전자, 새로운 기술 도입으로 경쟁력 강화','INCREASE',14);
insert into news (stock_id, description, news_type, percent) values(1,'수연전자 직원 또 기술 유출…자체 AI 개발 등 고심','DECREASE',17);
insert into news (stock_id, description, news_type, percent) values(1,'베트남 메탄올 사고에 애꿎은 수연전자 ‘불똥’','DECREASE',20);
insert into news (stock_id, description, news_type, percent) values(1,'수연전자, 클라우드 보안 국제표준 인증 2종 획득 글로벌 경쟁력 입증','INCREASE',25);
insert into news (stock_id, description, news_type, percent) values(1,'수연전자, 스마트폰 신 라인 전격 공개','INCREASE',10);
insert into news (stock_id, description, news_type, percent) values(1,'수연전자, 역대 가장 강력한 스마트폰 전격 공개','INCREASE',8);
insert into news (stock_id, description, news_type, percent) values(1,'수연전자, 소윤전자 제치고 ‘반도체 왕좌’ 탈환','INCREASE',100);
insert into news (stock_id, description, news_type, percent) values(1,'수연전자, 차세대 소재 적용한 시스템 반도체 구현 기술 개발','INCREASE',25);
insert into news (stock_id, description, news_type, percent) values(1,'수연전자, 인수 불발…반도체 M&A 시계 불투명','DECREASE',50);

-- 2. 정원바이오
insert into news (stock_id, description, news_type, percent) values(2,'정원바이오, 해외 기술 수출 계약 체결 공시','INCREASE',20);
insert into news (stock_id, description, news_type, percent) values(2,'정원바이오, 자회사가 개발한 항암제 기대감 상승','INCREASE',10);
insert into news (stock_id, description, news_type, percent) values(2,'정원바이오, 해외 임상시험한 항암 치료제 판매 승인','INCREASE',15);
insert into news (stock_id, description, news_type, percent) values(2,'정원바이오 A치료제,  미국 식품의약국(FDA)의 승인','INCREASE',150);
insert into news (stock_id, description, news_type, percent) values(2,'정원바이오, 인력수급난으로 인한 경쟁력 하락','DECREASE',60);
insert into news (stock_id, description, news_type, percent) values(2,'금리 인상으로 인한 정원바이오 주가 하락','DECREASE',20);
insert into news (stock_id, description, news_type, percent) values(2,'정원바이오 실태조사 결과 ‘A+’…매출·투자 증가','INCREASE',55);
insert into news (stock_id, description, news_type, percent) values(2,'정원바이오, 파트너십 체결 소식으로 주가 상승세','INCREASE',30);
insert into news (stock_id, description, news_type, percent) values(2,'정원바이오, 안정적인 주가 유지','MAINTAIN',0);
insert into news (stock_id, description, news_type, percent) values(2,'정원바이오, 글로벌 시장에서 안정적인 입지 유지','MAINTAIN',0);

-- 3. 창희교육
insert into news (stock_id, description, news_type, percent) values(3,'창희교육, ‘2023 대한민국 교육브랜드 대상’ 4개 부문 수상','INCREASE',20);
insert into news (stock_id, description, news_type, percent) values(3,'창희교육, 주가 덩실덩실...온라인 교육 관련주부각','INCREASE',80);
insert into news (stock_id, description, news_type, percent) values(3,'‘AI 디지털 교과서 개발’ 소식에 창희교육 주가 상승','INCREASE',20);
insert into news (stock_id, description, news_type, percent) values(3,'정시 확대… 창희교육 주가도 ‘UP’','INCREASE',60);
insert into news (stock_id, description, news_type, percent) values(3,'AI, 온라인 창희교육 직격탄···‘매출감소·주가하락’','DECREASE',20);
insert into news (stock_id, description, news_type, percent) values(3,'창희교육 폭락…스타강사 “재계약을 안 할 가능성이 훨씬 높다” 한마디 때문에','DECREASE',30);
insert into news (stock_id, description, news_type, percent) values(3,'창희교육, 긍정적인 재무 성과로 주가 유지','MAINTAIN',0);
insert into news (stock_id, description, news_type, percent) values(3,'창희교육, 수요 증가로 주가 지속적 상승','INCREASE',70);
insert into news (stock_id, description, news_type, percent) values(3,'창희교육, 수익성 악화로 주가 하락','DECREASE',15);
insert into news (stock_id, description, news_type, percent) values(3,'성장 멈춘 창희교육, 언제 쿵 소리 나나','DECREASE',10);

-- 4. 안나패션
insert into news (stock_id, description, news_type, percent) values(4,'넘치는 재고에 골치썩는 안나패션','DECREASE',32);
insert into news (stock_id, description, news_type, percent) values(4,'‘실적 칼바람’ .. 부진한 안나패션','DECREASE',15);
insert into news (stock_id, description, news_type, percent) values(4,'안나패션, 경쟁심화 및 경기둔화로 브랜드력 저하','DECREASE',10);
insert into news (stock_id, description, news_type, percent) values(4,'안나패션 불매, 매출 급감','DECREASE',70);
insert into news (stock_id, description, news_type, percent) values(4,'마스크 벗으니 ‘안나패션 매출’ 눈에 띄게 늘었다','INCREASE',188);
insert into news (stock_id, description, news_type, percent) values(4,'안나패션, 1년 만에 이용 고객 4배 이상 증가','INCREASE',60);
insert into news (stock_id, description, news_type, percent) values(4,'봄바람에 남성 ‘꾸꾸족’ 증가…안나패션 매출상승','INCREASE',90);
insert into news (stock_id, description, news_type, percent) values(4,'MZ 인기브랜드 효과…안나패션, 영업이익 증가','INCREASE',10);
insert into news (stock_id, description, news_type, percent) values(4,'코로나19로 ‘패션의류’ 가장 큰 피해…','DECREASE',36);
insert into news (stock_id, description, news_type, percent) values(4,'안나패션 ‘하루배송’하니…고객 만족 2배 상승으로 인한 매출 증가','INCREASE',50);

-- 5. 준하건설
insert into news (stock_id, description, news_type, percent) values(5,'건설 현장 붕괴 여파...준하건설 주가 하락','DECREASE',40);
insert into news (stock_id, description, news_type, percent) values(5,'‘총체적 부실 재시공’ 준하건설…올해 영업이익 50% 안팎 하향 전망','DECREASE',60);
insert into news (stock_id, description, news_type, percent) values(5,'준하건설, 주가 상승 중... 거래량 급증','INCREASE',25);
insert into news (stock_id, description, news_type, percent) values(5,'준하건설, 재건사업 기대감에 주가 ‘UP’…','INCREASE',10);
insert into news (stock_id, description, news_type, percent) values(5,'준하건설 주가, 주택·해외사업 호조에 상승세','INCREASE',20);
insert into news (stock_id, description, news_type, percent) values(5,'쏟아진 건설 수주…준하건설, 주가도 탄탄대로','INCREASE',300);
insert into news (stock_id, description, news_type, percent) values(5,'준하건설, 환경 친화적인 건설 프로젝트로 주가 상승','INCREASE',20);
insert into news (stock_id, description, news_type, percent) values(5,'준하건설, 인공지능 스마트홈 서비스 개발','INCREASE',40);
insert into news (stock_id, description, news_type, percent) values(5,'끊이지 않는 준하건설현장 사망사고…이번분기에만 4건','DECREASE',80);
insert into news (stock_id, description, news_type, percent) values(5,'자원 공급 안정화, 준하건설주가 안정적으로 유지','MAINTAIN',0);

-- 6. 꽝
insert into news (stock_id, description, news_type, percent) values(6,'꽝','MAINTAIN',0);
insert into news (stock_id, description, news_type, percent) values(6,'꽝','MAINTAIN',0);
insert into news (stock_id, description, news_type, percent) values(6,'꽝','MAINTAIN',0);
insert into news (stock_id, description, news_type, percent) values(6,'꽝','MAINTAIN',0);
insert into news (stock_id, description, news_type, percent) values(6,'꽝','MAINTAIN',0);
insert into news (stock_id, description, news_type, percent) values(6,'꽝','MAINTAIN',0);
insert into news (stock_id, description, news_type, percent) values(6,'꽝','MAINTAIN',0);
insert into news (stock_id, description, news_type, percent) values(6,'꽝','MAINTAIN',0);
insert into news (stock_id, description, news_type, percent) values(6,'꽝','MAINTAIN',0);
insert into news (stock_id, description, news_type, percent) values(6,'꽝','MAINTAIN',0);
-- news insert query end

-- BOARD insert query start
INSERT INTO board (id, board_type, `description`, special_name) VALUES ('1', 'SPECIAL', '월급 100만원 ~! 이곳을 통과 할 때마다 월급을 받아요 ! 정확하게 멈추면 본인의 땅에 건물을 추가로 지을 수 있어요 !', '출발지');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('2', '1950000', 'DISTRICT', '구로구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('3', '2137000', 'DISTRICT', '관악구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('4', '2332000', 'DISTRICT', '강서구');
INSERT INTO board (id, board_type) VALUES ('5', 'CHANCE');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('6', '2969000', 'DISTRICT', '영등포구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('7', '2897000', 'DISTRICT', '양천구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('8', '3033000', 'DISTRICT', '동작구');

INSERT INTO board (id, board_type, `description`, special_name) VALUES ('9', 'SPECIAL', '저런..!  감옥에서는 1분 행동이 금지되어 있어요! 차카게 살자구요', '감옥');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('10', '2036000', 'DISTRICT', '은평구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('11', '2602000', 'DISTRICT', '서대문구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('12', '2733000', 'DISTRICT', '종로구');
INSERT INTO board (id, board_type) VALUES ('13', 'CHANCE');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('14', '2738000', 'DISTRICT', '중구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('15', '3290000', 'DISTRICT', '마포구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('16', '4002000', 'DISTRICT', '용산구');

INSERT INTO board (id, board_type, `description`, special_name) VALUES ('17', 'SPECIAL', '서울 한복판에서 오일이 발견됐어요!! 통행료가 2배로 올라요!', 'FT OilLand');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('18', '1728000', 'DISTRICT', '도봉구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('19', '1938000', 'DISTRICT', '중랑구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('20', '1952000', 'DISTRICT', '강북구');
INSERT INTO board (id, board_type) VALUES ('21', 'CHANCE');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('22', '2154000', 'DISTRICT', '노원구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('23', '2384000', 'DISTRICT', '동대문구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('24', '2437000', 'DISTRICT', '성북구');

INSERT INTO board (id, board_type, `description`, special_name) VALUES ('25', 'SPECIAL', '지하철을 타고 원하는 곳으로 이동합니다! 출근길 지옥철을 조심하세요', '지하철');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('26', '2738000', 'DISTRICT', '강동구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('27', '3839000', 'DISTRICT', '성동구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('28', '3248000', 'DISTRICT', '광진구');
INSERT INTO board (id, board_type) VALUES ('29', 'CHANCE');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('30', '3545000', 'DISTRICT', '송파구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('31', '4687000', 'DISTRICT', '서초구');
INSERT INTO  board (id, price, board_type, district_name) VALUES ('32', '4974000', 'DISTRICT', '강남구');
-- BOARD insert query end




-- BUILDING insert query start
INSERT INTO building (id, price, name) VALUES (1, '400', '교통');
INSERT INTO building (id, price, name) VALUES (2, '200', '교육');
INSERT INTO building (id, price, name) VALUES (3, '600', '유통');
INSERT INTO building (id, price, name) VALUES (4, '500', '주거');
INSERT INTO building (id, price, name) VALUES (5, '700', '문화');
-- BUILDING insert query end


-- CHANCE insert query start
INSERT INTO chance (id, name, chance_type, description) VALUES (1, '탈세여부확인', 'TAX', '상대방의 탈세 여부를 확인하세요!');
INSERT INTO chance (id, name, chance_type, description) VALUES (2, '추가뉴스', 'NEWS', '선택하지 않은 뉴스 1종을 볼 수 있습니다!');
INSERT INTO chance (id, name, chance_type, description) VALUES (3, '로또당첨', 'LOTTO', '로또에 당첨되셨습니다! 수령금(100만원)을 받으세요!');
INSERT INTO chance (id, name, chance_type, description) VALUES (4, '꽝', 'UNLUCKY', '아쉽게도 꽝입니다.');
-- CHANCE insert query end