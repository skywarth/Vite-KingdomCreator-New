import Index from "./views/Index.vue"
import { initialize } from "./setup";
import { AppCreateRouter } from "./router";

import '../styles/index.styl';

initialize(AppCreateRouter(["/index.html"], Index));