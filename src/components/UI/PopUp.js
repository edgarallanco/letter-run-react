import stateValtio from 'context/store';
import React, {useState, useEffect} from 'react';
import {animated, useSpring} from 'react-spring';

function PopUp({isPopup, setIsPopup, isCollection, setIsCollection}) {
  const [tab, setTab] = useState('');
  const [lastCollected, setLastCollected] = useState({});
  const transition = useSpring({
    opacity: isPopup ? 1 : 0,
    transform: isPopup ? 'translate3d(0%, 0, 0)' : 'translate3d(-100%, 0, 0)',
  });

  useEffect(() => {
    isCollection ? setTab('COLLECTION') : setTab('INSTRUCTIONS');
    setLastCollected(
      stateValtio.checkpoints.find((check) => check.last === true)
    );
  }, [isCollection]);

  const onClose = () => {
    setIsPopup();
    stateValtio.checkpoints.map((check) => (check.last = false));
    setIsCollection();
  };

  const transitionTab = useSpring({
    opacity: 1,
    from: {opacity: 0},
    config: {
      duration: 5000,
    },
  });
  return (
    <>
      <animated.div className='menu-popup-wrapper' style={transition}>
        <a
          data-w-id='88810c3a-a1f4-45cc-bc4f-6ecaec1bafb6'
          href='#'
          className='close-menu-wrapper w-inline-block'
          onClick={onClose}
        >
          <img src='images/close-menu.svg' loading='lazy' alt='' />
        </a>
        <div
          data-current='Tab 1'
          data-easing='ease'
          data-duration-in='300'
          data-duration-out='100'
          className='tabs w-tabs'
        >
          <div className='tab-menu w-tab-menu'>
            <a
              data-w-tab='Tab 1'
              className={`tab-button w-inline-block w-tab-link ${
                tab === 'INSTRUCTIONS' && 'w--current'
              }`}
              onClick={() => setTab('INSTRUCTIONS')}
            >
              <img loading='lazy' src='images/instructions-icon.svg' alt='' />
              <div>Instructions</div>
            </a>
            <a
              data-w-tab='Tab 2'
              className={`tab-button w-inline-block w-tab-link ${
                tab === 'COLLECTION' && 'w--current'
              }`}
              onClick={() => setTab('COLLECTION')}
            >
              <img loading='lazy' src='images/collection-icon.svg' alt='' />
              <div>Collection</div>
            </a>
            <a
              data-w-tab='Tab 3'
              className={`tab-button w-inline-block w-tab-link ${
                tab === 'ABOUT' && 'w--current'
              }`}
              onClick={() => setTab('ABOUT')}
            >
              <img loading='lazy' src='images/about-icon.svg' alt='' />
              <div>About</div>
            </a>
          </div>
          <div className='tabs-content w-tab-content'>
            {tab === 'INSTRUCTIONS' && (
              <animated.div
                data-w-tab='Tab 1'
                style={transitionTab}
                className={`tab-pane-wrapper w-tab-pane ${
                  tab === 'INSTRUCTIONS' && 'w--tab-active'
                }`}
              >
                <div className='tab-content-grid'>
                  <div className='tab-content-wrapper'>
                    <div className='tab-content-left'>
                      <img loading='lazy' src='images/arrows.svg' alt='' />
                    </div>
                    <div className='tab-content-right'>
                      <div>Keyboard arrows to move around</div>
                    </div>
                  </div>
                  <div className='tab-content-wrapper'>
                    <div className='tab-content-left'>
                      <img loading='lazy' src='images/spacebar.svg' alt='' />
                    </div>
                    <div className='tab-content-right'>
                      <div>Spacebar to jump</div>
                    </div>
                  </div>
                  <div className='tab-content-wrapper'>
                    <div className='tab-content-left'>
                      <img loading='lazy' src='images/button-c.svg' alt='' />
                    </div>
                    <div className='tab-content-right'>
                      <div>“C” key to switch camera angles</div>
                    </div>
                  </div>
                  <div className='tab-content-wrapper cc-last-tab'>
                    <div className='tab-content-left'>
                      <img loading='lazy' src='images/button-m.svg' alt='' />
                    </div>
                    <div className='tab-content-right'>
                      <div>
                        “M” key to see the <br />
                        map overview
                      </div>
                    </div>
                  </div>
                </div>
              </animated.div>
            )}

            <animated.div
              data-w-tab='Tab 2'
              className={`tab-pane-wrapper w-tab-pane ${
                tab === 'COLLECTION' && 'w--tab-active'
              }`}
            >
              <div className='tab-collection-wrapper'>
                {isCollection && (
                  <div className='gc-text-wrapper margin-bottom---l gc-text-alignment-center'>
                    <div className='gc-text-xl'>
                      Congrats! You found our {lastCollected?.item}.
                    </div>
                  </div>
                )}
                <div className='tab-collection-grid'>
                  {stateValtio.checkpoints.map(({collected, number, last}) => (
                    <div
                      id='w-node-_3ad74d17-46d4-9114-ce6a-1467a37ae9e3-992107f9'
                      className={`collection-item  ${
                        last ? 'cc-just-collected' : 'cc-collected'
                      }`}
                      key={number}
                    >
                      {collected && (
                        <img
                          loading='lazy'
                          src='images/notebook.png'
                          alt=''
                          className='blending-darken'
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </animated.div>
            <div
              data-w-tab='Tab 3'
              className={`tab-pane-wrapper w-tab-pane ${
                tab === 'ABOUT' && 'w--tab-active'
              }`}
            >
              <div className='tab-about-wrapper'>
                <div className='ea-logo-wrapper'>
                  <img
                    loading='lazy'
                    src='images/edgar-allan-logo.svg'
                    alt=''
                  />
                </div>
                <div className='gc-text-wrapper margin-bottom---l gc-text-alignment-center'>
                  <div className='gc-text-m gc-text-weight-light'>
                    We empower companies to move faster, own their stories, and
                    build better digital experiences. Need a 3JS Webflow build?
                    We’re the team for you!
                  </div>
                </div>
                <div className='gc-margin-wrapper margin-bottom---l'>
                  <a
                    href='https://www.edgarallan.com/'
                    target='_blank'
                    className='gc-button-black w-button'
                  >
                    Start a Project
                  </a>
                </div>
                <div className='social-links-wrapper'>
                  <a href='https://edgarallan.com/' target='_blank'>
                    edgarallan.com
                  </a>
                  <img loading='lazy' src='images/twitter-icon.svg' alt='' />
                  <a href='https://twitter.com/edgarallanco' target='_blank'>
                    @edgarallanco
                  </a>
                </div>
              </div>
              <div className='shape-wrapper'>
                <img loading='lazy' src='images/HeroShape.svg' alt='' />
              </div>
            </div>
          </div>
          <div className='menu-info-wrapper'>
            <div className='gc-text-wrapper'>
              <div className='gc-text-xs'>
                Built with Three.js in Webflow by
                <a
                  href='https://edgarallan.com/'
                  target='_blank'
                  className='gc-text-color-primary gc-text-weight-semi-bold'
                >
                  Edgar Allan
                </a>
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </>
  );
}

export default PopUp;
