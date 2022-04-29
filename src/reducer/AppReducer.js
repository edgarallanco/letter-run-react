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
  UPDATE_CAMERA: 'update_camera',
  UPDATE_CONTROLS: 'update_controls',
  UPDATE_COLLIDER: 'update_collider',
  UPDATE_PLAYER: 'update_player',
  UPDATE_SOUND: 'update_sound',
  UPDATE_MODAL: 'update_modal',
  DELETE_CHECKPOINT: 'delete_checkpoint',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case Actions.UPDATE_CAMERA:
      return {
        ...state,
        camera: action.payload,
      };
    case Actions.UPDATE_CONTROLS:
      return {
        ...state,
        controls: action.payload,
      };
    case Actions.UPDATE_COLLIDER:
      return {
        ...state,
        collider: action.payload,
      };
    case Actions.UPDATE_SOUND:
      return {
        ...state,
        sound: action.payload,
      };
    case Actions.UPDATE_MODAL:
      return {
        ...state,
        isModal: action.payload,
      };
    case Actions.DELETE_CHECKPOINT:
      return {
        ...state,
        checkpoints: state.checkpoints.filter(
          (checkpoint) => checkpoint.number !== action.payload
        ),
      };
    case Actions.UPDATE_PLAYER:
      return {
        ...state,
        playerPosition: {
          x: Math.floor(action.payload.x),
          y: Math.floor(action.payload.y),
          z: Math.floor(action.payload.z),
        },
      };
  }
};
