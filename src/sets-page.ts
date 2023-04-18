import Sets from './views/Sets.vue'
import { initialize } from './setup';
import { AppCreateRouter } from './router';

import '../styles/rules.styl';

initialize(AppCreateRouter(["/sets.html"], Sets));
