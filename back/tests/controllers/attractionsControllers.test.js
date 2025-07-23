import { describe, it, expect, vi, beforeEach } from 'vitest';
import attractionsController from '../../src/controllers/attractionsControllers.js';

// TEST: getAllAttractions
// Mock complet du fichier index.js
vi.mock('../../src/models/index.js', () => ({
	Attractions: {
		findAll: vi.fn(), // on mock la méthode findAll
		findByPk: vi.fn(), // on mock la méthode findByPk
		findOne: vi.fn(), // on mock de la méthode findOne
		create: vi.fn(), // on mock la méthode create
		update: vi.fn(), // on mock la méthode update
		delete: vi.fn(), // on mock la méthode delete
	},
	Categories: {
		findByPk: vi.fn(), // on mock la méthode findByPk pour Categories
	},
}));

// On importe `Attractions` après le mock pour s'assurer que la version mockée est utilisée
import { Categories } from '../../src/models/index.js';
import { Attractions } from '../../src/models/index.js';

// Début de la suite de tests pour getAllAttractions
describe('attractionsController.getAllAttractions', () => {
	let req, res;

	// Avant chaque test, on réinitialise les objets `req` et `res`
	beforeEach(() => {
		req = {};
		res = {
			status: vi.fn(() => res), // permet le chaînage : res.status(200).json(...)
			json: vi.fn(), // on observe les appels à res.json
		};
	});

	// Cas de test : tout se passe bien, les attractions sont retournées
	it('devrait retourner 200 avec un message et des attractions', async () => {
		// On crée une fausse liste d'attractions simulant la réponse de la BDD
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

		// On configure le mock pour que findAll retourne les fausses attractions
		Attractions.findAll.mockResolvedValue(fakeAttractions);

		await attractionsController.getAllAttractions(req, res);

		// ✅ On vérifie que res.status a bien été appelé avec 200
		expect(res.status).toHaveBeenCalledWith(200);
		// ✅ Et que res.json a bien été appelé avec le bon message et les attractions
		expect(res.json).toHaveBeenCalledWith({
			message: 'Attractions récupérées avec succès',
			allAttractions: fakeAttractions,
		});
	});
});

// TEST: getOneAttraction
// Début de la suite de tests pour getOneAttraction
describe('attractionsController.getOneAttraction', () => {
	let req, res;

	// Avant chaque test, on réinitialise les objets requis
	beforeEach(() => {
		req = {
			checkedParams: { id: 1 }, // simulateur d'un paramètre validé par middleware
		};
		res = {
			status: vi.fn(() => res), // pour permettre le chaînage
			json: vi.fn(), // pour capturer les réponses JSON
		};
		vi.clearAllMocks(); // nettoyage des mocks à chaque test
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

		Attractions.findByPk.mockResolvedValue(fakeAttraction);

		await attractionsController.getOneAttraction(req, res);

		expect(Attractions.findByPk).toHaveBeenCalledWith(1);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: `Attraction récupérée avec succès`,
			oneAttraction: fakeAttraction,
		});
	});

	it(`devrait retourner 404 si l'attraction n'existe pas`, async () => {
		Attractions.findByPk.mockResolvedValue(null); // rien trouvé

		await attractionsController.getOneAttraction(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: `L'attraction est introuvable`,
		});
	});

	it('devrait retourner 500 si une erreur serveur survient', async () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		Attractions.findByPk.mockRejectedValue(new Error('Erreur BDD'));

		await attractionsController.getOneAttraction(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: `Erreur serveur interne lors de la récupération de l'attraction`,
		});
	});
});

// TEST: getOneAttractionBySlug
// Début de la suite de tests pour getOneAttractionBySlug
describe('attractionsController.getOneAttractionBySlug', () => {
	let req, res;

	beforeEach(() => {
		req = {
			checkedParams: { slug: 'le-dedale-maudit' }, // exemple de slug validé
		};
		res = {
			status: vi.fn(() => res), // permet le chaînage
			json: vi.fn(),
		};
		vi.clearAllMocks(); // réinitialisation des mocks
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

		// Le mock simule la réponse de la BDD
		Attractions.findOne.mockResolvedValue(fakeAttraction);

		// Appel de la méthode du contrôleur
		await attractionsController.getOneAttractionBySlug(req, res);

		// Vérifications des appels et des données renvoyées
		expect(Attractions.findOne).toHaveBeenCalledWith({
			where: { slug: 'le-dedale-maudit' },
			include: {
				model: expect.any(Object),
				as: 'categories',
				attributes: ['id', 'name'],
			},
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: `Attraction récupérée avec succès`,
			oneAttraction: fakeAttraction,
		});
	});

	it(`devrait retourner 404 si l'attraction n'existe pas`, async () => {
		Attractions.findOne.mockResolvedValue(null); // aucun résultat

		await attractionsController.getOneAttractionBySlug(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: `L'attraction est introuvable`,
		});
	});

	it('devrait retourner 500 si une erreur serveur survient', async () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		Attractions.findOne.mockRejectedValue(new Error('Erreur BDD'));

		await attractionsController.getOneAttractionBySlug(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: `Erreur serveur interne lors de la récupération de l'attraction`,
		});

		consoleSpy.mockRestore();
	});
});

//TEST: createAttraction
// Début de la suite de tests pour createAttraction
describe('attractionsController.createAttraction', () => {
	let req, res;

	beforeEach(() => {
		// Réinitialisation de req et res avant chaque test
		req = {
			body: {
				name: 'Le Manoir Hanté',
				image: 'manoir-hante.jpg',
				description: 'Un manoir rempli de mystères...',
				slug: 'le-manoir-hante',
			},
		};
		res = {
			status: vi.fn(() => res), // pour chaîner les appels (res.status().json())
			json: vi.fn(),
		};
		vi.clearAllMocks(); // réinitialisation des mocks
	});

	it('devrait retourner 400 si la validation Zod échoue', async () => {
		// On modifie le body pour qu'il soit invalide (ex: champ name vide)
		req.body.name = '';

		await attractionsController.createAttraction(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Erreur lors de la validation des données via Zod',
				errors: expect.any(Array),
			}),
		);
	});

	it("devrait retourner 400 si l'extension de l'image n'est pas valide", async () => {
		req.body.image = 'image-pas-bonne.gif'; // extension non autorisée

		await attractionsController.createAttraction(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "L'URL de l'image doit se terminer par .jpeg, .jpg ou .webp.",
		});
	});

	it('devrait retourner 409 si le nom existe déjà', async () => {
		Attractions.findOne.mockImplementation(({ where }) => {
			if (where.name) return Promise.resolve({ id: 1 }); // nom trouvé
			return Promise.resolve(null);
		});

		await attractionsController.createAttraction(req, res);

		expect(Attractions.findOne).toHaveBeenCalledWith({ where: { name: expect.any(String) } });
		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({
			error: "Nom d'attraction déjà utilisé.",
		});
	});

	it("devrait retourner 409 si l'image existe déjà", async () => {
		Attractions.findOne.mockImplementation(({ where }) => {
			if (where.image) return Promise.resolve({ id: 1 }); // image trouvée
			return Promise.resolve(null);
		});

		await attractionsController.createAttraction(req, res);

		expect(Attractions.findOne).toHaveBeenCalledWith({ where: { image: expect.any(String) } });
		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({
			error: 'URL déjà utilisé.',
		});
	});

	it('devrait créer une attraction et retourner 201', async () => {
		Attractions.findOne.mockResolvedValue(null); // aucun doublon
		Attractions.create.mockResolvedValue({ id: 42, ...req.body }); // création simulée

		await attractionsController.createAttraction(req, res);

		expect(Attractions.create).toHaveBeenCalledWith(
			expect.objectContaining({
				name: expect.any(String),
				image: expect.any(String),
				description: expect.any(String),
				slug: expect.any(String),
			}),
		);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Attraction créée avec succès',
			attraction: expect.objectContaining({ id: 42 }),
		});
	});

	it("devrait retourner 500 en cas d'erreur serveur", async () => {
		Attractions.findOne.mockResolvedValue(null);
		Attractions.create.mockRejectedValue(new Error('Erreur BDD'));
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		await attractionsController.createAttraction(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Erreur serveur interne lors de la création de l'attraction",
		});

		consoleSpy.mockRestore();
	});
});

//TEST: updateAttraction
// Début de la suite de tests pour updateAttraction
describe('attractionsController.updateAttraction', () => {
	let req, res, fakeAttraction;

	beforeEach(() => {
		req = {
			checkedParams: { id: 1 },
			body: {
				name: 'Nouvelle Attraction',
				description: 'Description mise à jour',
				slug: 'nouvelle-attraction',
				image: 'nouvelle-image.jpg',
			},
		};
		res = {
			status: vi.fn(() => res),
			json: vi.fn(),
		};
		fakeAttraction = {
			id: 1,
			name: 'Attraction Originale',
			description: 'Description originale',
			slug: 'attraction-originale',
			image: 'ancienne-image.jpg',
			update: vi.fn(),
		};

		vi.clearAllMocks();
	});

	it('devrait retourner 400 si la validation Zod échoue', async () => {
		req.body.name = ''; // invalide

		await attractionsController.updateAttraction(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Erreur lors de la validation des données via Zod',
				errors: expect.any(Array),
			}),
		);
	});

	it("devrait retourner 404 si l'attraction n'existe pas", async () => {
		Attractions.findByPk.mockResolvedValue(null);

		await attractionsController.updateAttraction(req, res);

		expect(Attractions.findByPk).toHaveBeenCalledWith(1);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: `L'attraction est introuvable` });
	});

	it("devrait retourner 400 si l'extension image n'est pas valide", async () => {
		fakeAttraction.name = req.body.name; // éviter test d'unicité nom
		req.body.image = 'image-pas-bonne.gif';

		Attractions.findByPk.mockResolvedValue(fakeAttraction);

		await attractionsController.updateAttraction(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "L'URL de l'image doit se terminer par .jpeg, .jpg ou .webp.",
		});
	});

	it('devrait retourner 409 si le nom est modifié et existe déjà', async () => {
		fakeAttraction.name = 'Nom Original';
		Attractions.findByPk.mockResolvedValue(fakeAttraction);
		Attractions.findOne.mockImplementation(({ where }) => {
			if (where.name === req.body.name) return Promise.resolve({ id: 2 });
			return Promise.resolve(null);
		});

		await attractionsController.updateAttraction(req, res);

		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({ error: "Nom d'attraction déjà utilisé." });
	});

	it("devrait retourner 409 si l'image est modifiée et existe déjà", async () => {
		fakeAttraction.name = req.body.name; // pour passer le test nom
		fakeAttraction.image = 'ancienne-image.jpg';
		Attractions.findByPk.mockResolvedValue(fakeAttraction);
		Attractions.findOne.mockImplementation(({ where }) => {
			if (where.image === req.body.image) return Promise.resolve({ id: 3 });
			return Promise.resolve(null);
		});

		await attractionsController.updateAttraction(req, res);

		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({ error: 'URL déjà utilisée.' });
	});

	it("devrait mettre à jour l'attraction et retourner 200", async () => {
		fakeAttraction.name = 'Nom Original';
		fakeAttraction.image = 'ancienne-image.jpg';
		Attractions.findByPk.mockResolvedValue(fakeAttraction);
		Attractions.findOne.mockResolvedValue(null);
		fakeAttraction.update.mockResolvedValue({
			id: 1,
			name: req.body.name,
			description: req.body.description,
			slug: req.body.slug,
			image: req.body.image,
		});

		await attractionsController.updateAttraction(req, res);

		expect(fakeAttraction.update).toHaveBeenCalledWith({
			name: expect.any(String),
			description: expect.any(String),
			slug: expect.any(String),
			image: expect.any(String),
		});

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Attraction modifiée avec succès.',
			attraction: fakeAttraction,
		});
	});

	it("devrait retourner 500 en cas d'erreur serveur", async () => {
		Attractions.findByPk.mockRejectedValue(new Error('Erreur BDD'));
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		await attractionsController.updateAttraction(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: `Erreur serveur interne lors de la modification de l'attraction`,
		});

		consoleSpy.mockRestore();
	});
});

// TEST: deleteAttraction
// Début de la suite de tests pour deleteAttraction
describe('attractionsController.deleteAttraction', () => {
	let req, res, fakeAttraction;

	beforeEach(() => {
		req = {
			checkedParams: { id: 1 },
		};
		res = {
			status: vi.fn(() => res),
			json: vi.fn(),
		};
		fakeAttraction = {
			destroy: vi.fn(),
		};

		vi.clearAllMocks();
	});

	it("devrait retourner 404 si l'attraction n'existe pas", async () => {
		Attractions.findByPk.mockResolvedValue(null);

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
// Début de la suite de tests pour getAttractionsByCategory
describe('attractionsController.getAttractionsByCategory', () => {
	let req, res;

	beforeEach(() => {
		req = {
			checkedParams: { id: 1 },
		};
		res = {
			status: vi.fn(() => res),
			json: vi.fn(),
		};
		vi.clearAllMocks();
	});

	it("devrait retourner 404 si la catégorie n'existe pas", async () => {
		Categories.findByPk.mockResolvedValue(null);

		await attractionsController.getAttractionsByCategory(req, res);

		expect(Categories.findByPk).toHaveBeenCalledWith(1, {
			include: {
				model: expect.anything(),
				as: 'attractions',
				through: { attributes: [] },
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
