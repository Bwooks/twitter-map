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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var ReactDOM = require("react-dom");
require("regenerator-runtime/runtime");
var Map_1 = require("./components/Map");
var tweetsAPI_1 = require("./api/tweetsAPI");
var core_1 = require("@material-ui/core");
var nanoid_1 = require("nanoid");
var App = function () {
    var _a = react_1.useState([]), markers = _a[0], setMarkers = _a[1];
    var _b = react_1.useState(markers.length), sliderValue = _b[0], setSliderValue = _b[1];
    var onStartStream = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tweetsAPI_1.startStream(function (chunk) {
                        var tweet = JSON.parse(chunk);
                        var marker = { lat: tweet.coordinates.lat, lng: tweet.coordinates.lng };
                        setMarkers(function (markers) { return __spreadArrays(markers, [__assign(__assign({}, marker), { visible: true, id: "id-" + nanoid_1.nanoid() })]); });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        setSliderValue(markers.length);
    }, [markers.length]);
    var updateMarkerVisibility = function (marker, visible) {
        marker.visible = visible;
        return marker;
    };
    var onChangeSlider = function (event, value) {
        var updatedMarkers = null;
        if (value < sliderValue) { // Hide markers until value === sliderValue
            updatedMarkers = markers.map(function (marker, index) {
                if (index >= value && index <= sliderValue) {
                    return updateMarkerVisibility(marker, false);
                }
                else {
                    return marker;
                }
            });
        }
        else if (value > sliderValue) { // Show markers until value === sliderValue
            updatedMarkers = markers.map(function (marker, index) {
                if (index >= sliderValue && index <= value) {
                    return updateMarkerVisibility(marker, true);
                }
                else {
                    return marker;
                }
            });
        }
        setSliderValue(value);
        updatedMarkers && setMarkers(updatedMarkers);
    };
    react_1.useEffect(function () {
        var streamOnMount = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, onStartStream()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        streamOnMount();
    }, []);
    return (React.createElement("div", null,
        React.createElement("div", null,
            React.createElement("button", { onClick: function () { return tweetsAPI_1.stopStream(); } }, "Pause"),
            React.createElement("button", { onClick: function () { return onStartStream(); } }, "Resume"),
            React.createElement(core_1.Slider, { min: 0, max: markers.length, value: sliderValue, marks: true, onChange: function (event, value) { return onChangeSlider(event, value); } })),
        React.createElement(Map_1.Map, { markers: markers })));
};
var wrapper = document.getElementById('app-container');
ReactDOM.render(React.createElement(App, null), wrapper);
//# sourceMappingURL=index.js.map