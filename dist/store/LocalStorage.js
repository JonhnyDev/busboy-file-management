"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var LocalStorage = /** @class */ (function () {
    function LocalStorage(dirPath) {
        this.dirPath = dirPath;
    }
    LocalStorage.prototype.destroy = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (this.currentWriteStream) {
                        this.currentWriteStream.destroy();
                        this.currentWriteStream = undefined;
                    }
                    fs_1.default.unlinkSync(url);
                }
                catch (err) {
                    throw err;
                }
                return [2 /*return*/];
            });
        });
    };
    LocalStorage.prototype.write = function (file, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var rootPath, filePath_1;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    rootPath = path_1.default.join(process.cwd(), this.dirPath);
                    filePath_1 = path_1.default.join(rootPath, "".concat(filename));
                    if (!fs_1.default.existsSync(rootPath)) {
                        fs_1.default.mkdirSync(rootPath, { recursive: true });
                    }
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.currentWriteStream = fs_1.default.createWriteStream(filePath_1);
                            file.pipe(_this.currentWriteStream);
                            _this.currentWriteStream.once('finish', function () {
                                fs_1.default.chmodSync(filePath_1, 384);
                                _this.currentWriteStream = undefined;
                                resolve(filePath_1);
                            });
                            _this.currentWriteStream.once('error', reject);
                        })];
                }
                catch (err) {
                    throw err;
                }
                return [2 /*return*/];
            });
        });
    };
    LocalStorage.prototype.read = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs_1.default.promises.readFile(url)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return LocalStorage;
}());
exports.LocalStorage = LocalStorage;
