console.log('Start of the script');
const oracledb = require('oracledb');
const fs = require('fs');

const dbConfig = {
  user: 'carrot',
  password: 'carrot',
  connectString: 'localhost:1521/XE',
};

async function insertData() {
  try {
    // C:\Users\SAY\Desktop\파이널프로젝트
    const filePath = 'C:\\Users\\user1\\Downloads\\pensions.json'; // 'C:\Users\user1\Downloads\\fension.json';
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const startIndex = jsonData.indexOf('[');
    const endIndex = jsonData.lastIndexOf(']');

    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
      const filteredJsonData = jsonData.substring(startIndex, endIndex + 1);
      let data;

      try {
        data = JSON.parse(filteredJsonData);
      } catch (parseError) {
        console.error('JSON 파싱 잘못됨:', parseError.message);
        return;
      }

      const connection = await oracledb.getConnection(dbConfig);

      for (const item of data) {
        try {
          if (item.명칭 && item['숙박 종류']) {
            const query = `
              INSERT INTO pensions (NAME, CONTACT, ADDRESS, LATITUDE, LONGITUDE, INTRODUCTION, SCALE, ROOM_NUM, PARKING, COOK, CHECK_IN, CHECK_OUT, HOMEPAGE, DININGHALL, AMENITIES, SEMINAR, SPORTS, SAUNA, BEAUTY, KARAOKE, BARBEQUE, CAMPFIRE, PC_ROOM, PUBLIC_SHOWER, DETAIL_INFO, REFUND)
              VALUES (:NAME, :CONTACT, :ADDRESS, :LATITUDE, :LONGITUDE, :INTRODUCTION, :SCALE, :ROOM_NUM, :PARKING, :COOK, :CHECK_IN, :CHECK_OUT, :HOMEPAGE, :DININGHALL, :AMENITIES, :SEMINAR, :SPORTS, :SAUNA, :BEAUTY, :KARAOKE, :BARBEQUE, :CAMPFIRE, :PC_ROOM, :PUBLIC_SHOWER, :DETAIL_INFO, :REFUND)
            `;

            const binds = {
                NAME: item.명칭,
                CONTACT: item.전화번호 || '',
                ADDRESS: item.주소 || '',
                LATITUDE: item.위도 || '',
                LONGITUDE: item.경도 || '',
                INTRODUCTION: item.개요 || '',
                SCALE: item.규모 || '',
                ROOM_NUM: item['객실 수'] || '',
                PARKING: item['주차 가능'] || '',
                COOK: item['조리 가능'] || '',
                CHECK_IN: item.체크인 || '',
                CHECK_OUT: item.체크아웃 || '',
                HOMEPAGE: item.홈페이지 || '',
                DININGHALL: item.식음료장 || '',
                AMENITIES: item['부대 시설'] || '',
                SEMINAR: item.세미나 || '',
                SPORTS: item.스포츠시설 || '',
                SAUNA: item.사우나실 || '',
                BEAUTY: item['뷰티 시설'] || '',
                KARAOKE: item.노래방 || '',
                BARBEQUE: item.바베큐장 || '',
                CAMPFIRE: item.캠프화이어 || '',
                PC_ROOM: item['공용 PC실'] || '',
                PUBLIC_SHOWER: item['공용 샤워실'] || '',
                DETAIL_INFO: item.상세정보 || '',
                REFUND: item.환불규정 || ''
            };

            await connection.execute(query, binds, { autoCommit: true });
          }
        } catch (insertError) {
          console.error('데이터 넣을 수 없음:', insertError.message);
        }
      }

      console.log('데이터 넣기 성공.');

      await connection.close();
    } else {
      console.error('JSON 포멧이 잘못됨.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

insertData();