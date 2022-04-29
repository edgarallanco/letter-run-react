import React, {useEffect, useState, useContext} from 'react';
import ReactDOM from 'react-dom/client';

// import {Modal} from 'antd';

const root = ReactDOM.createRoot(document.getElementById('UI'));
export default function Modal({isModal, setIsModal, checkpoint}) {
  return (
    <>
      {checkpoint && (
        <div className='min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover'>
          <div className='absolute bg-black opacity-80 inset-0 z-0'></div>
          <div className='w-56 text-center max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white '>
            <h2 className='text-3xl block'>{checkpoint.item}</h2>
            <img src={checkpoint.img_url} className='object-cover h-48 w-96' />
            <button
              className='bg-blue-500 hover:bg-blue-400  text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-6'
              onClick={() => setIsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

root.render(Modal);
