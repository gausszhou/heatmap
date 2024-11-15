const f = {
  defaultRadius: 40,
  defaultRenderer: "canvas2d",
  defaultGradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1: "rgb(255,0,0)" },
  defaultMaxOpacity: 1,
  defaultMinOpacity: 0,
  defaultBlur: 0.85,
  defaultXField: "x",
  defaultYField: "y",
  defaultValueField: "value",
  plugins: {}
};
var x = function(t) {
  var a = t.gradient || t.defaultGradient, e = document.createElement("canvas"), r = e.getContext("2d");
  if (!r)
    return !1;
  e.width = 256, e.height = 1;
  const i = r.createLinearGradient(0, 0, 256, 1);
  for (var n in a)
    i.addColorStop(Number(n), a[n]);
  return r.fillStyle = i, r.fillRect(0, 0, 256, 1), r.getImageData(0, 0, 256, 1).data;
}, y = function(t, a) {
  var e = document.createElement("canvas"), r = e.getContext("2d");
  if (!r)
    return !1;
  var i = t, n = t;
  if (e.width = e.height = t * 2, a == 1)
    r.beginPath(), r.arc(i, n, t, 0, 2 * Math.PI, !1), r.fillStyle = "rgba(0,0,0,1)", r.fill();
  else {
    var s = r.createRadialGradient(
      i,
      n,
      t * a,
      i,
      n,
      t
    );
    s.addColorStop(0, "rgba(0,0,0,1)"), s.addColorStop(1, "rgba(0,0,0,0)"), r.fillStyle = s, r.fillRect(0, 0, 2 * t, 2 * t);
  }
  return e;
}, b = function(n) {
  for (var a = [], e = n.min, r = n.max, i = n.radi, n = n.data, s = Object.keys(n), l = s.length; l--; )
    for (var d = s[l], o = Object.keys(n[d]), h = o.length; h--; ) {
      var v = o[h], u = n[d][v], _ = i[d][v];
      a.push({
        x: d,
        y: v,
        value: u,
        radius: _
      });
    }
  return {
    min: e,
    max: r,
    data: a
  };
};
function p(t) {
  var a = t.container, e = this.shadowCanvas = document.createElement("canvas"), r = this.canvas = t.canvas || document.createElement("canvas");
  this._renderBoundaries = [1e4, 1e4, 0, 0];
  var i = getComputedStyle(t.container) || {};
  r.className = "heatmap-canvas", this._width = r.width = e.width = t.width || +i.width.replace(/px/, ""), this._height = r.height = e.height = t.height || +i.height.replace(/px/, ""), this.shadowCtx = e.getContext("2d"), this.ctx = r.getContext("2d"), r.style.cssText = e.style.cssText = "position:absolute;left:0;top:0;", a.style.position = "relative", a.appendChild(r), this._palette = x(t), this._templates = {}, this._setStyles(t);
}
p.prototype = {
  renderPartial: function(t) {
    t.data.length > 0 && (this._drawAlpha(t), this._colorize());
  },
  renderAll: function(t) {
    this._clear(), t.data.length > 0 && (this._drawAlpha(b(t)), this._colorize());
  },
  _updateGradient: function(t) {
    this._palette = x(t);
  },
  updateConfig: function(t) {
    t.gradient && this._updateGradient(t), this._setStyles(t);
  },
  setDimensions: function(t, a) {
    this._width = t, this._height = a, this.canvas.width = this.shadowCanvas.width = t, this.canvas.height = this.shadowCanvas.height = a;
  },
  _clear: function() {
    this.shadowCtx.clearRect(0, 0, this._width, this._height), this.ctx.clearRect(0, 0, this._width, this._height);
  },
  _setStyles: function(t) {
    this._blur = t.blur == 0 ? 0 : t.blur || t.defaultBlur, t.backgroundColor && (this.canvas.style.backgroundColor = t.backgroundColor), this._width = this.canvas.width = this.shadowCanvas.width = t.width || this._width, this._height = this.canvas.height = this.shadowCanvas.height = t.height || this._height, this._opacity = (t.opacity || 0) * 255, this._maxOpacity = (t.maxOpacity || t.defaultMaxOpacity) * 255, this._minOpacity = (t.minOpacity || t.defaultMinOpacity) * 255, this._useGradientOpacity = !!t.useGradientOpacity;
  },
  _drawAlpha: function(r) {
    for (var a = this._min = r.min, e = this._max = r.max, r = r.data || [], i = r.length, n = 1 - this._blur; i--; ) {
      var s = r[i], l = s.x, d = s.y, o = s.radius, h = Math.min(s.value, e), v = l - o, u = d - o, _ = this.shadowCtx, c;
      this._templates[o] ? c = this._templates[o] : this._templates[o] = c = y(o, n);
      var m = (h - a) / (e - a);
      _.globalAlpha = m < 0.01 ? 0.01 : m, _.drawImage(c, v, u), v < this._renderBoundaries[0] && (this._renderBoundaries[0] = v), u < this._renderBoundaries[1] && (this._renderBoundaries[1] = u), v + 2 * o > this._renderBoundaries[2] && (this._renderBoundaries[2] = v + 2 * o), u + 2 * o > this._renderBoundaries[3] && (this._renderBoundaries[3] = u + 2 * o);
    }
  },
  _colorize: function() {
    var t = this._renderBoundaries[0], a = this._renderBoundaries[1], e = this._renderBoundaries[2] - t, r = this._renderBoundaries[3] - a, i = this._width, n = this._height, s = this._opacity, l = this._maxOpacity, d = this._minOpacity, o = this._useGradientOpacity;
    t < 0 && (t = 0), a < 0 && (a = 0), t + e > i && (e = i - t), a + r > n && (r = n - a);
    for (var h = this.shadowCtx.getImageData(t, a, e, r), v = h.length, u = this._palette, _ = 3; _ < v; _ += 4) {
      var c = h[_], m = c * 4;
      if (m) {
        var g;
        s > 0 ? g = s : c < l ? c < d ? g = d : g = c : g = l, h[_ - 3] = u[m], h[_ - 2] = u[m + 1], h[_ - 1] = u[m + 2], h[_] = o ? u[m + 3] : g;
      }
    }
    this.ctx.putImageData(h, t, a), this._renderBoundaries = [1e3, 1e3, 0, 0];
  },
  getValueAt: function(t) {
    var a, e = this.shadowCtx, r = e.getImageData(t.x, t.y, 1, 1), i = r.data[3], n = this._max, s = this._min;
    return a = Math.abs(n - s) * (i / 255) >> 0, a;
  },
  getDataURL: function() {
    return this.canvas.toDataURL();
  }
};
const O = function() {
  let a = !1;
  return f.defaultRenderer === "canvas2d" && (a = p), a;
}(), { defaultRadius: R } = f;
function w(t) {
  this._coordinator = {}, this._data = [], this._radi = [], this._min = 10, this._max = 1, this._xField = t.xField || t.defaultXField, this._yField = t.yField || t.defaultYField, this._valueField = t.valueField || t.defaultValueField, t.radius && (this._cfgRadius = t.radius);
}
w.prototype = {
  // when forceRender = false -> called from setData, omits renderall event
  _organiseData: function(t, a) {
    var e = t[this._xField], r = t[this._yField], i = this._radi, n = this._data, s = this._max, l = this._min, d = t[this._valueField] || 1, o = t.radius || this._cfgRadius || R;
    n[e] || (n[e] = [], i[e] = []), n[e][r] ? n[e][r] += d : (n[e][r] = d, i[e][r] = o);
    var h = n[e][r];
    return h > s ? (a ? this.setDataMax(h) : this._max = h, !1) : h < l ? (a ? this.setDataMin(h) : this._min = h, !1) : {
      x: e,
      y: r,
      value: d,
      radius: o,
      min: l,
      max: s
    };
  },
  _unOrganizeData: function() {
    var t = [], a = this._data, e = this._radi;
    for (var r in a)
      for (var i in a[r])
        t.push({
          x: r,
          y: i,
          radius: e[r][i],
          value: a[r][i]
        });
    return {
      min: this._min,
      max: this._max,
      data: t
    };
  },
  _onExtremaChange: function() {
    this._coordinator.emit("extremachange", {
      min: this._min,
      max: this._max
    });
  },
  addData: function() {
    if (arguments[0].length > 0)
      for (var t = arguments[0], a = t.length; a--; )
        this.addData.call(this, t[a]);
    else {
      var e = this._organiseData(arguments[0], !0);
      e && (this._data.length === 0 && (this._min = this._max = e.value), this._coordinator.emit("renderpartial", {
        min: this._min,
        max: this._max,
        data: [e]
      }));
    }
    return this;
  },
  setData: function(t) {
    var a = t.data, e = a.length;
    this._data = [], this._radi = [];
    for (var r = 0; r < e; r++)
      this._organiseData(a[r], !1);
    return this._max = t.max, this._min = t.min || 0, this._onExtremaChange(), this._coordinator.emit("renderall", this._getInternalData()), this;
  },
  removeData: function() {
  },
  setDataMax: function(t) {
    return this._max = t, this._onExtremaChange(), this._coordinator.emit("renderall", this._getInternalData()), this;
  },
  setDataMin: function(t) {
    return this._min = t, this._onExtremaChange(), this._coordinator.emit("renderall", this._getInternalData()), this;
  },
  setCoordinator: function(t) {
    this._coordinator = t;
  },
  _getInternalData: function() {
    return {
      max: this._max,
      min: this._min,
      data: this._data,
      radi: this._radi
    };
  },
  getData: function() {
    return this._unOrganizeData();
  }
};
class C {
  static merge(...a) {
    for (var e = {}, r = a.length, i = 0; i < r; i++) {
      var n = a[i];
      for (var s in n)
        e[s] = n[s];
    }
    return e;
  }
}
var B = function() {
  function a() {
    this.cStore = {};
  }
  return a.prototype = {
    on: function(e, r, i) {
      var n = this.cStore;
      n[e] || (n[e] = []), n[e].push(function(s) {
        return r.call(i, s);
      });
    },
    emit: function(e, r) {
      var i = this.cStore;
      if (i[e])
        for (var n = i[e].length, s = 0; s < n; s++) {
          var l = i[e][s];
          l(r);
        }
    }
  }, a;
}(), F = function(t) {
  var a = t._renderer, e = t._coordinator, r = t._store;
  e.on("renderpartial", a.renderPartial, a), e.on("renderall", a.renderAll, a), e.on("extremachange", function(i) {
    t._config.onExtremaChange && t._config.onExtremaChange({
      min: i.min,
      max: i.max,
      gradient: t._config.gradient || t._config.defaultGradient
    });
  }), r.setCoordinator(e);
};
function D() {
  var t = this._config = C.merge(f, arguments[0] || {});
  if (this._coordinator = new B(), t.plugin) {
    var a = t.plugin;
    if (f.plugins[a]) {
      var e = f.plugins[a];
      this._renderer = new e.renderer(t), this._store = new e.store(t);
    } else
      throw new Error(
        "Plugin '" + a + "' not found. Maybe it was not registered."
      );
  } else
    this._renderer = new O(t), this._store = new w(t);
  F(this);
}
D.prototype = {
  addData: function() {
    return this._store.addData.apply(this._store, arguments), this;
  },
  removeData: function() {
    return this._store.removeData && this._store.removeData.apply(this._store, arguments), this;
  },
  setData: function() {
    return this._store.setData.apply(this._store, arguments), this;
  },
  setDataMax: function() {
    return this._store.setDataMax.apply(this._store, arguments), this;
  },
  setDataMin: function() {
    return this._store.setDataMin.apply(this._store, arguments), this;
  },
  configure: function(t) {
    return this._config = C.merge(this._config, t), this._renderer.updateConfig(this._config), this._coordinator.emit("renderall", this._store._getInternalData()), this;
  },
  repaint: function() {
    return this._coordinator.emit("renderall", this._store._getInternalData()), this;
  },
  getData: function() {
    return this._store.getData();
  },
  getDataURL: function() {
    return this._renderer.getDataURL();
  },
  getValueAt: function(t) {
    return this._store.getValueAt ? this._store.getValueAt(t) : this._renderer.getValueAt ? this._renderer.getValueAt(t) : null;
  }
};
const M = {
  create: function(t) {
    return new D(t);
  },
  register: function(t, a) {
    f.plugins[t] = a;
  }
};
export {
  M as default
};
