import { describe, it, expect, vi, beforeEach } from 'vitest';
import categoriesControllers from '../../src/controllers/categoriesControllers.js';
import { getMockReq, getMockRes } from '../testUtils.js';

vi.mock('../../src/models/index.js', () => ({
	Categories: {
		findAll: vi.fn(),
		findByPk: vi.fn(),
		create: vi.fn(),
		findOne: vi.fn(),
		save: vi.fn()
	},
}));

import { Categories } from '../../src/models/index.js';

// ================= getAllCategories ==================

describe('categoriesController.getAllCategories', () => {
	let req, res;

	beforeEach(() => {
		req = {};
		res = getMockRes();
	});

	it('should return 200 with a message and the list of all categories', async () => {
		const fakeCategories = [
			{ id: 1, name: 'Survival' },
			{ id: 2, name: 'Escape Game' },
			{ id: 3, name: 'Manege' },
			{ id: 4, name: 'Simulation urbaine' },
			{ id: 5, name: 'Paintball' },
			{ id: 6, name: 'VR' },
		];

		Categories.findAll.mockResolvedValue(fakeCategories);

		await categoriesControllers.getAllCategories(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Catégories récupérées avec succès',
			categories: fakeCategories,
		});
	});

	it('should return 500 with an error message on failure', async () => {
		Categories.findAll.mockRejectedValue(new Error());

		await categoriesControllers.getAllCategories(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Erreur serveur lors de la récupération des catégories.',
		});
	});
});

// =========================== getOneCategory ==========================

describe('categoriesController.getOneCategory', () => {
	let req, res;

	beforeEach(() => {
		res = getMockRes();
	});

	it('should return 200 with a message and the requested category', async () => {
		req = getMockReq({
			checkedParams: { id: 1 },
		});
		const fakeCategory = [{ id: 1, name: 'Survival' }];

		Categories.findByPk.mockResolvedValue(fakeCategory);

		await categoriesControllers.getOneCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Catégorie récupérée avec succès',
			oneCategory: fakeCategory,
		});
	});

	it('should return 404 if the category does not exist', async () => {
		req = getMockReq({
			checkedParams: { id: 999 },
		});

		Categories.findByPk.mockResolvedValue(null);

		await categoriesControllers.getOneCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Catégorie non trouvée',
		});
	});

	it('should return 500 with an error message on failure', async () => {
		Categories.findByPk.mockRejectedValue(new Error());

		await categoriesControllers.getOneCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Erreur serveur interne lors de la récupération de la catégorie',
		});
	});
});

// =========================== createCategory ==========================

describe('categoriesController.createCategory', () => {
	let req, res;

	beforeEach(() => {
		res = getMockRes();
	});

	it('should return 201 with the newly created category', async () => {
		req = getMockReq({
			body: { name: 'Simulation urbaine' },
		});
		const fakeCreated = { id: 7, name: 'Simulation urbaine' };

		Categories.create.mockResolvedValue(fakeCreated);

		await categoriesControllers.createCategory(req, res);

		expect(Categories.create).toHaveBeenCalledWith({ name: 'Simulation urbaine' });
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Catégorie créée avec succès.',
			category: fakeCreated,
		});
	});

	it('should return 500 with an error message if creation fails', async () => {
		req = getMockReq({
			body: { name: 'new category' },
		});

		Categories.create.mockRejectedValue(new Error());

		await categoriesControllers.createCategory(req, res);

		expect(Categories.create).toHaveBeenCalledWith({ name: 'new category' });
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Erreur serveur lors de la création de la catégorie.',
		});
	});

	it('should return 409 if the category name already exists', async () => {
		req = getMockReq({
			body: { name: 'VR' },
		});
		const fakeCreated = { name: 'VR' };

		Categories.findOne.mockResolvedValue(fakeCreated);

		await categoriesControllers.createCategory(req, res);

		expect(Categories.findOne).toHaveBeenCalledWith({ where: { name: 'VR' } });
		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Nom de catégorie déjà utilisé.',
		});
	});

	it('should return 500 with an error message if findOne fails', async () => {
		Categories.findOne.mockRejectedValue(new Error());

		await categoriesControllers.createCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Erreur serveur lors de la création de la catégorie.',
		});
	});
});

// =========================== updateCategory ==========================

describe('categoriesController.updateCategory', () => {
	let req, res;

	beforeEach(() => {
		req = getMockReq({
			body: { name: 'Attaque souterraine' },
			checkedParams: { id: 7 },
		});
		res = getMockRes();
	});

	it('should return 200 with the updated category', async () => {
		const fakeUpdated = {
			id: 7,
			name: 'Attaque souterraine',
			save: vi.fn().mockResolvedValue(),
		};

		Categories.findByPk.mockResolvedValue(fakeUpdated);
		Categories.findOne.mockResolvedValue(null);

		await categoriesControllers.updateCategory(req, res);

		expect(fakeUpdated.save).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Catégorie mise à jour avec succès.',
			category: fakeUpdated,
		});
	});

	it('should return 404 if the category to update does not exist', async () => {
		const fakeUpdated = {
			id: 7,
			name: 'Attaque souterraine',
			save: vi.fn().mockResolvedValue(),
		};

		Categories.findByPk.mockResolvedValue(null);

		await categoriesControllers.updateCategory(req, res);

		expect(fakeUpdated.save).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Catégorie non trouvée.',
		});
	});

	it('should return 500 with an error message on failure', async () => {
		const fakeUpdated = {
			id: 7,
			name: 'Attaque souterraine',
			save: vi.fn().mockResolvedValue(),
		};

		Categories.findByPk.mockRejectedValue(new Error());
		Categories.findOne.mockRejectedValue(new Error());

		await categoriesControllers.updateCategory(req, res);

		expect(fakeUpdated.save).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Erreur serveur lors de la mise à jour de la catégorie.',
		});
	});
});
