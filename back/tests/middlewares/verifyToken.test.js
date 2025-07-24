import dotenv from 'dotenv';
dotenv.config();
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock jsonwebtoken BEFORE importing the middleware
vi.mock('jsonwebtoken', () => ({
	default: {
		verify: vi.fn(), // Create a spy/mock for the verify function
	}
}));

// Import the mocked version of jsonwebtoken
import jwt from 'jsonwebtoken';
// Now import the middleware, which will use the mocked jwt
import { verifyToken } from '../../src/middlewares/verifyToken.js';

describe('verifyToken middleware', () => {
	let req;
	let res;
	let next;

	// Sample decoded token payload for a valid user
	const fakeUserPayload = {
		id: 1,
		firstname: 'Jane',
		lastname: 'Doe',
		email: 'jane.doe@example.com',
		admin: false,
	};

	beforeEach(() => {
		// Mock request with empty headers and cookies
		req = {
			headers: {},
			cookies: {},
		};

		// Mock response with chainable .status() and .json()
		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		};

		// Mock next function (Express)
		next = vi.fn();

		// Clear all previous mocks before each test
		vi.clearAllMocks(); 
	});

	it('devrait renvoyer 401 si aucun token nest fourni', () => {
		verifyToken(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ error: 'Token manquant' });
		expect(next).not.toHaveBeenCalled();
	});

	it("devrait autoriser l'accès si le token est valide dans les cookies", () => {
		req.cookies.zombieland_token = 'valid.token'; // Provide a fake token

		jwt.verify.mockReturnValue(fakeUserPayload); // Simulate jwt verifying the token successfully

		verifyToken(req, res, next);

		expect(jwt.verify).toHaveBeenCalledWith('valid.token', process.env.JWT_SECRET);
		expect(req.user).toEqual(fakeUserPayload);
		expect(next).toHaveBeenCalled();
	});

	it('devrait renvoyer 403 si le token est invalide', () => {
		req.cookies.zombieland_token = 'invalid.token'; // Provide a bad token

		// Simulate jwt throwing an error when trying to verify
		jwt.verify.mockImplementation(() => {
			throw new Error('Token invalide');
		});

		verifyToken(req, res, next);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide ou expiré' });
		expect(next).not.toHaveBeenCalled();
	});
});
