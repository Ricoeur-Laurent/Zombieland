import { describe, it, expect, vi, beforeEach } from 'vitest'
import attractionsController from '../../src/controllers/attractionsControllers.js'

// Mock complet du fichier index.js
vi.mock('../../src/models/index.js', () => ({
  Attractions: {
    findAll: vi.fn(),
  },
  Categories: {}, // nécessaire à cause du include
}))

import { Attractions } from '../../src/models/index.js' // doit venir **après** le mock

describe('attractionsController.getAllAttractions', () => {
  let req, res

  beforeEach(() => {
    req = {}
    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    }
  })

  it('devrait retourner 200 avec un message et des attractions', async () => {
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
    ]

    Attractions.findAll.mockResolvedValue(fakeAttractions)

    await attractionsController.getAllAttractions(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Attractions récupérées avec succès',
      allAttractions: fakeAttractions,
    })
  })
})
