import React, {useState} from 'react';
import {animated, useSpring, flip, set} from 'react-spring';

function Finish({isFinished, setIsFinished}) {
  const [tab, setTab] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const transition = useSpring({
    opacity: isFinished ? 1 : 0,
    transform: isFinished ? 'translate3d(0%, 0, 0)' : 'translate3d(100%, 0, 0)',
    display: 'block',
  });

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <animated.div className='form-popup-wrapper' style={transition}>
      {tab ? (
        <div className='congrats-wrapper'>
          <div className='congrats-inner'>
            <div className='gc-heading-wrapper margin-bottom---s'>
              <h2 className='gc-heading-xl gc-text-color-white'>Congrats!</h2>
            </div>
            <div className='gc-text-wrapper margin-bottom---m gc-text-alignment-center'>
              <div className='gc-text-m gc-text-weight-light gc-text-color-white'>
                You’ve collected all the things and found the hidden surprise!
                As a thank you for exploring our world, we’re sending you an
                Edgar Allan mug ✨
              </div>
            </div>
            <div
              className='gc-margin-wrapper margin-bottom---s'
              onClick={() => setTab(false)}
            >
              <a
                data-w-id='2224a409-f355-ffdd-918a-b05aba3ade94'
                href='#'
                className='gc-button w-button'
              >
                Share my address
              </a>
            </div>
            <div data-w-id='48961b19-59eb-4385-4b3a-d0c808511b02'>
              <a href='#' className='nah-link' onClick={() => setIsFinished()}>
                Nah, I’m good
              </a>
            </div>
          </div>
          <div className='mug-wrapper'>
            <img
              src='images/Enamelled_Mug_Mockup-1.png'
              loading='lazy'
              sizes='(max-width: 479px) 100vw, 450px'
              srcSet='images/Enamelled_Mug_Mockup-1-p-500.png 500w, images/Enamelled_Mug_Mockup-1.png 900w'
              alt=''
            />
          </div>
        </div>
      ) : (
        <>
          <div className='form-wrapper'>
            <div className='form-inner'>
              <div className='form-block-wrapper'>
                <div className='form-block w-form'>
                  {!isSubmitted ? (
                    <>
                      <div className='gc-text-wrapper margin-bottom---m gc-text-alignment-center'>
                        <div className='gc-text-xl gc-text-color-white'>
                          Fill out your info and be on the lookout for some
                          sweet mail!
                        </div>
                      </div>
                      <input
                        type='text'
                        className='text-field cc-margin-bottom w-input'
                        maxLength='256'
                        name='name'
                        data-name='Name'
                        placeholder='Full Name*'
                        id='name'
                        required=''
                      />
                      <input
                        type='text'
                        className='text-field w-input'
                        maxLength='256'
                        name='Address-Line-1'
                        data-name='Address Line 1'
                        placeholder='Address Line 1*'
                        id='Address-Line'
                        required=''
                      />
                      <input
                        type='text'
                        className='text-field w-input'
                        maxLength='256'
                        name='Address-Line-2'
                        data-name='Address Line 2'
                        placeholder='Address Line 2'
                        id='Address-Line-2'
                      />
                      <div className='input-fields-wrapper'>
                        <input
                          type='text'
                          className='text-field w-input'
                          maxLength='256'
                          name='City'
                          data-name='City'
                          placeholder='City*'
                          id='City'
                          required=''
                        />
                        <input
                          type='text'
                          className='text-field w-input'
                          maxLength='256'
                          name='State'
                          data-name='State'
                          placeholder='State*'
                          id='State-2'
                        />
                      </div>
                      <input
                        type='text'
                        className='text-field w-input'
                        maxLength='256'
                        name='Zip'
                        data-name='Zip'
                        placeholder='Zip*'
                        id='Zip'
                      />
                      <input
                        type='email'
                        className='text-field cc-margin-bottom w-input'
                        maxLength='256'
                        name='Email'
                        data-name='Email'
                        placeholder='Email*'
                        id='Email'
                        required=''
                      />
                      <input
                        type='email'
                        className='text-field cc-margin-bottom w-input'
                        maxLength='256'
                        name='Company'
                        data-name='Company'
                        placeholder='Company'
                        id='Company'
                      />
                      <label className='w-checkbox checkbox-field'>
                        <div>
                          <input
                            type='checkbox'
                            name='Privacy-Policy'
                            id='Privacy-Policy'
                            data-name='Privacy Policy'
                            required=''
                            className='w-checkbox-input w-checkbox-input--inputType-custom checkbox'
                            // style='opacity:0;position:absolute;z-index:-1'
                          />
                        </div>
                        <span className='w-form-label' htmlFor='Privacy-Policy'>
                          I have read the Privacy Policy*
                        </span>
                      </label>
                      <div className='gc-text-alignment-center'>
                        <button
                          onClick={handleSubmit}
                          className='gc-button w-button'
                        >
                          Submit
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='success-message'>
                        <div className='success-message-inner'>
                          <div className='gc-heading-wrapper margin-bottom---s'>
                            <h2 className='gc-heading-xl gc-text-color-white'>
                              Thanks!
                            </h2>
                          </div>
                          <div className='gc-margin-wrapper margin-bottom---s'>
                            <a
                              data-w-id='38915620-18a4-d2d6-b039-439b42e25b4f'
                              href='#'
                              className='gc-button w-button'
                              onClick={() => setIsFinished()}
                            >
                              Close
                            </a>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className='w-form-fail'>
                    <div>
                      Oops! Something went wrong while submitting the form.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <a
        data-w-id='20ddcb81-0402-fd47-e32a-250d4ba0b5ea'
        href='#'
        className='close-menu-wrapper w-inline-block'
        onClick={() => setIsFinished()}
      >
        <img
          src='images/close-menu.svg'
          loading='lazy'
          alt=''
          className='invert'
        />
      </a>
    </animated.div>
  );
}

export default Finish;
