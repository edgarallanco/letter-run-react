import React, {createContext, useReducer} from 'react';
import {reducer} from 'reducer/AppReducer';
import checkpoint from 'src/resources/checkpoints';

const initialState = {
  controls: null,
  camera: null,
  collider: null,
  playerPosition: null,
  playerMesh: null,
  environment: null,
  sound: false,
  isModal: false,
  checkpoints: checkpoint,
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
