import { describe, it, expect, vi, beforeEach } from 'vitest'
import categoriesControllers from '../../src/controllers/categoriesControllers.js'

// mocking index.js

vi.mock('../../src/models/index.js', () => ({
    Categories: {
        findAll: vi.fn(),
        findByPk: vi.fn(),
        create: vi.fn(),
        findOne: vi.fn(),
        save: vi.fn()
    },
}))

import { Categories } from '../../src/models/index.js'

// ================= getAllCategorie ==================


describe('categoriesController.getAllCategories', () => {
    let req, res

    beforeEach(() => {
        req = {}
        res = {
            status: vi.fn(() => res),
            json: vi.fn(),
        }
    })

    // calling for all categories
    it('devrait retourner 200 avec un message et la liste de toutes les catégories', async () => {
        const fakeCategories = [
            { id: 1, name: 'Survival' },
            { id: 2, name: 'Escape Game' },
            { id: 3, name: 'Manege' },
            { id: 4, name: 'Simulation urbaine' },
            { id: 5, name: 'Paintball' },
            { id: 6, name: 'VR' },
        ]

        Categories.findAll.mockResolvedValue(fakeCategories)

        await categoriesControllers.getAllCategories(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Catégories récupérées avec succès',
            categories: fakeCategories,
        })
    })
})

//  =========================== GetOnecategory ==========================

describe('categoriesController.getOneCategoriy', () => {
    let req, res

    beforeEach(() => {
        res = {
            status: vi.fn(() => res),
            json: vi.fn(),
        }
    })

// Lokking for a category that exists in the database
    it('devrait retourner 200 avec un message et la catégorie demandée', async () => {
        req = {
            checkedParams: { id: 1 },
        }
        const fakeCategory = [
            { id: 1, name: 'Survival' },
        ]

        Categories.findByPk.mockResolvedValue(fakeCategory)

        await categoriesControllers.getOneCategory(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: `Catégorie récupérée avec succès`,
            oneCategory: fakeCategory,
        })
    })

    // looking for a category that does not exist in the Database
    it("devrait retourner 404 si la catégorie n'existe pas", async () => {
        req = {
            checkedParams: { id: 999 },
        }

        Categories.findByPk.mockResolvedValue(null)

        await categoriesControllers.getOneCategory(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            message: `Catégorie non trouvée`,
        })
    })
})

//  =========================== createCategory ==========================

describe('categoriesController.createCategory', () => {
    let req, res

    beforeEach(() => {
        res = {
            status: vi.fn(() => res),
            json: vi.fn(),
        }
    })

        // testing proper category creation
    it('devrait retourner 201 avec la nouvelle catégorie', async () => {
        req = {
            body: { name: 'Simulation urbaine' },
        }
        const fakeCreated = { id: 7, name: 'Simulation urbaine' }

        Categories.create.mockResolvedValue(fakeCreated)

        await categoriesControllers.createCategory(req, res)

        expect(Categories.create).toHaveBeenCalledWith({ name: 'Simulation urbaine' })
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            message: "Catégorie créée avec succès.",
            category: fakeCreated,
        })
    })
    
    // testing creation with a category name that already exists in the database
    it('devrait retourner 409 si la catégorie existe déjà', async () => {
        req = {
            body: { name: 'VR' },
        }
        const fakeCreated = { name: 'VR' }

        Categories.findOne.mockResolvedValue(fakeCreated)

          await categoriesControllers.createCategory(req, res)

        expect(Categories.findOne).toHaveBeenCalledWith({ where: { name: 'VR' } })
        expect(res.status).toHaveBeenCalledWith(409)
        expect(res.json).toHaveBeenCalledWith({
            error: "Nom de catégorie déjà utilisé." 
        })
    })
})

//  =========================== updateCategory ==========================

describe('categoriesController.updateCategory', () => {
    let req, res

    beforeEach(() => {
        req = {
            body: { name: 'Attaque souterraine' },
            checkedParams: { id: 7 }
        }
        res = {
            status: vi.fn(() => res),
            json: vi.fn(),
        }
    })

    // testing regular category update
    it('devrait retourner 200 avec la catégorie mise à jour', async () => {
        const fakeUpdated = {
            id: 7,
            name: 'Attaque souterraine',
            save: vi.fn().mockResolvedValue()
        }

        Categories.findByPk.mockResolvedValue(fakeUpdated)
        Categories.findOne.mockResolvedValue(null)

        await categoriesControllers.updateCategory(req, res)

        // check that the save method has been called
        expect(fakeUpdated.save).toHaveBeenCalled()

        // check the control result
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: "Catégorie mise à jour avec succès.",
            category: fakeUpdated,
        })
    })
})