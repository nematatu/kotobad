# 2026-02-04 Next Static Asset 404 / CPU time limit

## 概要
- iOS 端末で、**存在しない woff2 を大量に参照**し続ける事象が発生
- 404 が連続し、**Workers の CPU time limit 超過**や **hung** が発生
- 静的アセットのキャッシュ戦略と、ビルド成果物の参照整合性が原因

## 背景
- 静的ファイル（`/_next/static/*`）はキャッシュして高速化したい
- しかし、**ビルドで生成される CSS/JS が参照するアセットが削除**されると、
  端末の古い CSS が **存在しないアセットを無限に参照**して 404 を発生させる
- 今回は **フォントの削除・変更**により、古い CSS が `woff2` を参照し続けた

## ログ（原文）

### Workers runtime hung（cf-worker）
```json
{
  "message": "The Workers runtime canceled this request because it detected that your Worker's code had hung and would never generate a response. Refer to: https://developers.cloudflare.com/workers/observability/errors/",
  "exception": {
    "name": "Error",
    "message": "The Workers runtime canceled this request because it detected that your Worker's code had hung and would never generate a response. Refer to: https://developers.cloudflare.com/workers/observability/errors/",
    "timestamp": 1770199886427
  },
  "$workers": {
    "truncated": false,
    "event": {
      "request": {
        "url": "https://kotobad.com/?_rsc=f1dk0",
        "method": "GET",
        "path": "/",
        "search": {
          "_rsc": "f1dk0"
        }
      }
    },
    "outcome": "canceled",
    "scriptName": "kotobad-frontend",
    "eventType": "fetch",
    "executionModel": "stateless",
    "scriptVersion": {
      "id": "44213a77-bb34-4e29-9c79-4dc5f754a5c0"
    },
    "requestId": "9c8962430fe88388"
  },
  "$metadata": {
    "id": "01KGM25AJVMZCRMPA6RWVP307C",
    "requestId": "9c8962430fe88388",
    "trigger": "GET /",
    "service": "kotobad-frontend",
    "level": "error",
    "error": "The Workers runtime canceled this request because it detected that your Worker's code had hung and would never generate a response. Refer to: https://developers.cloudflare.com/workers/observability/errors/",
    "message": "The Workers runtime canceled this request because it detected that your Worker's code had hung and would never generate a response. Refer to: https://developers.cloudflare.com/workers/observability/errors/",
    "account": "b55858b0d5c41b055859b1e758ddf3a2",
    "type": "cf-worker",
    "fingerprint": "768cec2afb663a3f7e619757fc1d63bd",
    "origin": "fetch",
    "messageTemplate": "The Workers runtime canceled this request because it detected that your Worker's code had hung and would never generate a response. Refer to: https://developers.cloudflare.com/workers/observability/errors/"
  }
}
```

### CPU time limit 超過（連発）
```
message
2026-02-04 19:11:43:988
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:988
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:977
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:977
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:977
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:952
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:952
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:952
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:929
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:929
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:929
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:924
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:924
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:924
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:917
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:917
JST
log
Worker exceeded CPU time limit.
2026-02-04 19:11:43:917
JST
log
Worker exceeded CPU time limit.
```

### woff2 404（iOS）
```json
{
  "level": "info",
  "message": "GET https://kotobad.com/_next/static/media/c57cd7cf1f8662ed-s.p.woff2",
  "$workers": {
    "event": {
      "request": {
        "url": "https://kotobad.com/_next/static/media/c57cd7cf1f8662ed-s.p.woff2",
        "method": "GET",
        "headers": {
          "accept": "*/*",
          "accept-encoding": "gzip, br",
          "accept-language": "ja",
          "cf-connecting-ip": "2001:f76:7840:4200:d41f:2777:81c7:35b9",
          "cf-ipcountry": "JP",
          "cf-ray": "9c897a30d9e0c899",
          "cf-visitor": "{"scheme":"https"}",
          "connection": "Keep-Alive",
          "cookie": "REDACTED",
          "host": "kotobad.com",
          "origin": "https://kotobad.com",
          "priority": "u=3, i",
          "referer": "https://kotobad.com/threads/53",
          "sec-fetch-dest": "font",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1",
          "x-forwarded-proto": "https",
          "x-real-ip": "2001:f76:7840:4200:d41f:2777:81c7:35b9"
        },
        "cf": {
          "httpProtocol": "HTTP/3",
          "clientAcceptEncoding": "gzip, deflate, br",
          "requestPriority": "",
          "edgeRequestKeepAliveStatus": 1,
          "requestHeaderNames": {},
          "clientTcpRtt": 0,
          "colo": "KIX",
          "asn": 2519,
          "asOrganization": "ARTERIA Networks Corporation",
          "country": "JP",
          "isEUCountry": false,
          "city": "Miyazaki",
          "continent": "AS",
          "region": "Miyazaki",
          "regionCode": "45",
          "timezone": "Asia/Tokyo",
          "longitude": "131.41667",
          "latitude": "31.91667",
          "postalCode": "880-0000",
          "tlsVersion": "TLSv1.3",
          "tlsCipher": "AEAD-AES128-GCM-SHA256",
          "tlsClientRandom": "QZHrqObh93C6Jw3meSf5u83EgsMWkTVWnX+neatkPwI=",
          "tlsClientCiphersSha1": "2SKCJrVPJ5Gw3bPf1m2zIZskTlo=",
          "tlsClientExtensionsSha1": "rw/YA76xyKo4ofzIfFjTxm9u+PI=",
          "tlsClientExtensionsSha1Le": "",
          "tlsClientHelloLength": "259",
          "tlsClientAuth": {
            "certPresented": "0",
            "certVerified": "NONE",
            "certRevoked": "0",
            "certIssuerDN": "",
            "certSubjectDN": "",
            "certIssuerDNRFC2253": "",
            "certSubjectDNRFC2253": "",
            "certIssuerDNLegacy": "",
            "certSubjectDNLegacy": "",
            "certSerial": "",
            "certIssuerSerial": "",
            "certSKI": "",
            "certIssuerSKI": "",
            "certFingerprintSHA1": "",
            "certFingerprintSHA256": "",
            "certNotBefore": "",
            "certNotAfter": ""
          },
          "verifiedBotCategory": "",
          "botManagement": {
            "corporateProxy": false,
            "verifiedBot": false,
            "jsDetection": { "passed": false },
            "staticResource": false,
            "detectionIds": {},
            "score": 99
          }
        },
        "path": "/_next/static/media/c57cd7cf1f8662ed-s.p.woff2"
      },
      "rayId": "9c897a30d9e0c899",
      "response": { "status": 404 }
    },
    "diagnosticsChannelEvents": [],
    "truncated": false,
    "scriptName": "kotobad-frontend",
    "outcome": "ok",
    "eventType": "fetch",
    "executionModel": "stateless",
    "scriptVersion": {
      "id": "06f44102-f13f-44cf-816c-525c6f6d1108"
    },
    "requestId": "9c897a30d9e0c899",
    "cpuTimeMs": 7,
    "wallTimeMs": 2002
  },
  "$metadata": {
    "id": "01KGM336PB5SD3S08XVBJFQYS8",
    "requestId": "9c897a30d9e0c899",
    "trigger": "GET /_next/static/media/c57cd7cf1f8662ed-s.p.woff2",
    "service": "kotobad-frontend",
    "level": "info",
    "message": "GET https://kotobad.com/_next/static/media/c57cd7cf1f8662ed-s.p.woff2",
    "account": "b55858b0d5c41b055859b1e758ddf3a2",
    "type": "cf-worker-event",
    "fingerprint": "14f159ba9b921842eda69831a4e94284",
    "origin": "fetch",
    "messageTemplate": "GET https://kotobad.com/_next/static/media/c57cd7cf1f8662ed-s.p.woff2"
  }
}
```

## 原因
- **古い CSS/JS が参照するアセットが新ビルドで削除**された
- 端末は古い CSS を保持しており、**削除済み woff2 を再取得し続けた**
- 404 が連続し、**Workers の CPU time limit 超過**を引き起こした

## 対応方針（採用）
### 1) ビルド成果物の参照整合性チェック
- **ビルド生成物（CSS/JS）から `/_next/static/...` 参照を抽出**
- **前回スナップショット（R2）と比較**し、
  参照先アセットが消えていれば **ビルドを失敗させる**
- **スナップショットは R2 に保存**し、毎回更新

### 2) スナップショットを履歴化
- **UNIX 秒をファイル名に付与**し、過去履歴を保持
- 最新版と履歴版の両方を保存

## 実装（ワークフロー）
1. **ビルド成果物の CSS/JS から参照を抽出**
2. **R2 から前回スナップショットを取得**
3. **参照先アセットが存在するかチェック**
4. 問題がなければ **新しいスナップショットを保存・R2にアップロード**

## 注意点 / 誤検知への対応
- `/_next/static/media/` のような **ディレクトリ参照**が混入すると誤検知になる
- そのため、**「拡張子がある参照のみ」**を記録するフィルタを追加

## 参考ログ（ビルド時）
```
Downloading "ops/next-static-assets-snapshot.json" from "kotobad-assets-snapshot".
Download complete.
アセットが削除されました。404になる可能性があります。
- /_next/static/media/ -> .open-next/assets/_next/static/media
error: script "build:check-and-save-assets" exited with code 1
```

## コマンドログ（原文）

### wrangler r2 object list（失敗）
```
✘ [ERROR] Unknown arguments: bucket, prefix, remote, list

wrangler r2 object

Manage R2 objects

COMMANDS
  wrangler r2 object get <objectPath>     Fetch an object from an R2 bucket
  wrangler r2 object put <objectPath>     Create an object in an R2 bucket
  wrangler r2 object delete <objectPath>  Delete an object in an R2 bucket
```

### next.config.js ロード失敗（initOpenNextCloudflareForDev）
```
⨯ Failed to load next.config.js, see more info here https://nextjs.org/docs/messages/next-config-error

> Build error occurred
ReferenceError: initOpenNextCloudflareForDev is not defined
    at Object.<anonymous> (next.config.js:59:1)
error: script "build" exited with code 1
error: script "cf:build" exited with code 1
Failed: error occurred while running build command
```

### R2 スナップショット初回取得 → バケット不一致で失敗
```
Downloading "ops/next-static-assets-snapshot.json" from "kotobad-assets-snapshots".

✘ [ERROR] The specified key does not exist.

Snapshot not found: docs/incidents/next-static-assets-snapshot.json. Creating a new baseline.
Saved snapshot: docs/incidents/next-static-assets-snapshot.json

Creating object "ops/next-static-assets-snapshot.json" in bucket "kotobad-assets-snapshots".

✘ [ERROR] The specified bucket does not exist.

wrangler failed: wrangler r2 object put kotobad-assets-snapshots/ops/next-static-assets-snapshot.json --remote --file docs/incidents/next-static-assets-snapshot.json --config wrangler.jsonc
error: script "build:check-and-save-assets" exited with code 1
```

### R2 スナップショット取得 → 作成成功
```
Downloading "ops/next-static-assets-snapshot.json" from "kotobad-assets-snapshot".

✘ [ERROR] The specified key does not exist.

Snapshot not found: docs/incidents/next-static-assets-snapshot.json. Creating a new baseline.
Saved snapshot: docs/incidents/next-static-assets-snapshot.json

Creating object "ops/next-static-assets-snapshot.json" in bucket "kotobad-assets-snapshot".
Upload complete.
Saved 1 refs
```

### 参照チェック時の誤検知ログ（ディレクトリ参照混入）
```
Downloading "ops/next-static-assets-snapshot.json" from "kotobad-assets-snapshot".
Download complete.
アセットが削除されました。404になる可能性があります。
- /_next/static/media/ -> .open-next/assets/_next/static/media
error: script "build:check-and-save-assets" exited with code 1
```

## 結論
- **静的アセットのキャッシュは維持する**
- 代わりに、**ビルド時に参照整合性を強制チェック**し、
  「参照が残っているのに削除された」状態を防ぐ

