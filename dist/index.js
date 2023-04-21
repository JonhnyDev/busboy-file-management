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
var busboy_1 = __importDefault(require("busboy"));
var bl_1 = __importDefault(require("bl"));
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var crypto_1 = require("crypto");
var BusboyFileManagement = /** @class */ (function () {
    function BusboyFileManagement(options) {
        var _a;
        this.LIMIT = 5 * 1024 * 1024;
        this.MAXLIMIT = 25 * 1024 * 1024; // Limite maximum size 25 megas.
        this.Options = {};
        this.Options = options || {};
        this.TYPE = (_a = options === null || options === void 0 ? void 0 : options.type) !== null && _a !== void 0 ? _a : 'memory';
    }
    BusboyFileManagement.prototype.handle = function (req, _res, next) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            var BusBoy, files;
            var _this = this;
            return __generator(this, function (_h) {
                if (!req.is('multipart/form-data'))
                    return [2 /*return*/, next()];
                if ((_a = this.Options) === null || _a === void 0 ? void 0 : _a.ignoreInternalLimit) {
                    if (!((_b = this.Options) === null || _b === void 0 ? void 0 : _b.limit))
                        throw new Error("Se você definir o ignoreInternalLimit como true, limit deve ter um ser definido e ter um valor numerico.");
                    this.MAXLIMIT = (_c = this.Options) === null || _c === void 0 ? void 0 : _c.limit;
                }
                else {
                    if ((_d = this.Options) === null || _d === void 0 ? void 0 : _d.limit) {
                        if (((_e = this.Options) === null || _e === void 0 ? void 0 : _e.limit) < this.MAXLIMIT) {
                            this.MAXLIMIT = (_f = this.Options) === null || _f === void 0 ? void 0 : _f.limit;
                        }
                        this.MAXLIMIT = (_g = this.Options) === null || _g === void 0 ? void 0 : _g.limit;
                    }
                }
                BusBoy = (0, busboy_1.default)({ headers: req.headers, limits: { fileSize: this.MAXLIMIT } });
                files = [];
                BusBoy.on('file', function (fieldname, file, _a) {
                    var filename = _a.filename, encoding = _a.encoding, mimeType = _a.mimeType;
                    return __awaiter(_this, void 0, void 0, function () {
                        var fileData, err_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.processFile(fieldname, file, { filename: filename, encoding: encoding, mimeType: mimeType })];
                                case 1:
                                    fileData = _b.sent();
                                    files.push(fileData);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_1 = _b.sent();
                                    return [2 /*return*/, next(err_1)];
                                case 3: return [2 /*return*/];
                            }
                        });
                    });
                });
                BusBoy.on('finish', function () { return next(); });
                BusBoy.on('error', function (error) { return next(error); });
                req.files = files || [];
                req.body = req.body || {};
                req.on('close', function () { return BusBoy.destroy(); });
                req.pipe(BusBoy);
                return [2 /*return*/];
            });
        });
    };
    BusboyFileManagement.prototype.processFile = function (fieldname, file, _a) {
        var _b;
        var filename = _a.filename, encoding = _a.encoding, mimeType = _a.mimeType;
        return __awaiter(this, void 0, void 0, function () {
            var data, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        if (file === null || file === void 0 ? void 0 : file.truncated) {
                            throw new Error('The uploaded file exceeds the maximum size allowed by the server');
                        }
                        return [4 /*yield*/, this[this.TYPE](file, fieldname)];
                    case 1:
                        data = _c.sent();
                        return [2 /*return*/, {
                                fieldname: fieldname,
                                buffer: data.buffer,
                                originalname: filename,
                                encoding: encoding,
                                mimetype: mimeType,
                                truncated: (_b = file === null || file === void 0 ? void 0 : file.truncated) !== null && _b !== void 0 ? _b : false,
                                size: Buffer.byteLength(data.buffer, 'binary'),
                                url: data.url,
                            }];
                    case 2:
                        err_2 = _c.sent();
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BusboyFileManagement.prototype.temporary = function (file, fieldname) {
        return __awaiter(this, void 0, void 0, function () {
            var tmpFile;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tmpFile = path_1.default.join(os_1.default.tmpdir(), "".concat(fieldname, "-").concat((0, crypto_1.randomUUID)()));
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var writeStream = fs_1.default.createWriteStream(tmpFile);
                                file.pipe(writeStream);
                                writeStream.on('finish', resolve);
                                writeStream.on('error', reject);
                            })];
                    case 1:
                        _b.sent();
                        _a = {};
                        return [4 /*yield*/, fs_1.default.promises.readFile(tmpFile)];
                    case 2: return [2 /*return*/, (_a.buffer = _b.sent(),
                            _a.url = tmpFile,
                            _a)];
                }
            });
        });
    };
    BusboyFileManagement.prototype.memory = function (file, fieldname) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                file.pipe((0, bl_1.default)(function (err, data) {
                                    if (err || !(data.length || fieldname)) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(data);
                                    }
                                }));
                            })];
                    case 1: return [2 /*return*/, (_a.buffer = (_b.sent()),
                            _a.url = '',
                            _a)];
                }
            });
        });
    };
    return BusboyFileManagement;
}());
exports.default = BusboyFileManagement;
