import HeatmapConfig from "./config";
import Heatmap from "./core";

const heatmapFactory = {
  create: function () {
    return new Heatmap();
  },
  register: function (pluginKey, plugin) {
    HeatmapConfig.plugins[pluginKey] = plugin;
  },
};

export default heatmapFactory;
