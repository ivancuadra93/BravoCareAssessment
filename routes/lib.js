const getOverlapResult = shifts => {
  let result = {
    overlapMin: null,
    maxThreshold: null,
    exceedsThreshold: null,
  };

  shifts.sort((a, b) => {
    // split start times into [hh, mm, ss]
    const tempStartTimeA = a.start_time.split(':');
    const tempStartTimeB = b.start_time.split(':');

    // get date for each shift date
    let tempDateA = new Date(a.shift_date);
    let tempDateB = new Date(b.shift_date);

    // set the appropriate times for shift dates
    tempDateA.setHours(tempStartTimeA[0], tempStartTimeA[1], tempStartTimeA[2]);
    tempDateB.setHours(tempStartTimeB[0], tempStartTimeB[1], tempStartTimeB[2]);

    // get the milliseconds of the shift dates
    tempDateA = tempDateA.getTime();
    tempDateB = tempDateB.getTime();

    // sort by ascending order
    if (tempDateA < tempDateB) {
      return -1;
    }
    if (tempDateA > tempDateB) {
      return 1;
    }
    return 0;
  });

  // split times into [hh, mm, ss]
  const earlierShiftEndTime = shifts[0].end_time.split(':');
  const laterShiftStartTime = shifts[1].start_time.split(':');

  // convert shift date into Date
  let earlierShiftEndTimeAsMilliseconds = new Date(shifts[0].shift_date);
  let laterShiftStartTimeAsMilliseconds = new Date(shifts[1].shift_date);

  // set the appropriate times for shift dates
  earlierShiftEndTimeAsMilliseconds.setHours(
    earlierShiftEndTime[0],
    earlierShiftEndTime[1],
    earlierShiftEndTime[2],
  );
  laterShiftStartTimeAsMilliseconds.setHours(
    laterShiftStartTime[0],
    laterShiftStartTime[1],
    laterShiftStartTime[2],
  );

  // convert shift dates into milliseconds
  earlierShiftEndTimeAsMilliseconds =
    earlierShiftEndTimeAsMilliseconds.getTime();
  laterShiftStartTimeAsMilliseconds =
    laterShiftStartTimeAsMilliseconds.getTime();

  // check to see if the earlier shift goes into the next day
  const earlierShiftStartTime = shifts[0].start_time.split(':');

  if (earlierShiftStartTime[0] > earlierShiftEndTime[0]) {
    earlierShiftEndTimeAsMilliseconds =
      earlierShiftEndTimeAsMilliseconds + 24 * 60 * 60 * 1000;
  }

  // load result
  result.overlapMin =
    (earlierShiftEndTimeAsMilliseconds - laterShiftStartTimeAsMilliseconds) /
    (60 * 1000);

  if (shifts[0].facility_id === shifts[1].facility_id) {
    result.maxThreshold = 30;
  } else {
    result.maxThreshold = 0;
  }

  if (result.overlapMin > result.maxThreshold) {
    result.exceedsThreshold = true;
  } else {
    result.exceedsThreshold = false;
  }

  return result;
};

const query4 =
  'SELECT \
    J.FACILITY_ID, \
    J.JOB_ID, \
    J.NURSE_TYPE_NEEDED, \
    COUNT(\
      (J.FACILITY_ID, J.JOB_ID)\
    ) AS TOTAL_HIRED, \
    J.TOTAL_NUMBER_NURSES_NEEDED, \
    (\
      J.TOTAL_NUMBER_NURSES_NEEDED - COUNT(\
        (J.JOB_ID, J.FACILITY_ID)\
      )\
    ) AS REMAINING_SPOTS \
  FROM \
    JOBS AS J \
    LEFT JOIN NURSE_HIRED_JOBS AS NHJ ON J.JOB_ID = NHJ.JOB_ID \
    INNER JOIN NURSES AS N ON N.NURSE_ID = NHJ.NURSE_ID \
  WHERE \
    J.NURSE_TYPE_NEEDED = N.NURSE_TYPE \
  GROUP BY \
    J.FACILITY_ID, \
    J.JOB_ID \
  ORDER BY \
    J.FACILITY_ID, \
    J.JOB_ID';

const query5 =
  'SELECT \
      N2.NURSE_ID, \
      N2.NURSE_NAME, \
      N2.NURSE_TYPE, \
      COUNT(N2.NURSE_ID) AS TOTAL_JOBS \
  FROM \
    NURSES AS N2 \
    LEFT JOIN JOBS AS J2 ON N2.NURSE_TYPE = J2.NURSE_TYPE_NEEDED \
    AND J2.JOB_ID IN (\
      SELECT \
        T1.JOB_ID AS T1_JOB_ID \
      FROM \
        (\
          SELECT \
            J.JOB_ID, \
            J.NURSE_TYPE_NEEDED, \
            (\
              J.TOTAL_NUMBER_NURSES_NEEDED - COUNT(\
                (J.JOB_ID, J.FACILITY_ID)\
              )\
            ) AS REMAINING_SPOTS \
          FROM \
            JOBS AS J \
            LEFT JOIN NURSE_HIRED_JOBS AS NHJ ON J.JOB_ID = NHJ.JOB_ID \
            INNER JOIN NURSES AS N ON N.NURSE_ID = NHJ.NURSE_ID \
          WHERE \
            J.NURSE_TYPE_NEEDED = N.NURSE_TYPE \
          GROUP BY \
            J.FACILITY_ID, \
            J.JOB_ID \
          ORDER BY \
            J.JOB_ID\
        ) AS T1 \
      WHERE \
        T1.REMAINING_SPOTS != 0\
    ) \
    AND J2.JOB_ID NOT IN (\
      SELECT \
        NHJ1.JOB_ID AS NHJ1_JOB_ID \
      FROM \
        NURSES AS N1 \
        LEFT JOIN NURSE_HIRED_JOBS AS NHJ1 ON N1.NURSE_ID = NHJ1.NURSE_ID \
      WHERE \
        N1.NURSE_ID = N2.NURSE_ID \
      ORDER BY \
        N1.NURSE_ID\
    ) \
  GROUP BY \
    N2.NURSE_ID \
  ORDER BY \
    N2.NURSE_ID';

const query6 =
  'SELECT \
    DISTINCT N3.NURSE_NAME AS CO_WORKER_NAME \
  FROM \
    NURSES AS N3 \
    INNER JOIN (\
      SELECT \
        NHJ2.NURSE_ID AS NHJ2_NURSE_ID \
      FROM \
        NURSE_HIRED_JOBS AS NHJ2 \
        INNER JOIN (\
          SELECT \
            J2.JOB_ID AS J2_JOB_ID \
          FROM \
            JOBS AS J2 \
            INNER JOIN (\
              SELECT \
                DISTINCT J1.FACILITY_ID AS J1_FACILITY_ID \
              FROM \
                NURSE_HIRED_JOBS AS NHJ1 \
                INNER JOIN JOBS AS J1 ON NHJ1.JOB_ID = J1.JOB_ID \
              WHERE \
                NHJ1.NURSE_ID = ($1)\
            ) AS T1 ON J2.FACILITY_ID = T1.J1_FACILITY_ID\
        ) AS T2 ON NHJ2.JOB_ID = T2.J2_JOB_ID\
    ) AS T3 ON N3.NURSE_ID = T3.NHJ2_NURSE_ID \
    AND N3.NURSE_ID != ($1)';

// alternate query for query6
/* SELECT 
      N2.NURSE_NAME AS CO_WORKER_NAME 
    FROM 
      NURSES AS N2 
    WHERE 
      N2.NURSE_ID IN (
        SELECT 
          DISTINCT NHJ2.NURSE_ID AS NHJ2_NURSE_ID 
        FROM 
          NURSE_HIRED_JOBS AS NHJ2 
        WHERE 
          NHJ2.JOB_ID IN (
            SELECT 
              J2.JOB_ID AS J2_JOB_ID 
            FROM 
              JOBS AS J2 
            WHERE 
              J2.FACILITY_ID IN (
                SELECT 
                  J1.FACILITY_ID AS J1_FACILITY_ID 
                FROM 
                  JOBS AS J1 
                WHERE 
                  JOB_ID IN (
                    SELECT 
                      NHJ1.JOB_ID AS NHJ1_JOB_ID 
                    FROM 
                      NURSE_HIRED_JOBS AS NHJ1 
                    WHERE 
                      NHJ1.NURSE_ID = 1001
                  )
              )
          ) 
          AND NHJ2.NURSE_ID != 1001
      ) */

module.exports = { getOverlapResult, query4, query5, query6 };
