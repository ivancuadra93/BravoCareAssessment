import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import ShiftCard from './components/ShiftCard/ShiftCard';
import RequestCard from './components/RequestCard/RequestCard';
import QueryCard from './components/QueryCard/QueryCard';

const App = () => {
  const [shifts, setShifts] = useState([]);
  const [shiftsChecked, setShiftsChecked] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    getQuestionOneShifts();
  }, []);

  // set the appropriate shift cards to disabled or enabled
  useEffect(() => {
    if (shiftsChecked.length === 2) {
      setDisabled(true);
    } else if (shiftsChecked.length === 1 || shiftsChecked.length === 0) {
      setDisabled(false);
    }
  }, [shiftsChecked]);

  function getQuestionOneShifts() {
    fetch('/getQuestionOneShifts').then(res => {
      res.json().then(response => setShifts([...response]));
    });
  }

  const addChecks = (checked, shiftId) => {
    if (checked === true) {
      setShiftsChecked(prev => [...prev, shiftId]);
    } else {
      setShiftsChecked(prev => prev.filter(val => val !== shiftId));
    }
  };

  return (
    <Container id="mainContainer">
      <Container id="requestCardContainer">
        <RequestCard shiftsChecked={shiftsChecked}></RequestCard>
      </Container>
      <Container id="shiftCardContainer">
        <Row xs={1} sm={2} md={3}>
          {shifts.map((shift, idx) => (
            <Col key={idx.toString()}>
              <ShiftCard
                disabled={disabled}
                addChecks={addChecks}
                shiftKey={idx.toString()}
                shiftData={shift}></ShiftCard>
            </Col>
          ))}
        </Row>
      </Container>
      <Container id="queryButtonsContainer">
        <QueryCard></QueryCard>
      </Container>
    </Container>
  );
};

export default App;
