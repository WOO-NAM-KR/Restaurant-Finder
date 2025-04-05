const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '43.200.229.248',
  user: 'root',
  password: '9600', // ← 여기에 실제 비밀번호 입력
  database: 'Enrolment'   // ← 여기에 실제 데이터베이스 이름 입력
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    return;
  }
  console.log('MySQL 연결 성공!');

  connection.query('SELECT NOW() AS now', (err, results) => {
    if (err) {
      console.error('쿼리 실패:', err.message);
    } else {
      console.log('현재 시간:', results[0].now);
    }

    connection.end();
  });
});
