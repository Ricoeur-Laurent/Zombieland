import { describe, it, expect, vi, beforeEach } from 'vitest';
import attractionsController from '../../src/controllers/attractionsControllers.js';

// TEST: getAllAttractions
// Full mock of the index.js file from the models folder
vi.mock('../../src/models/index.js', () => ({
	Attractions: {
		findAll: vi.fn(), // Mock the 'findAll' method of the Attractions model
		findByPk: vi.fn(), // Mock the 'findByPk' method for getting by primary key
		findOne: vi.fn(), // Mock the 'findOne' method for querying a single record
		create: vi.fn(), // Mock the 'create' method for inserting a new attraction
		update: vi.fn(), // Mock the 'update' method for modifying an attraction
		delete: vi.fn(), // Mock the 'delete' method for removing an attraction
	},
	Categories: {
		findByPk: vi.fn(), // Mock the 'findByPk' method for the Categories model
	},
}));

// Import `Attractions` and `Categories` AFTER the mock declaration
// This ensures we are importing the mocked versions
import { Categories } from '../../src/models/index.js';
import { Attractions } from '../../src/models/index.js';

// Start of the test suite for getAllAttractions
describe('attractionsController.getAllAttractions', () => {
	let req, res;

	// Before each test, reset the mock request and response objects
	beforeEach(() => {
		req = {};
		res = {
			status: vi.fn(() => res), // Mock res.status() to return res, allowing method chaining (e.g., res.status(200).json(...))
			json: vi.fn(), // Spy on res.json() calls
		};
	});

	// Test case: success scenario where attractions are returned correctly
	it('devrait retourner 200 avec un message et des attractions', async () => {
		// Create a fake list of attractions to simulate the DB response
		const fakeAttractions = [
			{
				id: 1,
				name: 'Le Dedale Maudit',
				slug: 'le-dédale-maudit',
				image: 'le-dedale-maudit.jpg',
				description:
					'Entrez si vous l’osez… Le Zombie Labyrinthe vous ouvre ses portes, mais rien ne garantit que vous en sortirez indemne !',
				categories: [{ id: 1, name: 'Survival' }],
			},
			{
				id: 2,
				name: 'Le Manoir des Ames Perdues',
				slug: 'le-manoir-des-âmes-perdues',
				image: 'le-manoir-des-âmes-perdues.jpg',
				description: 'Bienvenue dans le Manoir Zombie, un ancien domaine abandonné…',
				categories: [{ id: 2, name: 'Escape Game' }],
			},
			{
				id: 3,
				name: 'L’Enfer en Soins Intensifs',
				slug: 'lenfer-en-soins-intensifs',
				image: 'lenfer-en-soins-intensifs.jpg',
				description:
					'Autrefois centre psychiatrique isolé, l’Asile Saint-Croix a été placé sous quarantaine…',
				categories: [{ id: 3, name: 'Manege' }],
			},
		];

		// Configure the mock so that findAll returns the fake attractions
		Attractions.findAll.mockResolvedValue(fakeAttractions);

		await attractionsController.getAllAttractions(req, res);

		// ✅ Check that res.status was called with 200
		expect(res.status).toHaveBeenCalledWith(200);
		// ✅ And that res.json was called with the correct message and attractions
		expect(res.json).toHaveBeenCalledWith({
			message: 'Attractions récupérées avec succès',
			allAttractions: fakeAttractions,
		});
	});
});

// TEST: getOneAttraction
// Start of the test suite for getOneAttraction
describe('attractionsController.getOneAttraction', () => {
	let req, res;

	// Before each test, reset the request and response objects
	beforeEach(() => {
		req = {
			checkedParams: { id: 1 }, // simulate a validated param from middleware
		};
		res = {
			status: vi.fn(() => res), // allow chaining: res.status(200).json(...)
			json: vi.fn(), // spy on JSON response calls
		};
		vi.clearAllMocks(); // clear mocks before each test
	});

	it('devrait retourner 200 et une attraction si elle existe', async () => {
		const fakeAttraction = {
			id: 1,
			name: 'Le Dedale Maudit',
			slug: 'le-dédale-maudit',
			image: 'le-dedale-maudit.jpg',
			description:
				'Entrez si vous l’osez… Le Zombie Labyrinthe vous ouvre ses portes, mais rien ne garantit que vous en sortirez indemne !',
			categories: [{ id: 1, name: 'Survival' }],
		};

		// Mock findByPk to resolve with the fake attraction
		Attractions.findByPk.mockResolvedValue(fakeAttraction);

		await attractionsController.getOneAttraction(req, res);

		// ✅ Ensure findByPk was called with the correct ID
		expect(Attractions.findByPk).toHaveBeenCalledWith(1);
		// ✅ Should return 200 OK status
		expect(res.status).toHaveBeenCalledWith(200);
		// ✅ Should return the attraction in JSON format
		expect(res.json).toHaveBeenCalledWith({
			message: `Attraction récupérée avec succès`,
			oneAttraction: fakeAttraction,
		});
	});

	it(`devrait retourner 404 si l'attraction n'existe pas`, async () => {
		// Simulate no attraction found
		Attractions.findByPk.mockResolvedValue(null); // rien trouvé

		await attractionsController.getOneAttraction(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		// ✅ Should return an appropriate error message
		expect(res.json).toHaveBeenCalledWith({
			message: `L'attraction est introuvable`,
		});
	});

	it('devrait retourner 500 si une erreur serveur survient', async () => {
		// Spy on console.error to silence test output
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		// Simulate a database error
		Attractions.findByPk.mockRejectedValue(new Error('Erreur BDD'));

		await attractionsController.getOneAttraction(req, res);

		// ✅ Should return 500 Internal Server Error
		expect(res.status).toHaveBeenCalledWith(500);
		// ✅ Should return a server error message
		expect(res.json).toHaveBeenCalledWith({
			message: `Erreur serveur interne lors de la récupération de l'attraction`,
		});
	});
});

// TEST: getOneAttractionBySlug
// Start of test suite for getOneAttractionBySlug
describe('attractionsController.getOneAttractionBySlug', () => {
	let req, res;

	beforeEach(() => {
		req = {
			checkedParams: { slug: 'le-dedale-maudit' },  // Simulate validated slug from middleware
		};
		res = {
			status: vi.fn(() => res), // Enable chaining like res.status().json()
			json: vi.fn(),
		};
		vi.clearAllMocks(); // Clear mock calls before each test
	});

	it('devrait retourner 200 et une attraction si elle existe', async () => {
		const fakeAttraction = {
			id: 1,
			name: 'Le Dedale Maudit',
			slug: 'le-dedale-maudit',
			image: 'le-dedale-maudit.jpg',
			description:
				'Entrez si vous l’osez… Le Zombie Labyrinthe vous ouvre ses portes, mais rien ne garantit que vous en sortirez indemne !',
			categories: [{ id: 1, name: 'Survival' }],
		};

		// Mock the DB call to return a valid attraction
		Attractions.findOne.mockResolvedValue(fakeAttraction);

		// Call the controller function
		await attractionsController.getOneAttractionBySlug(req, res);

		// ✅ Check that findOne was called with the correct query
		expect(Attractions.findOne).toHaveBeenCalledWith({
			where: { slug: 'le-dedale-maudit' },
			include: {
				model: expect.any(Object),
				as: 'categories',
				attributes: ['id', 'name'],
			},
		});
		// ✅ Check that the response has 200 OK status
		expect(res.status).toHaveBeenCalledWith(200);
		// ✅ Check that the response contains the expected attraction data
		expect(res.json).toHaveBeenCalledWith({
			message: `Attraction récupérée avec succès`,
			oneAttraction: fakeAttraction,
		});
	});

	it(`devrait retourner 404 si l'attraction n'existe pas`, async () => {
		// Simulate no attraction found
		Attractions.findOne.mockResolvedValue(null); // aucun résultat

		await attractionsController.getOneAttractionBySlug(req, res);

		// ✅ Should return 404 Not Found
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: `L'attraction est introuvable`,
		});
	});

	it('devrait retourner 500 si une erreur serveur survient', async () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		// Simulate a database error
		Attractions.findOne.mockRejectedValue(new Error('Erreur BDD'));

		await attractionsController.getOneAttractionBySlug(req, res);

		// ✅ Should return 500 Internal Server Error
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: `Erreur serveur interne lors de la récupération de l'attraction`,
		});

		consoleSpy.mockRestore();
	});
});

// TEST: createAttraction
// Start of test suite for createAttraction
describe('attractionsController.createAttraction', () => {
	let req, res;

	beforeEach(() => {
		// Reset req and res objects before each test
		req = {
			body: {
				name: 'Le Manoir Hanté',
				image: 'manoir-hante.jpg',
				description: 'Un manoir rempli de mystères...',
				slug: 'le-manoir-hante',
			},
		};
		res = {
			status: vi.fn(() => res), // Allows chaining like res.status().json()
			json: vi.fn(),
		};
		vi.clearAllMocks(); // Reset all mocks before each test
	});

	it('devrait retourner 400 si la validation Zod échoue', async () => {
		// Make the request body invalid by setting name to empty string
		req.body.name = '';

		await attractionsController.createAttraction(req, res);

		// Expect a 400 Bad Request response due to validation error
		expect(res.status).toHaveBeenCalledWith(400);
		// Expect JSON response to contain a message and an array of validation errors
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Erreur lors de la validation des données via Zod',
				errors: expect.any(Array),
			}),
		);
	});

	it("devrait retourner 400 si l'extension de l'image n'est pas valide", async () => {
		// Set image URL with unsupported extension
		req.body.image = 'image-pas-bonne.gif'; // extension non autorisée

		await attractionsController.createAttraction(req, res);

		// Expect a 400 Bad Request response with an appropriate message
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "L'URL de l'image doit se terminer par .jpeg, .jpg ou .webp.",
		});
	});

	it('devrait retourner 409 si le nom existe déjà', async () => {
		// Mock findOne to simulate that attraction name already exists in the DB
		Attractions.findOne.mockImplementation(({ where }) => {
			if (where.name) return Promise.resolve({ id: 1 }); // name found
			return Promise.resolve(null);
		});

		await attractionsController.createAttraction(req, res);

		// Check that findOne was called searching for the name
		expect(Attractions.findOne).toHaveBeenCalledWith({ where: { name: expect.any(String) } });
		// Expect a 409 Conflict status because the name already exists
		expect(res.status).toHaveBeenCalledWith(409);
		// Expect JSON response to contain the name conflict error message
		expect(res.json).toHaveBeenCalledWith({
			error: "Nom d'attraction déjà utilisé.",
		});
	});

	it("devrait retourner 409 si l'image existe déjà", async () => {
		// Mock findOne to simulate image URL already exists in the database
		Attractions.findOne.mockImplementation(({ where }) => {
			if (where.image) return Promise.resolve({ id: 1 }); // image found
			return Promise.resolve(null);
		});

		await attractionsController.createAttraction(req, res);

		// Expect findOne to be called searching by image URL
		expect(Attractions.findOne).toHaveBeenCalledWith({ where: { image: expect.any(String) } });
		// Expect HTTP status 409 Conflict because the image URL is already used
		expect(res.status).toHaveBeenCalledWith(409);
		// Expect JSON response with a URL already used error message
		expect(res.json).toHaveBeenCalledWith({
			error: 'URL déjà utilisé.',
		});
	});

	it('devrait créer une attraction et retourner 201', async () => {
		// Mock findOne to return null, meaning no duplicates found
		Attractions.findOne.mockResolvedValue(null); 
		// Mock create to simulate successful creation with new id 42
		Attractions.create.mockResolvedValue({ id: 42, ...req.body }); 

		await attractionsController.createAttraction(req, res);

		// Expect create to be called with the expected attraction data
		expect(Attractions.create).toHaveBeenCalledWith(
			expect.objectContaining({
				name: expect.any(String),
				image: expect.any(String),
				description: expect.any(String),
				slug: expect.any(String),
			}),
		);
		// Expect HTTP status 201 Created
		expect(res.status).toHaveBeenCalledWith(201);
		// Expect JSON response to confirm creation and return created attraction with id
		expect(res.json).toHaveBeenCalledWith({
			message: 'Attraction créée avec succès',
			attraction: expect.objectContaining({ id: 42 }),
		});
	});

	it("devrait retourner 500 en cas d'erreur serveur", async () => {
		// Mock findOne to succeed with no duplicates
		Attractions.findOne.mockResolvedValue(null);
		// Mock create to throw an error simulating DB failure
		Attractions.create.mockRejectedValue(new Error('Erreur BDD'));
		// Spy on console.error to suppress error output during test
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		await attractionsController.createAttraction(req, res);

		// Expect HTTP status 500 Internal Server Error
		expect(res.status).toHaveBeenCalledWith(500);
		// Expect JSON response with internal server error message
		expect(res.json).toHaveBeenCalledWith({
			message: "Erreur serveur interne lors de la création de l'attraction",
		});
// Restore original console.error behavior
		consoleSpy.mockRestore();
	});
});

// TEST: updateAttraction
// Start of the test suite for the updateAttraction controller method
describe('attractionsController.updateAttraction', () => {
	let req, res, fakeAttraction;

	beforeEach(() => {
		// Setup request and response mocks before each test
		req = {
			checkedParams: { id: 1 }, // Simulated validated route parameter 'id'
			body: {
				name: 'Nouvelle Attraction',
				description: 'Description mise à jour',
				slug: 'nouvelle-attraction',
				image: 'nouvelle-image.jpg',
			},
		};
		res = {
			status: vi.fn(() => res), // Allows chaining like res.status().json()
			json: vi.fn(), // Mock to track JSON responses
		};
		// Mock of an existing attraction instance to be updated
		fakeAttraction = {
			id: 1,
			name: 'Attraction Originale',
			description: 'Description originale',
			slug: 'attraction-originale',
			image: 'ancienne-image.jpg',
			update: vi.fn(), // Mock the update method on the instance
		};

		vi.clearAllMocks(); // Clear any previous mocks to avoid interference
	});

	it('devrait retourner 400 si la validation Zod échoue', async () => {
		req.body.name = ''; // Make the name invalid (empty string)

		await attractionsController.updateAttraction(req, res);

		// Expect HTTP 400 Bad Request status for invalid input
		expect(res.status).toHaveBeenCalledWith(400);
		// Expect response JSON to contain validation error details
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Erreur lors de la validation des données via Zod',
				errors: expect.any(Array),
			}),
		);
	});

	it("devrait retourner 404 si l'attraction n'existe pas", async () => {
		// Mock DB returning null (no attraction found)
		Attractions.findByPk.mockResolvedValue(null);

		await attractionsController.updateAttraction(req, res);

		// Confirm search by PK was done
		expect(Attractions.findByPk).toHaveBeenCalledWith(1);
		// Expect 404 Not Found response
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: `L'attraction est introuvable` });
	});

	it("devrait retourner 400 si l'extension image n'est pas valide", async () => {
		// Set current attraction's name same as request to bypass uniqueness check for name
		fakeAttraction.name = req.body.name; 
		req.body.image = 'image-pas-bonne.gif'; // Invalid image extension

		Attractions.findByPk.mockResolvedValue(fakeAttraction);

		await attractionsController.updateAttraction(req, res);

		// Expect 400 Bad Request for invalid image URL extension
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "L'URL de l'image doit se terminer par .jpeg, .jpg ou .webp.",
		});
	});

	it('devrait retourner 409 si le nom est modifié et existe déjà', async () => {
		// Original attraction has different name from new name
		fakeAttraction.name = 'Nom Original';
		Attractions.findByPk.mockResolvedValue(fakeAttraction);
		// Mock findOne to simulate duplicate name found
		Attractions.findOne.mockImplementation(({ where }) => {
			if (where.name === req.body.name) return Promise.resolve({ id: 2 });
			return Promise.resolve(null);
		});

		await attractionsController.updateAttraction(req, res);

		// Expect conflict response for duplicate name
		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({ error: "Nom d'attraction déjà utilisé." });
	});

	it("devrait retourner 409 si l'image est modifiée et existe déjà", async () => {
		// Original attraction name matches request to pass name uniqueness test
		fakeAttraction.name = req.body.name; 
		fakeAttraction.image = 'ancienne-image.jpg';
		Attractions.findByPk.mockResolvedValue(fakeAttraction);
		// Mock findOne to simulate duplicate image URL found
		Attractions.findOne.mockImplementation(({ where }) => {
			if (where.image === req.body.image) return Promise.resolve({ id: 3 });
			return Promise.resolve(null);
		});

		await attractionsController.updateAttraction(req, res);

		// Expect conflict response for duplicate image URL
		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({ error: 'URL déjà utilisée.' });
	});

	it("devrait mettre à jour l'attraction et retourner 200", async () => {
		// Set original data
		fakeAttraction.name = 'Nom Original';
		fakeAttraction.image = 'ancienne-image.jpg';
		Attractions.findByPk.mockResolvedValue(fakeAttraction);
		Attractions.findOne.mockResolvedValue(null);
		// Mock successful update
		fakeAttraction.update.mockResolvedValue({
			id: 1,
			name: req.body.name,
			description: req.body.description,
			slug: req.body.slug,
			image: req.body.image,
		});

		await attractionsController.updateAttraction(req, res);

		// Verify update called with correct data
		expect(fakeAttraction.update).toHaveBeenCalledWith({
			name: expect.any(String),
			description: expect.any(String),
			slug: expect.any(String),
			image: expect.any(String),
		});

		// Expect success status and response JSON
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Attraction modifiée avec succès.',
			attraction: fakeAttraction,
		});
	});

	it("devrait retourner 500 en cas d'erreur serveur", async () => {
		// Simulate database error on findByPk
		Attractions.findByPk.mockRejectedValue(new Error('Erreur BDD'));
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		await attractionsController.updateAttraction(req, res);

		// Expect internal server error response
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: `Erreur serveur interne lors de la modification de l'attraction`,
		});

		consoleSpy.mockRestore();
	});
});

// TEST: deleteAttraction
// Test suite for the deleteAttraction controller method
describe('attractionsController.deleteAttraction', () => {
	let req, res, fakeAttraction;

	beforeEach(() => {
		req = {
			checkedParams: { id: 1 }, // Simulate validated route parameter 'id'
		};
		res = {
			status: vi.fn(() => res), // Enable chaining like res.status().json()
			json: vi.fn(), // Mock JSON response
		};
		// Mock attraction instance with a destroy method
		fakeAttraction = {
			destroy: vi.fn(),
		};

		vi.clearAllMocks(); // Clear mocks before each test
	});

	it("devrait retourner 404 si l'attraction n'existe pas", async () => {
		Attractions.findByPk.mockResolvedValue(null); // No attraction found

		await attractionsController.deleteAttraction(req, res);

		expect(Attractions.findByPk).toHaveBeenCalledWith(1);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: "L'attraction demandée n'existe pas" });
	});

	it("devrait supprimer l'attraction et retourner 200", async () => {
		Attractions.findByPk.mockResolvedValue(fakeAttraction);
		fakeAttraction.destroy.mockResolvedValue();

		await attractionsController.deleteAttraction(req, res);

		expect(fakeAttraction.destroy).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: 'Attraction supprimée avec succès.' });
	});

	it("devrait retourner 500 en cas d'erreur serveur", async () => {
		Attractions.findByPk.mockRejectedValue(new Error('Erreur BDD'));
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		await attractionsController.deleteAttraction(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Erreur serveur interne lors de la suppression de l'attraction",
		});

		consoleSpy.mockRestore();
	});
});

// TEST: getAttractionsByCategory
describe('attractionsController.getAttractionsByCategory', () => {
	let req, res;

	beforeEach(() => {
		req = {
			checkedParams: { id: 1 }, // validated category id param
		};
		res = {
			status: vi.fn(() => res), // chaining enabled
			json: vi.fn(),
		};
		vi.clearAllMocks();
	});

	it("devrait retourner 404 si la catégorie n'existe pas", async () => {
		Categories.findByPk.mockResolvedValue(null); // no category found

		await attractionsController.getAttractionsByCategory(req, res);

		expect(Categories.findByPk).toHaveBeenCalledWith(1, {
			include: {
				model: expect.anything(),
				as: 'attractions',
				through: { attributes: [] }, // exclude join table fields
			},
		});
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Catégorie non trouvée.' });
	});

	it('devrait retourner 200 avec la catégorie et ses attractions', async () => {
		const fakeCategory = {
			id: 1,
			name: 'Survival',
			attractions: [
				{ id: 1, name: 'Attraction 1' },
				{ id: 2, name: 'Attraction 2' },
			],
		};

		Categories.findByPk.mockResolvedValue(fakeCategory);

		await attractionsController.getAttractionsByCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Attractions récupérées avec succès',
			category: fakeCategory.name,
			attractions: fakeCategory.attractions,
		});
	});

	it("devrait retourner 500 en cas d'erreur serveur", async () => {
		Categories.findByPk.mockRejectedValue(new Error('Erreur BDD'));
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		await attractionsController.getAttractionsByCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			error: 'Erreur serveur lors de la récupération des attractions.',
		});

		consoleSpy.mockRestore();
	});
});
