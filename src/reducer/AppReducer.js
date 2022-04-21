/**
 * Global variables are handled here
 * @param {*} state 
 * @param {*} action 
 * 
 * state:
 * * camera: THREE.PerspectiveCamera
 * * controls: Orbit Control
 */

export const Actions = {
  UPDATE_CAMERA: "update_camera",
  UPDATE_CONTROLS: "update_controls",
  UPDATE_COLLIDER: "update_collider"
}

export const reducer = (state, action) => {
  switch (action.type) {
    case Actions.UPDATE_CAMERA:
      return {
        ...state,
        camera: action.payload
      }
    case Actions.UPDATE_CONTROLS:
      return {
        ...state,
        controls: action.payload
      }
    case Actions.UPDATE_COLLIDER:
      return {
        ...state,
        collider: action.payload
      }
  }
}