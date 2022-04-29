import React, {createContext, useReducer} from 'react';
import {reducer} from 'reducer/AppReducer';

const initialState = {
  controls: null,
  camera: null,
  collider: null,
  playerPosition: null,
  sound: false,
  isModal: false,
  checkpoints: [
    {
      url: 'https://uselessfacts.jsph.pl/random.json',
      item: 'Magic pencil',
      img_url: 'https://cdn.custom-cursor.com/packs/1758/pack2387.png',
      number: 0,
    },
    {
      url: 'https://uselessfacts.jsph.pl/random.json',
      item: 'Wifi password',
      img_url:
        'https://w7.pngwing.com/pngs/635/274/png-transparent-computer-icons-wi-fi-wifi-password-angle-logo-internet.png',
      number: 1,
    },
  ],
};

export const AppStateContext = createContext({state: initialState});
export const AppDispatchContext = createContext({dispatch: () => {}});

export const AppProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppStateContext.Provider value={{state}}>
      <AppDispatchContext.Provider value={{dispatch}}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
