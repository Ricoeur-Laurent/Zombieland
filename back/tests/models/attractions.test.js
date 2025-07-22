import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { sequelize } from '../../src/models/sequelize.js';
import { Attractions } from '../../src/models/attractions.js';

describe('Attractions Model', () => {
	beforeAll(async () => {
		// Before running all tests: sync the database and recreate tables
		await sequelize.sync({ force: true });
	});

	beforeEach(async () => {
		// Before each test: clear all records from the Attractions table
		await Attractions.destroy({ where: {} });
	});

	// After all tests are done: close the database connection
	afterAll(async () => {
		await sequelize.close();
	});

	it('should create a valid attraction', async () => {
		// Try to create a valid attraction
		const attraction = await Attractions.create({
			name: 'Attraction1',
			image: 'Attraction1.jpg',
			description: 'Scary haunted house ride.',
			slug: 'haunted-house',
		});

		// Check that the attraction was created and has the correct name
		expect(attraction).toBeDefined();
		expect(attraction.name).toBe('Attraction1');
	});

	it('should not allow null values for required fields', async () => {
		try {
			// Attempt to create an attraction with all null values
			await Attractions.create({
				name: null,
				image: null,
				description: null,
				slug: null,
			});
		} catch (error) {
			// Expect a validation error and check the specific messages
			expect(error.name).toBe('SequelizeValidationError');
			const messages = error.errors.map((e) => e.message);
			expect(messages).toContain('Attractions.name cannot be null');
			expect(messages).toContain('Attractions.image cannot be null');
			expect(messages).toContain('Attractions.description cannot be null');
			expect(messages).toContain('Attractions.slug cannot be null');
		}
	});

	it('should enforce unique constraint on name', async () => {
  await Attractions.create({
    name: 'UniqueName',
    image: 'Image1.jpg',
    description: 'Attraction test 1',
    slug: 'slug-1',
  });

  try {
    await Attractions.create({
      name: 'UniqueName', // duplicate name
      image: 'Image2.jpg',
      description: 'Attraction test 2',
      slug: 'slug-2',
    });
    throw new Error('Expected SequelizeUniqueConstraintError was not thrown');
  } catch (error) {
    expect(error.name).toBe('SequelizeUniqueConstraintError');
    expect(error.message.toLowerCase()).toMatch(/name/);
  }
});

it('should enforce unique constraint on image', async () => {
  await Attractions.create({
    name: 'Name1',
    image: 'UniqueImage.jpg',
    description: 'Attraction test 1',
    slug: 'slug-1',
  });

  try {
    await Attractions.create({
      name: 'Name2',
      image: 'UniqueImage.jpg', // duplicate image
      description: 'Attraction test 2',
      slug: 'slug-2',
    });
    throw new Error('Expected SequelizeUniqueConstraintError was not thrown');
  } catch (error) {
    expect(error.name).toBe('SequelizeUniqueConstraintError');
    expect(error.message.toLowerCase()).toMatch(/image/);
  }
});
});

