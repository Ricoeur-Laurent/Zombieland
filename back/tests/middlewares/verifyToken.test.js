import dotenv from 'dotenv';
dotenv.config();
import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../../src/middlewares/verifyToken.js';

// Mock the jsonwebtoken module to control its behavior in tests
vi.mock('jsonwebtoken');

describe('verifyToken middleware', () => {
	let req;
	let res;
	let next;

	// Fake payload representing a valid decoded JWT user object
	const fakeUserPayload = {
		id: 1,
		firstname: 'Test',
		lastname: 'Test',
		email: 'test@example.com',
		admin: false,
	};

	// By default, mock jwt.verify to return the fake user payload
	jwt.verify.mockImplementation(() => fakeUserPayload);

	// Initialize mock request with empty headers and cookies
	beforeEach(() => {
		req = {
			headers: {},
			cookies: {},
		};
		// Mock response with status and json methods (status returns this for chaining)
		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		};
		// Mock next function to track if middleware calls it
		next = vi.fn();

		// Reset mock calls and implementations of jwt.verify before each test
		jwt.verify.mockReset();
	});

	it("devrait renvoyer 401 si aucun token n'est fourni", () => {
		verifyToken(req, res, next);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ error: 'Token manquant' });
	});

	it("devrait autoriser l'accès si le token est valide dans l'en-tête", () => {
		// Set a valid token in the Authorization header
		req.headers.authorization = 'Bearer valid.token.header';
		jwt.verify.mockReturnValue(fakeUserPayload);

		verifyToken(req, res, next);

		// Check jwt.verify was called with correct token and secret
		expect(jwt.verify).toHaveBeenCalledWith('valid.token.header', process.env.JWT_SECRET);
		// Confirm user info is attached to req object
		expect(req.user).toEqual(fakeUserPayload);
		// Confirm next middleware was called
		expect(next).toHaveBeenCalled();
	});

	it("devrait autoriser l'accès si le token est valide dans les cookies", () => {
		// Set a valid token in cookies
		req.cookies.token = 'valid.token.cookie';
		jwt.verify.mockReturnValue(fakeUserPayload);

		verifyToken(req, res, next);

		// Check jwt.verify was called with correct token and secret
		expect(jwt.verify).toHaveBeenCalledWith('valid.token.cookie', process.env.JWT_SECRET);
		// Confirm user info is attached to req object
		expect(req.user).toEqual(fakeUserPayload);
		// Confirm next middleware was called
		expect(next).toHaveBeenCalled();
	});

	it('devrait renvoyer 403 si le token est invalide', () => {
		// Set an invalid token in the Authorization header
		req.headers.authorization = 'Bearer invalid.token';
		// Make jwt.verify throw an error to simulate invalid token
		jwt.verify.mockImplementation(() => {
			throw new Error('Invalid token');
		});

		verifyToken(req, res, next);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide ou expiré' });
	});
});
