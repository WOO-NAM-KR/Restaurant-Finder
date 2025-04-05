const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");

const indexDao = require("../dao/indexDao");

exports.readRestaurants = async function (req, res) {
  const { category } = req.query;

  // 유효한 카테고리 목록
  const validCategory = ["한식", "중식", "일식", "양식", "분식", "구이", "회/초밥", "기타"];

  // 카테고리가 있을 경우, 유효성 검사
  if (category && !validCategory.includes(category)) {
    return res.send({
      result: [],
      isSuccess: false,
      code: 400,
      message: "유효한 카테고리가 아닙니다",
    });
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.selectRestaurants(connection, category);

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200,
        message: "식당 목록 요청 성공",
      });
    } catch (err) {
      logger.error(`readRestaurants Query error\n: ${JSON.stringify(err)}`);
      return res.status(500).send({
        isSuccess: false,
        code: 500,
        message: "식당 목록 조회 중 오류 발생",
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readRestaurants DB Connection error\n: ${JSON.stringify(err)}`);
    return res.status(500).send({
      isSuccess: false,
      code: 500,
      message: "DB 연결 오류 발생",
    });
  }
};

// 예시 코드
exports.example = async function (req, res) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.exampleDao(connection);

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200,
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`example Query error\n: ${JSON.stringify(err)}`);
      return res.status(500).send({
        isSuccess: false,
        code: 500,
        message: "쿼리 실행 중 오류 발생",
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`example DB Connection error\n: ${JSON.stringify(err)}`);
    return res.status(500).send({
      isSuccess: false,
      code: 500,
      message: "DB 연결 오류 발생",
    });
  }
};
