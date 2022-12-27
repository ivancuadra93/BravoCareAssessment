import React, { useEffect, useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Card from 'react-bootstrap/Card';
import './ShiftCard.css';

const ShiftCard = ({ disabled, addChecks, shiftKey, shiftData }) => {
  const [checked, setChecked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      addChecks(checked, shiftData.shift_id);
    } else {
      setLoaded(true);
    }
  }, [checked]);

  const formattedTime = time => {
    // console.log(time);
    let timeArr = time.split(':');
    timeArr.pop();
    let timeSuffix = ''; // used for am or pm

    // add pm/am
    if (timeArr[0] > 11 && timeArr[0] < 24) {
      timeSuffix = 'PM';
    } else {
      timeSuffix = 'AM';
    }

    // convert 24 hh to 12 hh
    timeArr[0] = ((Number(timeArr[0]) + 11) % 12) + 1;

    return `${timeArr.join(':')}  ${timeSuffix}`;
  };

  return (
    <ToggleButton
      className="toggle-button"
      id={`${shiftKey}`}
      type={'checkbox'}
      variant={'primary'}
      disabled={checked ? false : disabled}
      checked={checked}
      onChange={e => setChecked(e.currentTarget.checked)}
      style={{ padding: 0, width: '100%', marginTop: '1rem' }}>
      <Card bg={'transparent'}>
        <Card.Body>
          <Card.Text>{shiftData.facility_name}</Card.Text>
          <Card.Text>{new Date(shiftData.shift_date).toDateString()}</Card.Text>
          <Card.Text>
            {`${formattedTime(shiftData.start_time)} - ${formattedTime(
              shiftData.end_time,
            )}`}
          </Card.Text>
        </Card.Body>
      </Card>
    </ToggleButton>
  );
};

export default ShiftCard;
