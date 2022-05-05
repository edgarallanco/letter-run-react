import checkpoint from 'src/resources/checkpoints';
import {proxy, useSnapshot} from 'valtio';

const stateValtio = proxy({checkpoints: checkpoint, action: 'Standing Idle'});

export default stateValtio;
