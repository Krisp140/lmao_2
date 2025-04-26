// Direct message protocol definitions
import { type Codec, decodeMessage, type DecodeOptions, encodeMessage, enumeration, message } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface dm {}

export namespace dm {
  export enum Status {
    UNKNOWN = 0,
    OK = 1,
    ERROR = 2
  }

  export namespace Status {
    export const codec = (): Codec<Status> => {
      return enumeration<Status>({
        UNKNOWN: 0,
        OK: 1,
        ERROR: 2
      })
    }
  }

  export interface Metadata {
    clientVersion: string
    timestamp: bigint
    extra?: Record<string, string>
  }

  export namespace Metadata {
    let _codec: Codec<Metadata>

    export const codec = (): Codec<Metadata> => {
      if (_codec == null) {
        _codec = message<Metadata>((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork()
          }

          if ((obj.clientVersion != null && obj.clientVersion !== '')) {
            w.uint32(10)
            w.string(obj.clientVersion)
          }

          if ((obj.timestamp != null)) {
            w.uint32(16)
            w.int64(obj.timestamp)
          }

          if (opts.lengthDelimited !== false) {
            w.ldelim()
          }
        }, (reader, length, opts = {}) => {
          const obj: any = {
            clientVersion: '',
            timestamp: BigInt(0)
          }

          const end = length == null ? reader.len : reader.pos + length

          while (reader.pos < end) {
            const tag = reader.uint32()

            switch (tag >>> 3) {
              case 1: {
                obj.clientVersion = reader.string()
                break
              }
              case 2: {
                obj.timestamp = reader.int64()
                break
              }
              default: {
                reader.skipType(tag & 7)
                break
              }
            }
          }

          return obj
        })
      }

      return _codec
    }

    export const encode = (obj: Partial<Metadata>): Uint8Array => {
      return encodeMessage(obj, Metadata.codec())
    }

    export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<Metadata>): Metadata => {
      return decodeMessage(buf, Metadata.codec(), opts)
    }
  }

  export interface DirectMessageRequest {
    content: string
    type: string
    metadata: Metadata
  }

  export namespace DirectMessageRequest {
    let _codec: Codec<DirectMessageRequest>

    export const codec = (): Codec<DirectMessageRequest> => {
      if (_codec == null) {
        _codec = message<DirectMessageRequest>((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork()
          }

          if (obj.metadata != null) {
            w.uint32(10)
            Metadata.codec().encode(obj.metadata, w)
          }

          if ((obj.content != null && obj.content !== '')) {
            w.uint32(18)
            w.string(obj.content)
          }

          if ((obj.type != null && obj.type !== '')) {
            w.uint32(26)
            w.string(obj.type)
          }

          if (opts.lengthDelimited !== false) {
            w.ldelim()
          }
        }, (reader, length, opts = {}) => {
          const obj: any = {
            content: '',
            type: '',
            metadata: { clientVersion: '', timestamp: BigInt(0) }
          }

          const end = length == null ? reader.len : reader.pos + length

          while (reader.pos < end) {
            const tag = reader.uint32()

            switch (tag >>> 3) {
              case 1: {
                obj.metadata = Metadata.codec().decode(reader, reader.uint32())
                break
              }
              case 2: {
                obj.content = reader.string()
                break
              }
              case 3: {
                obj.type = reader.string()
                break
              }
              default: {
                reader.skipType(tag & 7)
                break
              }
            }
          }

          return obj
        })
      }

      return _codec
    }

    export const encode = (obj: Partial<DirectMessageRequest>): Uint8Array => {
      return encodeMessage(obj, DirectMessageRequest.codec())
    }

    export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<DirectMessageRequest>): DirectMessageRequest => {
      return decodeMessage(buf, DirectMessageRequest.codec(), opts)
    }
  }

  export interface DirectMessageResponse {
    status: Status
    metadata: Metadata
    error?: string
  }

  export namespace DirectMessageResponse {
    let _codec: Codec<DirectMessageResponse>

    export const codec = (): Codec<DirectMessageResponse> => {
      if (_codec == null) {
        _codec = message<DirectMessageResponse>((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork()
          }

          if (obj.metadata != null) {
            w.uint32(10)
            Metadata.codec().encode(obj.metadata, w)
          }

          if (obj.status != null && obj.status !== Status.UNKNOWN) {
            w.uint32(16)
            w.int32(obj.status)
          }

          if ((obj.error != null && obj.error !== '')) {
            w.uint32(26)
            w.string(obj.error)
          }

          if (opts.lengthDelimited !== false) {
            w.ldelim()
          }
        }, (reader, length, opts = {}) => {
          const obj: any = {
            status: Status.UNKNOWN,
            metadata: { clientVersion: '', timestamp: BigInt(0) }
          }

          const end = length == null ? reader.len : reader.pos + length

          while (reader.pos < end) {
            const tag = reader.uint32()

            switch (tag >>> 3) {
              case 1: {
                obj.metadata = Metadata.codec().decode(reader, reader.uint32())
                break
              }
              case 2: {
                obj.status = reader.int32()
                break
              }
              case 3: {
                obj.error = reader.string()
                break
              }
              default: {
                reader.skipType(tag & 7)
                break
              }
            }
          }

          return obj
        })
      }

      return _codec
    }

    export const encode = (obj: Partial<DirectMessageResponse>): Uint8Array => {
      return encodeMessage(obj, DirectMessageResponse.codec())
    }

    export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<DirectMessageResponse>): DirectMessageResponse => {
      return decodeMessage(buf, DirectMessageResponse.codec(), opts)
    }
  }
} 