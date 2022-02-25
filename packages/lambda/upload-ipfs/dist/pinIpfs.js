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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSvgToPIPFS = exports.pinIpfs = void 0;
const axios_1 = __importDefault(require("axios"));
const pinIpfs = (file) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO implement
    const svgBlob = new Blob([file], {
        type: 'image/svg+xml',
    });
    console.log(yield svgBlob.text());
    const cid = yield (0, exports.uploadSvgToPIPFS)({ svg: svgBlob, name: `duck nft -- ${new Date().toISOString()}` });
});
exports.pinIpfs = pinIpfs;
const pinataClient = axios_1.default.create({
    baseURL: 'https://api.pinata.cloud/',
    headers: {
        'Content-Type': 'application/json',
    },
});
const uploadSvgToPIPFS = ({ svg, name }) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = new FormData();
    formData.append('file', svg);
    console.log("data", formData.get("file"));
    formData.append('pinataMetadata', JSON.stringify({
        name,
    }));
    const { data } = yield pinataClient.post('pinning/pinFileToIPFS', formData, {
        maxBodyLength: Infinity,
        headers: {
            'Content-Type': `multipart/form-data;`,
        },
    });
    return data.IpfsHash;
});
exports.uploadSvgToPIPFS = uploadSvgToPIPFS;
