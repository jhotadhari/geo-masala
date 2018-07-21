import FrontendApp from './geom_block_map_module_FrontendApp/App.js';

const modules = undefined === geomData.modules  ? {} : geomData.modules;
modules.FrontendApp = FrontendApp;
geomData.modules = modules;