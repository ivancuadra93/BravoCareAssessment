import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import QueryButton from '../QueryButton/QueryButton';

const QueryCard = () => {
  return (
    <Card bg={'light'} style={{ marginTop: '1rem' }}>
      <Card.Title style={{ alignSelf: 'center', marginTop: '1rem' }}>
        Queries
      </Card.Title>
      <Card.Body>
        <Row sm={1} md={3}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Col key={idx.toString()}>
              <QueryButton queryNumber={idx + 4}></QueryButton>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QueryCard;
