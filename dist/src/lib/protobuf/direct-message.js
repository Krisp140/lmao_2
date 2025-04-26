// Direct message protocol definitions
import { decodeMessage, encodeMessage, enumeration, message } from 'protons-runtime';
export var dm;
(function (dm) {
    let Status;
    (function (Status) {
        Status[Status["UNKNOWN"] = 0] = "UNKNOWN";
        Status[Status["OK"] = 1] = "OK";
        Status[Status["ERROR"] = 2] = "ERROR";
    })(Status = dm.Status || (dm.Status = {}));
    (function (Status) {
        Status.codec = () => {
            return enumeration({
                UNKNOWN: 0,
                OK: 1,
                ERROR: 2
            });
        };
    })(Status = dm.Status || (dm.Status = {}));
    let Metadata;
    (function (Metadata) {
        let _codec;
        Metadata.codec = () => {
            if (_codec == null) {
                _codec = message((obj, w, opts = {}) => {
                    if (opts.lengthDelimited !== false) {
                        w.fork();
                    }
                    if ((obj.clientVersion != null && obj.clientVersion !== '')) {
                        w.uint32(10);
                        w.string(obj.clientVersion);
                    }
                    if ((obj.timestamp != null)) {
                        w.uint32(16);
                        w.int64(obj.timestamp);
                    }
                    if (opts.lengthDelimited !== false) {
                        w.ldelim();
                    }
                }, (reader, length, opts = {}) => {
                    const obj = {
                        clientVersion: '',
                        timestamp: BigInt(0)
                    };
                    const end = length == null ? reader.len : reader.pos + length;
                    while (reader.pos < end) {
                        const tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                obj.clientVersion = reader.string();
                                break;
                            }
                            case 2: {
                                obj.timestamp = reader.int64();
                                break;
                            }
                            default: {
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                    }
                    return obj;
                });
            }
            return _codec;
        };
        Metadata.encode = (obj) => {
            return encodeMessage(obj, Metadata.codec());
        };
        Metadata.decode = (buf, opts) => {
            return decodeMessage(buf, Metadata.codec(), opts);
        };
    })(Metadata = dm.Metadata || (dm.Metadata = {}));
    let DirectMessageRequest;
    (function (DirectMessageRequest) {
        let _codec;
        DirectMessageRequest.codec = () => {
            if (_codec == null) {
                _codec = message((obj, w, opts = {}) => {
                    if (opts.lengthDelimited !== false) {
                        w.fork();
                    }
                    if (obj.metadata != null) {
                        w.uint32(10);
                        Metadata.codec().encode(obj.metadata, w);
                    }
                    if ((obj.content != null && obj.content !== '')) {
                        w.uint32(18);
                        w.string(obj.content);
                    }
                    if ((obj.type != null && obj.type !== '')) {
                        w.uint32(26);
                        w.string(obj.type);
                    }
                    if (opts.lengthDelimited !== false) {
                        w.ldelim();
                    }
                }, (reader, length, opts = {}) => {
                    const obj = {
                        content: '',
                        type: '',
                        metadata: { clientVersion: '', timestamp: BigInt(0) }
                    };
                    const end = length == null ? reader.len : reader.pos + length;
                    while (reader.pos < end) {
                        const tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                obj.metadata = Metadata.codec().decode(reader, reader.uint32());
                                break;
                            }
                            case 2: {
                                obj.content = reader.string();
                                break;
                            }
                            case 3: {
                                obj.type = reader.string();
                                break;
                            }
                            default: {
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                    }
                    return obj;
                });
            }
            return _codec;
        };
        DirectMessageRequest.encode = (obj) => {
            return encodeMessage(obj, DirectMessageRequest.codec());
        };
        DirectMessageRequest.decode = (buf, opts) => {
            return decodeMessage(buf, DirectMessageRequest.codec(), opts);
        };
    })(DirectMessageRequest = dm.DirectMessageRequest || (dm.DirectMessageRequest = {}));
    let DirectMessageResponse;
    (function (DirectMessageResponse) {
        let _codec;
        DirectMessageResponse.codec = () => {
            if (_codec == null) {
                _codec = message((obj, w, opts = {}) => {
                    if (opts.lengthDelimited !== false) {
                        w.fork();
                    }
                    if (obj.metadata != null) {
                        w.uint32(10);
                        Metadata.codec().encode(obj.metadata, w);
                    }
                    if (obj.status != null && obj.status !== Status.UNKNOWN) {
                        w.uint32(16);
                        w.int32(obj.status);
                    }
                    if ((obj.error != null && obj.error !== '')) {
                        w.uint32(26);
                        w.string(obj.error);
                    }
                    if (opts.lengthDelimited !== false) {
                        w.ldelim();
                    }
                }, (reader, length, opts = {}) => {
                    const obj = {
                        status: Status.UNKNOWN,
                        metadata: { clientVersion: '', timestamp: BigInt(0) }
                    };
                    const end = length == null ? reader.len : reader.pos + length;
                    while (reader.pos < end) {
                        const tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                obj.metadata = Metadata.codec().decode(reader, reader.uint32());
                                break;
                            }
                            case 2: {
                                obj.status = reader.int32();
                                break;
                            }
                            case 3: {
                                obj.error = reader.string();
                                break;
                            }
                            default: {
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                    }
                    return obj;
                });
            }
            return _codec;
        };
        DirectMessageResponse.encode = (obj) => {
            return encodeMessage(obj, DirectMessageResponse.codec());
        };
        DirectMessageResponse.decode = (buf, opts) => {
            return decodeMessage(buf, DirectMessageResponse.codec(), opts);
        };
    })(DirectMessageResponse = dm.DirectMessageResponse || (dm.DirectMessageResponse = {}));
})(dm || (dm = {}));
