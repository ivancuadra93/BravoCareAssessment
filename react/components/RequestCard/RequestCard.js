import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const RequestCard = ({ shiftsChecked }) => {
  const [overlapShifts, setOverlapShifts] = useState(null);

  function getShiftOverlap() {
    fetch('/getShiftOverlap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shift_id_one: shiftsChecked[0],
        shift_id_two: shiftsChecked[1],
      }),
    })
      .then(res => {
        return res.text();
      })
      .then(data => {
        setOverlapShifts(JSON.parse(data));
      });
  }

  function handleClick() {
    if (shiftsChecked.length === 2) {
      getShiftOverlap();
    }
  }

  return (
    <Card bg={'light'} style={{ marginTop: '1rem' }}>
      <Card.Body>
        <Row className={'align-items-center'}>
          <Col sm={9}>
            {overlapShifts !== null ? (
              <>
                <Card.Text>{`Overlap Minutes: ${overlapShifts.overlapMin}`}</Card.Text>
                <Card.Text>{`Max Overlap Threshold: ${overlapShifts.maxThreshold}`}</Card.Text>
                <Card.Text>{`Exceeds Overlap Threshold: ${overlapShifts.exceedsThreshold}`}</Card.Text>
              </>
            ) : (
              <>
                <Card.Text>{'Overlap Minutes:'}</Card.Text>
                <Card.Text>{'Max Overlap Threshold:'}</Card.Text>
                <Card.Text>{'Exceeds Overlap Threshold'}</Card.Text>
              </>
            )}
          </Col>
          <Col sm={3}>
            <Button
              style={{ width: '100%' }}
              size="lg"
              onClick={handleClick}
              disabled={shiftsChecked.length === 2 ? false : true}
              variant="primary">
              Submit
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RequestCard;
