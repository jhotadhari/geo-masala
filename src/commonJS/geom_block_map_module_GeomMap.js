import GeomMap from './geom_block_map_module_GeomMap/components/GeomMap.jsx';

const modules = undefined === geomData.modules  ? {} : geomData.modules;
modules.GeomMap = GeomMap;
geomData.modules = modules;