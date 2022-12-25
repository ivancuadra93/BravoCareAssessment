import React from 'react';
import Button from 'react-bootstrap/Button';

const QueryButton = ({ queryNumber }) => {
  function getQuery() {
    fetch('/getQuery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryNumber: queryNumber,
      }),
    })
      .then(res => {
        return res.text();
      })
      .then(data => {
        console.log(JSON.parse(data));
      });
  }

  const handleClick = () => {
    getQuery();
  };

  return (
    <Button
      onClick={handleClick}
      style={{ marginTop: '1rem', width: '100%' }}
      size="lg">
      {`Execute Q${queryNumber} Query`}
    </Button>
  );
};

export default QueryButton;
