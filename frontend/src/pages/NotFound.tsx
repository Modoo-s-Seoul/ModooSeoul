// import React from 'react';

import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          minHeight: '300px',
        }}
      >
        <div
          style={{
            // marginTop: "auto",
            fontSize: '10vw',
            fontWeight: '700',
          }}
        >
          404
        </div>
        <div
          style={{
            // marginTop: "auto",
            fontSize: '4vw',
            fontWeight: '700',
          }}
        >
          Not Found
        </div>
        <div
          style={{
            width: '200px',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: '1.2vw',
          }}
        >
          <hr />
          <div>
            The Page you are looking for doesn't exist or and other error
            occured.
          </div>
          <hr />
          <div
            style={{ textDecorationLine: 'underline' }}
            onClick={() => {
              navigate(`/`);
            }}
          >
            {' '}
            {`Go to Homepage ⇀`}
          </div>
        </div>
      </div>
    </>
  );
}
