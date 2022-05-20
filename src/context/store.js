import checkpoint from 'src/resources/checkpoints';
import {proxy, useSnapshot} from 'valtio';

const stateValtio = proxy({
  checkpoints: checkpoint,
  action: 'Anim_Idle',
  stairs: [],
  geometries: [],
  isModal: false,
  collection: [],
});

export default stateValtio;
