import { vi } from 'vitest'

export function getMockRes() {
	const res = {};
	res.status = vi.fn(() => res);
	res.json = vi.fn(() => res);
	return res;
}

export function getMockReq({ checkedParams = {}, body = {}, params = {}, query = {}} = {}) {
	return {
		checkedParams,
		body,
		params,
		query
	};
}
