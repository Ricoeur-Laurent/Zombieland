import { describe, it, expect } from 'vitest';
import { createAttractionSchema, updateAttractionSchema } from '../../src/schemas/attractions.js';

describe('Zod Attraction Validation', () => {
	// Tests for the schema used when creating a new attraction
	describe('createAttractionSchema', () => {
		it('should pass with valid data', () => {
			// A valid object that should pass validation
			const data = {
				name: 'Roller Coaster',
				image: 'roller.jpg',
				description: 'A thrilling ride with loops and drops!',
				slug: 'roller-coaster',
			};

			const result = createAttractionSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it('should fail if name is empty or too short', () => {
			const result = createAttractionSchema.safeParse({
				name: 'A', // too short
				image: 'img.jpg',
				description: 'A valid description.',
				slug: 'valid-slug',
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				// We expect a validation error for the 'name' field
				expect(result.error.flatten().fieldErrors.name).toBeDefined();
			}
		});

		it('should fail if image is empty', () => {
			const result = createAttractionSchema.safeParse({
				name: 'Valid Name',
				image: '',
				description: 'A valid description.',
				slug: 'valid-slug',
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				// Validation error expected for 'image'
				expect(result.error.flatten().fieldErrors.image).toBeDefined();
			}
		});

		it('should fail if description is too short', () => {
			const result = createAttractionSchema.safeParse({
				name: 'Valid Name',
				image: 'img.jpg',
				description: 'Too short', // less than 10 characters
				slug: 'valid-slug',
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				// Validation error expected for 'description'
				expect(result.error.flatten().fieldErrors.description).toBeDefined();
			}
		});

		it('should fail if slug format is invalid', () => {
			const result = createAttractionSchema.safeParse({
				name: 'Valid Name',
				image: 'img.jpg',
				description: 'A valid description.',
				slug: 'Invalid Slug!', // contains spaces and special characters
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				// Validation error expected for 'slug'
				expect(result.error.flatten().fieldErrors.slug).toBeDefined();
			}
		});
	});

	// Tests for the schema used when updating an attraction
	describe('updateAttractionSchema', () => {
		it('should pass with a partial valid object', () => {
			// Only updating the name, which is valid
			const result = updateAttractionSchema.safeParse({
				name: 'Updated Name',
			});

			expect(result.success).toBe(true);
		});

		it('should fail if a provided field is invalid', () => {
			// The slug format is invalid
			const result = updateAttractionSchema.safeParse({
				slug: 'Invalid Slug!',
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				// Validation error expected for 'slug'
				expect(result.error.flatten().fieldErrors.slug).toBeDefined();
			}
		});
	});
});
