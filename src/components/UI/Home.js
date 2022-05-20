import React from 'react';

function Home({setIsHome}) {
  return (
    <div className='gc-page-wrapper'>
      <div className='gc-main-wrapper'>
        <div className='intro-page-main-section'>
          <div className='gc-page-padding'>
            <div className='intro-page-wrapper'>
              <div className='gc-margin-wrapper margin-bottom---m'>
                <div className='gc-heading-wrapper gc-max-width-m'>
                  <h1 className='gc-heading-xxl'>Hello World</h1>
                </div>
              </div>
              <div className='gc-margin-wrapper margin-bottom---xl'>
                <div className='gc-text-wrapper gc-max-width-m'>
                  <div className='gc-text-xl gc-text-weight-light'>
                    Welcome to Edgar Allan’s magical clubhouse studio built with
                    Three Js in Webflow. Explore our world and collect some of
                    our favorite things!
                  </div>
                </div>
              </div>
              <button className='gc-button w-button' onClick={setIsHome}>
                Start playing!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
