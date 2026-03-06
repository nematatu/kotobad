import { ThreadReplyPushSubscriptionSchema } from "@kotobad/shared/src/schemas/post";
import type { z } from "zod";
import type { Bindings } from "../../../../types";

const STORAGE_PREFIX = "notifications/reply-push-subscriptions";
const MAX_SUBSCRIPTIONS_PER_USER = 10;
const VAPID_JWT_TTL_SECONDS = 12 * 60 * 60;

type PushSubscriptionType = z.infer<typeof ThreadReplyPushSubscriptionSchema>;
type VapidPrivateJwk = {
	kty: "EC";
	crv: "P-256";
	x: string;
	y: string;
	d: string;
	key_ops: ["sign"];
	ext: boolean;
};

const toStorageKey = (userId: string): string =>
	`${STORAGE_PREFIX}/${encodeURIComponent(userId)}.json`;

const normalizeSubscriptions = (raw: unknown): PushSubscriptionType[] => {
	if (!Array.isArray(raw)) {
		return [];
	}
	const normalized: PushSubscriptionType[] = [];
	for (const item of raw) {
		const parsed = ThreadReplyPushSubscriptionSchema.safeParse(item);
		if (parsed.success) {
			normalized.push(parsed.data);
		}
	}
	return normalized;
};

export const readThreadReplyPushSubscriptions = async (
	env: Bindings,
	userId: string,
): Promise<PushSubscriptionType[]> => {
	const key = toStorageKey(userId);
	const object = await env.KOTOBAD_BUCKET.get(key);
	if (!object) {
		return [];
	}
	try {
		const json = await object.json<unknown>();
		return normalizeSubscriptions(json);
	} catch {
		return [];
	}
};

const writeThreadReplyPushSubscriptions = async (
	env: Bindings,
	userId: string,
	subscriptions: PushSubscriptionType[],
): Promise<void> => {
	const key = toStorageKey(userId);
	await env.KOTOBAD_BUCKET.put(
		key,
		JSON.stringify(subscriptions.slice(0, MAX_SUBSCRIPTIONS_PER_USER)),
		{
			httpMetadata: {
				contentType: "application/json; charset=utf-8",
			},
		},
	);
};

export const upsertThreadReplyPushSubscription = async ({
	env,
	userId,
	subscription,
}: {
	env: Bindings;
	userId: string;
	subscription: PushSubscriptionType;
}): Promise<void> => {
	const subscriptions = await readThreadReplyPushSubscriptions(env, userId);
	const filtered = subscriptions.filter(
		(item) => item.endpoint !== subscription.endpoint,
	);
	filtered.unshift(subscription);
	await writeThreadReplyPushSubscriptions(env, userId, filtered);
};

export const removeThreadReplyPushSubscription = async ({
	env,
	userId,
	endpoint,
}: {
	env: Bindings;
	userId: string;
	endpoint: string;
}): Promise<void> => {
	const subscriptions = await readThreadReplyPushSubscriptions(env, userId);
	const filtered = subscriptions.filter((item) => item.endpoint !== endpoint);
	await writeThreadReplyPushSubscriptions(env, userId, filtered);
};

const base64UrlToUint8Array = (value: string): Uint8Array => {
	const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
	const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
};

const uint8ArrayToBase64Url = (value: Uint8Array): string => {
	let binary = "";
	for (const byte of value) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
};

const textToBase64Url = (value: string): string => {
	return uint8ArrayToBase64Url(new TextEncoder().encode(value));
};

const readDerLength = (
	bytes: Uint8Array,
	offset: number,
): { length: number; nextOffset: number } => {
	const first = bytes[offset];
	if ((first & 0x80) === 0) {
		return { length: first, nextOffset: offset + 1 };
	}
	const count = first & 0x7f;
	let length = 0;
	for (let i = 0; i < count; i += 1) {
		length = (length << 8) | bytes[offset + 1 + i];
	}
	return { length, nextOffset: offset + 1 + count };
};

const toFixedLengthInt = (value: Uint8Array, size: number): Uint8Array => {
	let normalized = value;
	while (normalized.length > 0 && normalized[0] === 0x00) {
		normalized = normalized.slice(1);
	}
	if (normalized.length > size) {
		throw new Error("Invalid ECDSA integer length");
	}
	const out = new Uint8Array(size);
	out.set(normalized, size - normalized.length);
	return out;
};

// WebCrypto ECDSA署名(DER)をJWS ES256形式(R||S)へ変換する。
const derSignatureToJose = (der: Uint8Array): Uint8Array => {
	let offset = 0;
	if (der[offset] !== 0x30) {
		throw new Error("Invalid DER signature");
	}
	offset += 1;
	const seqLen = readDerLength(der, offset);
	offset = seqLen.nextOffset;

	if (der[offset] !== 0x02) {
		throw new Error("Invalid DER signature");
	}
	offset += 1;
	const rLen = readDerLength(der, offset);
	offset = rLen.nextOffset;
	const r = der.slice(offset, offset + rLen.length);
	offset += rLen.length;

	if (der[offset] !== 0x02) {
		throw new Error("Invalid DER signature");
	}
	offset += 1;
	const sLen = readDerLength(der, offset);
	offset = sLen.nextOffset;
	const s = der.slice(offset, offset + sLen.length);

	const rFixed = toFixedLengthInt(r, 32);
	const sFixed = toFixedLengthInt(s, 32);
	const jose = new Uint8Array(64);
	jose.set(rFixed, 0);
	jose.set(sFixed, 32);
	return jose;
};

const buildPrivateJwk = ({
	publicKey,
	privateKey,
}: {
	publicKey: string;
	privateKey: string;
}): VapidPrivateJwk => {
	const publicKeyBytes = base64UrlToUint8Array(publicKey);
	const privateKeyBytes = base64UrlToUint8Array(privateKey);

	if (publicKeyBytes.length !== 65 || publicKeyBytes[0] !== 4) {
		throw new Error("Invalid VAPID public key format");
	}
	if (privateKeyBytes.length !== 32) {
		throw new Error("Invalid VAPID private key format");
	}

	const x = uint8ArrayToBase64Url(publicKeyBytes.slice(1, 33));
	const y = uint8ArrayToBase64Url(publicKeyBytes.slice(33, 65));
	const d = uint8ArrayToBase64Url(privateKeyBytes);

	return {
		kty: "EC",
		crv: "P-256",
		x,
		y,
		d,
		key_ops: ["sign"],
		ext: false,
	};
};

const importVapidPrivateCryptoKey = async ({
	publicKey,
	privateKey,
}: {
	publicKey: string;
	privateKey: string;
}): Promise<CryptoKey> => {
	const privateJwk = buildPrivateJwk({ publicKey, privateKey });
	return crypto.subtle.importKey(
		"jwk",
		privateJwk,
		{
			name: "ECDSA",
			namedCurve: "P-256",
		},
		false,
		["sign"],
	);
};

const createVapidJwt = async ({
	endpoint,
	subject,
	privateCryptoKey,
}: {
	endpoint: string;
	subject: string;
	privateCryptoKey: CryptoKey;
}): Promise<string> => {
	const aud = new URL(endpoint).origin;
	const exp = Math.floor(Date.now() / 1000) + VAPID_JWT_TTL_SECONDS;
	const header = textToBase64Url(JSON.stringify({ alg: "ES256", typ: "JWT" }));
	const payload = textToBase64Url(
		JSON.stringify({
			aud,
			exp,
			sub: subject,
		}),
	);

	const unsigned = `${header}.${payload}`;
	const signature = await crypto.subtle.sign(
		{
			name: "ECDSA",
			hash: "SHA-256",
		},
		privateCryptoKey,
		new TextEncoder().encode(unsigned),
	);

	const joseSignature = derSignatureToJose(new Uint8Array(signature));
	return `${unsigned}.${uint8ArrayToBase64Url(joseSignature)}`;
};

const sendWebPushRequest = async ({
	endpoint,
	publicKey,
	jwt,
}: {
	endpoint: string;
	publicKey: string;
	jwt: string;
}): Promise<Response> => {
	const endpointHost = new URL(endpoint).hostname;
	const headers = new Headers({
		TTL: "60",
		Urgency: "normal",
	});

	if (
		endpointHost.includes("fcm.googleapis.com") ||
		endpointHost.includes("googleapis.com")
	) {
		headers.set("Authorization", `WebPush ${jwt}`);
		headers.set("Crypto-Key", `p256ecdsa=${publicKey}`);
	} else {
		headers.set("Authorization", `vapid t=${jwt}, k=${publicKey}`);
	}

	return fetch(endpoint, {
		method: "POST",
		headers,
	});
};

export const sendThreadReplyPushToUser = async ({
	env,
	userId,
}: {
	env: Bindings;
	userId: string;
}): Promise<void> => {
	const publicKey = env.VAPID_PUBLIC_KEY;
	const privateKey = env.VAPID_PRIVATE_KEY;
	const subject = env.VAPID_SUBJECT ?? "mailto:notify@kotobad.com";
	if (!publicKey || !privateKey) {
		return;
	}

	const subscriptions = await readThreadReplyPushSubscriptions(env, userId);
	if (subscriptions.length === 0) {
		return;
	}
	const privateCryptoKey = await importVapidPrivateCryptoKey({
		publicKey,
		privateKey,
	});

	const staleEndpoints = new Set<string>();
	const results = await Promise.all(
		subscriptions.map(async (subscription) => {
			try {
				const jwt = await createVapidJwt({
					endpoint: subscription.endpoint,
					subject,
					privateCryptoKey,
				});

				const response = await sendWebPushRequest({
					endpoint: subscription.endpoint,
					publicKey,
					jwt,
				});

				return {
					endpoint: subscription.endpoint,
					status: response.status,
				};
			} catch {
				return {
					endpoint: subscription.endpoint,
					status: 0,
				};
			}
		}),
	);
	for (const result of results) {
		if (result.status === 404 || result.status === 410) {
			staleEndpoints.add(result.endpoint);
		}
	}

	if (staleEndpoints.size > 0) {
		const filtered = subscriptions.filter(
			(subscription) => !staleEndpoints.has(subscription.endpoint),
		);
		await writeThreadReplyPushSubscriptions(env, userId, filtered);
	}
};
