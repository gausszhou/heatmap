import HeatmapConfig from "./config";
import Canvas2dRenderer from "./renderer/canvas2d";

const Renderer = (function RendererClosure() {

  let rendererFn:any = false;

  if (HeatmapConfig['defaultRenderer'] === 'canvas2d') {
    rendererFn = Canvas2dRenderer;
  }
  return rendererFn;
})();

export default Renderer;