"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = exports.MAP_CONTAINER_EL_ID = void 0;
var React = require("react");
var react_1 = require("react");
var mapbox_gl_1 = require("mapbox-gl");
var PropTypes = require("prop-types");
exports.MAP_CONTAINER_EL_ID = 'map-container';
mapbox_gl_1.default.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
var Map = function (_a) {
    var markers = _a.markers;
    var _b = react_1.useState(null), map = _b[0], setMap = _b[1];
    var mapContainer = react_1.useRef(null);
    var _c = react_1.useState({}), mappedMarkers = _c[0], setMappedMarkers = _c[1];
    react_1.useEffect(function () {
        var Map = new mapbox_gl_1.default.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 9,
            center: [40, 40]
        });
        setMap(Map);
    }, []);
    react_1.useEffect(function () {
        markers.forEach(function (marker) {
            var mappedMarker = mappedMarkers[marker.id];
            if (mappedMarker && mappedMarker.visible !== marker.visible) {
                mappedMarker._element.style.visibility = marker.visible ? 'visible' : 'hidden';
                mappedMarker.visible = marker.visible;
            }
        });
    }, [markers]);
    react_1.useEffect(function () {
        if (markers.length) {
            var marker_1 = markers[markers.length - 1];
            var mappedMarker_1 = new mapbox_gl_1.default.Marker()
                .setLngLat([marker_1.lat, marker_1.lng])
                .addTo(map);
            mappedMarker_1._element.id = marker_1.id;
            setMappedMarkers(function (mappedMarkers) {
                var _a;
                return (__assign(__assign({}, mappedMarkers), (_a = {}, _a[marker_1.id] = __assign(__assign({}, mappedMarker_1), { visible: marker_1.visible }), _a)));
            });
        }
    }, [markers.length]);
    return (React.createElement("div", { id: exports.MAP_CONTAINER_EL_ID, ref: function (el) { return mapContainer.current = el; }, style: { height: "100vh" } }));
};
exports.Map = Map;
exports.Map.propTypes = {
    markers: PropTypes.array.isRequired
};
//# sourceMappingURL=Map.js.map