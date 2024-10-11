const LAYOUTS = {
  grid: [
    { i: "truck", x: 0, y: 0, w: 2, h: 5, minW: 2, minH: 3 },
    { i: "services", x: 2, y: 0, w: 2, h: 5.5, minW: 2, minH: 5 },
    { i: "minServicePrices", x: 4, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
    { i: "gst", x: 2, y: 2, w: 2, h: 2.5, minW: 2, minH: 2 },
    { i: "waitTimeRate", x: 4, y: 2, w: 2, h: 2.5, minW: 2, minH: 2 },
  ],
  horizontal: [
    { i: "truck", x: 1, y: 0, w: 4, h: 5, minW: 2, minH: 3 },
    { i: "services", x: 1, y: 1, w: 4, h: 5.5, minW: 2, minH: 5 },
    { i: "minServicePrices", x: 1, y: 2, w: 4, h: 4, minW: 2, minH: 3 },
    { i: "gst", x: 1, y: 3, w: 4, h: 2.5, minW: 2, minH: 2 },
    { i: "waitTimeRate", x: 1, y: 4, w: 4, h: 2.5, minW: 2, minH: 2 },
  ],
};

export default LAYOUTS;
