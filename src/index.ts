import HeatmapConfig from "./config";
import Heatmap from "./core";

const heatmapFactory = {
  create: function (config) {
    return new Heatmap(config);
  },
  register: function (pluginKey, plugin) {
    HeatmapConfig.plugins[pluginKey] = plugin;
  },
};

export default heatmapFactory;
