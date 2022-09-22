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
  UPDATE_PLAYER_MESH: 'update_player_mesh',
  UPDATE_ENVIROMENT: 'update_enviroment',
  UPDATE_MOVEMENT: 'update_movement',
  UPDATE_MOVABLE_COLLIDERS: 'update_movable_colliders',
  UPDATE_PLAYER_PHYSICS: 'update_player_physics'
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
    case Actions.UPDATE_PLAYER_MESH:
      return {
        ...state,
        playerMesh: action.payload,
      };
    case Actions.UPDATE_ENVIROMENT:
      return {
        ...state,
        enviroment: action.payload,
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
    case Actions.UPDATE_MOVEMENT:
      return {
        ...state,
        move: action.payload
      };
    case Actions.UPDATE_MOVABLE_COLLIDERS:
      return {
        ...state,
        movableColliders: action.payload
      }
    case Actions.UPDATE_PLAYER_PHYSICS:
      return {
        ...state,
        playerPhysics: action.payload
      }
  }
};
