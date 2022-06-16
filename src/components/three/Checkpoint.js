import React from 'react';

function Checkpoint({ position, collected}) {
  return (
    <>
      {!collected && (
        <mesh position={position}>
        </mesh>
      )}
    </>
  );
}

export default Checkpoint;
