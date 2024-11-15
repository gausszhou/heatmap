import HeatmapConfig from "./config";
import Heatmap from "./core";

const heatmapFactory = {
  create: function (option) {
    return new Heatmap(option);
  },
  register: function (pluginKey, plugin) {
    HeatmapConfig.plugins[pluginKey] = plugin;
  },
};

export default heatmapFactory;
