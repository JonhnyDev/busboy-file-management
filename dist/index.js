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
exports.LocalStorage = exports.TemporaryStorage = exports.MemoryStorage = exports.BusboyFileManagement = void 0;
var busboy_1 = __importDefault(require("busboy"));
var MemoryStorage_1 = require("./store/MemoryStorage");
Object.defineProperty(exports, "MemoryStorage", { enumerable: true, get: function () { return MemoryStorage_1.MemoryStorage; } });
var TemporaryStorage_1 = require("./store/TemporaryStorage");
Object.defineProperty(exports, "TemporaryStorage", { enumerable: true, get: function () { return TemporaryStorage_1.TemporaryStorage; } });
var LocalStorage_1 = require("./store/LocalStorage");
Object.defineProperty(exports, "LocalStorage", { enumerable: true, get: function () { return LocalStorage_1.LocalStorage; } });
var crypto_1 = require("crypto");
var BusboyFileManagement = /** @class */ (function () {
    function BusboyFileManagement(settings) {
        this.settings = settings;
        this.MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
        this.DEFAULT_LIMITS = { fileSize: this.MAX_FILE_SIZE, files: 1 };
        this.updateUploadFiles = [];
        this.inProcess = {};
        this.DEFAULT_LIMITS = __assign({}, this.settings.limits);
    }
    BusboyFileManagement.prototype.handle = function (req, _res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var busboy_2, uploadedFiles, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!req.is('multipart/form-data'))
                            return [2 /*return*/, next()];
                        busboy_2 = this.createBusboy(req);
                        return [4 /*yield*/, this.processFiles(busboy_2)];
                    case 1:
                        uploadedFiles = _a.sent();
                        req.files = uploadedFiles;
                        return [2 /*return*/, next()];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, next(err_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BusboyFileManagement.prototype.createBusboy = function (req) {
        var busboyInstance = (0, busboy_1.default)({ headers: req.headers, limits: this.DEFAULT_LIMITS });
        req.on('close', function () { return busboyInstance.destroy(); });
        req.pipe(busboyInstance);
        return busboyInstance;
    };
    BusboyFileManagement.prototype.processFiles = function (busboy) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var FileListiner = function (fieldname, file, fileInfo) { return __awaiter(_this, void 0, void 0, function () {
                            var uuid, result, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        uuid = (0, crypto_1.randomUUID)();
                                        this.inProcess[uuid] = __assign(__assign({}, this.inProcess[uuid]), { processed: false });
                                        file.on('error', function (error) { return busboy.emit('error', error); });
                                        return [4 /*yield*/, this.processFile(fieldname, file, fileInfo)];
                                    case 1:
                                        result = _a.sent();
                                        this.updateUploadFiles.push(result);
                                        this.inProcess[uuid] = __assign({}, result);
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_1 = _a.sent();
                                        reject(error_1);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        var closeListiner = function () {
                            _this.checkloading = setInterval(function () {
                                var allProcessed = Object.values(_this.inProcess).every(function (file) { return file.processed; });
                                if (allProcessed) {
                                    clearInterval(_this.checkloading);
                                    resolve(_this.updateUploadFiles);
                                }
                            }, 5);
                        };
                        var errorListiner = function (error) {
                            busboy.removeListener('close', closeListiner);
                            clearInterval(_this.checkloading);
                            reject(error);
                        };
                        busboy.on('file', FileListiner);
                        busboy.on('close', closeListiner);
                        busboy.on('error', errorListiner);
                        busboy.on('filesLimit', function () { return busboy.emit('error', new Error("Limit exceeded, allowed only ".concat(_this.DEFAULT_LIMITS.files, " files."))); });
                    })];
            });
        });
    };
    BusboyFileManagement.prototype.processFile = function (fieldname, file, _a) {
        var filename = _a.filename, encoding = _a.encoding, mimeType = _a.mimeType;
        return __awaiter(this, void 0, void 0, function () {
            var url, buffer, extra;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!filename)
                            throw new Error('The file must have a name');
                        return [4 /*yield*/, this.settings.storage.write(file, filename)];
                    case 1:
                        url = _b.sent();
                        if (!('truncated' in file && file.truncated)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.settings.storage.destroy(url)];
                    case 2:
                        _b.sent();
                        throw new Error('The uploaded file exceeds the maximum size allowed by the server');
                    case 3: return [4 /*yield*/, this.settings.storage.read(url)];
                    case 4:
                        buffer = _b.sent();
                        extra = {};
                        if (!(typeof this.settings.storage.persist === 'function')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.settings.storage.persist(url)];
                    case 5:
                        extra = _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, {
                            fieldname: fieldname,
                            buffer: buffer,
                            encoding: encoding,
                            url: url,
                            extra: extra,
                            originalname: filename,
                            mimetype: mimeType,
                            size: buffer.byteLength,
                            processed: true
                        }];
                }
            });
        });
    };
    return BusboyFileManagement;
}());
exports.BusboyFileManagement = BusboyFileManagement;
