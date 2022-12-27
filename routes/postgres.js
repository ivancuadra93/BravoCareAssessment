const Pool = require('pg').Pool;
const dotenv = require('dotenv');
const lib = require('./lib');

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

const getQuestionOneShifts = () => {
  return new Promise(function (resolve, reject) {
    const query =
      'SELECT q.*, f.facility_name \
      FROM question_one_shifts as q \
      INNER JOIN facilities as f \
      ON q.facility_id = f.facility_id;';

    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results.rows);
    });
  });
};

const getShiftOverlap = body => {
  return new Promise(function (resolve, reject) {
    const { shift_id_one, shift_id_two } = body;
    const query =
      'SELECT q.*, f.facility_name \
      FROM question_one_shifts as q \
      INNER JOIN facilities as f \
      ON q.facility_id = f.facility_id AND q.shift_id IN ($1, $2)';

    pool.query(query, [shift_id_one, shift_id_two], (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results.rows);
    });
  });
};

const getQuery = body => {
  return new Promise(function (resolve, reject) {
    const { queryNumber } = body;

    let query = '';
    let values = [];

    switch (queryNumber) {
      case 4:
        query = lib.query4;
        break;

      case 5:
        query = lib.query5;
        break;

      case 6:
        query = lib.query6;
        values = [1001];
        break;

      default:
        break;
    }

    pool.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results.rows);
    });
  });
};

module.exports = {
  getQuestionOneShifts,
  getShiftOverlap,
  getQuery,
};
