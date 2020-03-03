import { BemModel } from '../index';

describe('BemModel', () => {
	describe('constructor', () => {
		it('should create an instance with default values', () => {
			const bemModel = new BemModel();
			expect(bemModel.block).toBe('');
			expect(bemModel.element).toBeUndefined();
			expect(bemModel.modifiers).toEqual({ block: {}, element: {} });
			expect(bemModel.prefix).toBe('');
			expect(bemModel.verbose).toBe(false);
		});

		it('should create an instance with provided BEM object', () => {
			const bemObject = {
				block: 'test-block',
				element: 'test-element',
				modifiers: {
					block: {
						'block-modifier': 'block-value',
					},
				},
				prefix: 'test-prefix-',
				verbose: true,
			};
			const bemModel = new BemModel(bemObject);
			expect(bemModel.block).toBe(bemObject.block);
			expect(bemModel.element).toBe(bemObject.element);
			expect(bemModel.modifiers.block).toEqual(bemObject.modifiers.block);
			expect(bemModel.modifiers.element).toEqual({});
			expect(bemModel.prefix).toBe(bemObject.prefix);
			expect(bemModel.verbose).toBe(bemObject.verbose);
		});

		it('should migrate element -> block when no block provided', () => {
			const bemObject = {
				element: 'test-element',
			};
			const bemModel = new BemModel(bemObject);
			expect(bemModel.block).toBe('test-element');
			expect(bemModel.element).toBeUndefined();
		});

		it('should migrate element modifiers -> block modifiers when no block provided', () => {
			const bemObject = {
				element: 'test-element',
				modifiers: {
					element: {
						'element-modifier': true,
					},
				},
			};
			const bemModel = new BemModel(bemObject);
			expect(bemModel.block).toBe('test-element');
			expect(bemModel.element).toBeUndefined();
			expect(bemModel.modifiers.block).toEqual(bemObject.modifiers.element);
			expect(bemModel.modifiers.element).toEqual({});
		});

		it('should not migrate element modifiers -> block modifiers when no block provided, but block modifiers exist', () => {
			const bemObject = {
				element: 'test-element',
				modifiers: {
					block: {
						'block-modifier': 'block-value',
					},
					element: {
						'element-modifier': true,
					},
				},
			};
			const bemModel = new BemModel(bemObject);
			expect(bemModel.block).toBe('test-element');
			expect(bemModel.element).toBeUndefined();
			expect(bemModel.modifiers.block).toEqual(bemObject.modifiers.block);
			expect(bemModel.modifiers.element).toEqual({});
		});
	});
	describe('static methods', () => {
		describe('parse', () => {
			it('should parse BEM class names into BemModel instances', () => {
				const className = 'fake-block__fake-element--boolean-modifier';
				const bemModelInstances = BemModel.parse(className);

				expect(bemModelInstances).toHaveLength(1);
				const bemModel = bemModelInstances[0];
				expect(bemModel).toBeInstanceOf(BemModel);
				expect(bemModel.block).toBe('fake-block');
				expect(bemModel.element).toBe('fake-element');
				expect(bemModel.modifiers).toEqual({
					block: {},
					element: {
						'boolean-modifier': true,
					},
				});
			});

			it('should parse verbose BEM class names into BemModel instances', () => {
				const className =
					'fake-block--value-modifier_fake-value__fake-element--el-modifier';
				const bemModelInstances = BemModel.parse(className);

				expect(bemModelInstances).toHaveLength(1);
				const bemModel = bemModelInstances[0];
				expect(bemModel).toBeInstanceOf(BemModel);
				expect(bemModel.block).toBe('fake-block');
				expect(bemModel.element).toBe('fake-element');
				expect(bemModel.modifiers).toEqual({
					block: {
						'value-modifier': 'fake-value',
					},
					element: {
						'el-modifier': true,
					},
				});
			});

			it('should produce multiple BemModel instances for multiple class names', () => {
				const className =
					'fake-block--value-modifier_fake-value__fake-element--el-modifier another-block__another-element--another-modifier_another-value';
				const bemModelInstances = BemModel.parse(className);

				expect(bemModelInstances).toHaveLength(2);

				// unbem sorts results (links-first, then lexicographic), so
				// 'another-block' precedes 'fake-block' regardless of input order.
				const [firstBemModel, secondBemModel] = bemModelInstances;

				expect(firstBemModel).toBeInstanceOf(BemModel);
				expect(firstBemModel.block).toBe('another-block');
				expect(firstBemModel.element).toBe('another-element');
				expect(firstBemModel.modifiers).toEqual({
					block: {},
					element: {
						'another-modifier': 'another-value',
					},
				});

				expect(secondBemModel).toBeInstanceOf(BemModel);
				expect(secondBemModel.block).toBe('fake-block');
				expect(secondBemModel.element).toBe('fake-element');
				expect(secondBemModel.modifiers).toEqual({
					block: {
						'value-modifier': 'fake-value',
					},
					element: {
						'el-modifier': true,
					},
				});
			});
		});
	});

	describe('accessors', () => {
		let bemModel;
		beforeEach(() => {
			bemModel = new BemModel({
				block: 'test-block',
				element: 'test-element',
				modifiers: {
					block: {
						'block-modifier': 'block-value',
					},
					element: {
						'element-modifier': true,
					},
				},
				prefix: 'test-prefix-',
			});
		});

		describe.each([
			[
				'prefix',
				'test-prefix-',
				'.new-prefixtest-block__test-element .new-prefixtest-block--block-modifier_block-value .new-prefixtest-element .new-prefixtest-element--element-modifier',
			],
			[
				'block',
				'test-block',
				'.test-prefix-new-block__test-element .test-prefix-new-block--block-modifier_block-value .test-prefix-test-element .test-prefix-test-element--element-modifier',
			],
			[
				'element',
				'test-element',
				'.test-prefix-test-block__new-element .test-prefix-test-block--block-modifier_block-value .test-prefix-new-element .test-prefix-new-element--element-modifier',
			],
		])('%s accessor', (property, initialValue, newCssText) => {
			it(`should get and set ${property}`, () => {
				expect(bemModel[property]).toBe(initialValue);
				const newValue = `new-${property}`;
				bemModel[property] = newValue;
				expect(bemModel[property]).toBe(newValue);
			});

			it(`should mark instance as invalid when setting ${property}`, () => {
				expect(bemModel.invalid).toBe(false);
				bemModel[property] = `new-${property}`;
				expect(bemModel.invalid).toBe(true);
			});

			it('should produce a new CSS text upon modification and validation', () => {
				const initialCSSText = bemModel.cssText;
				bemModel[property] = `new-${property}`;
				bemModel.validate();
				expect(bemModel.cssText).toBe(newCssText);
			});

			if (property === 'prefix') {
				it('should convert falsy prefix to an empty string', () => {
					bemModel.prefix = null;
					expect(bemModel.prefix).toBe('');
				});
			}
		});

		describe('verbose accessor', () => {
			it('should get and set verbose', () => {
				expect(bemModel.verbose).toBe(false);
				bemModel.verbose = true;
				expect(bemModel.verbose).toBe(true);
			});

			it('should mark instance as invalid when setting verbose', () => {
				expect(bemModel.invalid).toBe(false);
				bemModel.verbose = true;
				expect(bemModel.invalid).toBe(true);
			});

			it('should produce a new CSS text upon modification and validation', () => {
				const initialCSSText = bemModel.cssText;
				bemModel.verbose = true;
				bemModel.validate();
				expect(bemModel.cssText).toBe(
					'.test-prefix-test-block__test-element .test-prefix-test-block--block-modifier_block-value .test-prefix-test-block--block-modifier_block-value__test-element .test-prefix-test-element .test-prefix-test-element--element-modifier .test-prefix-test-block__test-element--element-modifier'
				);
			});
		});

		describe('modifiers accessor', () => {
			it('should get modifiers', () => {
				expect(bemModel.modifiers).toEqual({
					block: {
						'block-modifier': 'block-value',
					},
					element: {
						'element-modifier': true,
					},
				});
			});
		});

		describe('classList accessor', () => {
			it('should get classList', () => {
				expect(bemModel.classList).toEqual([
					'test-prefix-test-block__test-element',
					'test-prefix-test-block--block-modifier_block-value',
					'test-prefix-test-element',
					'test-prefix-test-element--element-modifier',
				]);
			});

			it('should produce a new classList upon modification WITHOUT validation', () => {
				bemModel.block = 'new-block';
				expect(bemModel.classList).toEqual([
					'test-prefix-new-block__test-element',
					'test-prefix-new-block--block-modifier_block-value',
					'test-prefix-test-element',
					'test-prefix-test-element--element-modifier',
				]);
			});
		});

		describe('cssText accessor', () => {
			it('should get cssText', () => {
				expect(bemModel.cssText).toBe(
					'.test-prefix-test-block__test-element .test-prefix-test-block--block-modifier_block-value .test-prefix-test-element .test-prefix-test-element--element-modifier'
				);
			});

			it('should NOT produce a new cssText upon modification WITHOUT validation', () => {
				const initialCSSText = bemModel.cssText;
				bemModel.block = 'new-block';
				expect(bemModel.cssText).toBe(initialCSSText);
			});
		});

		describe('invalid accessor', () => {
			it('should get invalid', () => {
				expect(bemModel.invalid).toBe(false);
				bemModel.block = 'new-block';
				expect(bemModel.invalid).toBe(true);
			});
		});
	});

	describe('setBlockModifier', () => {
		let bemModel;
		beforeEach(() => {
			bemModel = new BemModel({ block: 'test-block' });
		});

		it('should set block modifier and mark instance as invalid', () => {
			expect(bemModel.modifiers.block).toEqual({});
			expect(bemModel.invalid).toBe(false);
			bemModel.setBlockModifier('new-modifier', 'new-value');
			expect(bemModel.modifiers.block).toEqual({
				'new-modifier': 'new-value',
			});
			expect(bemModel.invalid).toBe(true);
		});

		it('should remove block modifier when value is undefined', () => {
			bemModel.setBlockModifier('to-be-removed', 'some-value');
			expect(bemModel.modifiers.block).toEqual({
				'to-be-removed': 'some-value',
			});
			bemModel.setBlockModifier('to-be-removed');
			expect(bemModel.modifiers.block).toEqual({});
		});

		it('should allow setting block modifiers to boolean true', () => {
			bemModel.setBlockModifier('boolean-modifier', true);
			expect(bemModel.modifiers.block).toEqual({
				'boolean-modifier': true,
			});
			bemModel.validate();
			expect(bemModel.cssText).toBe(
				'.test-block .test-block--boolean-modifier'
			);
		});

		it('should transform a falsy value to boolean true', () => {
			bemModel.setBlockModifier('boolean-modifier', '');
			expect(bemModel.modifiers.block).toEqual({
				'boolean-modifier': true,
			});
			bemModel.validate();
			expect(bemModel.cssText).toBe(
				'.test-block .test-block--boolean-modifier'
			);
		});
	});

	describe('setElementModifier', () => {
		let bemModel;
		beforeEach(() => {
			bemModel = new BemModel({
				block: 'test-block',
				element: 'test-element',
			});
		});

		it('should set element modifier and mark instance as invalid', () => {
			expect(bemModel.modifiers.element).toEqual({});
			expect(bemModel.invalid).toBe(false);
			bemModel.setElementModifier('new-modifier', 'new-value');
			expect(bemModel.modifiers.element).toEqual({
				'new-modifier': 'new-value',
			});
			expect(bemModel.invalid).toBe(true);
		});

		it('should remove element modifier when value is undefined', () => {
			bemModel.setElementModifier('to-be-removed', 'some-value');
			expect(bemModel.modifiers.element).toEqual({
				'to-be-removed': 'some-value',
			});
			bemModel.setElementModifier('to-be-removed');
			expect(bemModel.modifiers.element).toEqual({});
		});

		it('should throw an error when no element is defined', () => {
			bemModel = new BemModel({ block: 'test-block' });
			expect(() => {
				bemModel.setElementModifier('some-modifier', 'some-value');
			}).toThrow('Cannot set element modifier when no element is defined.');
		});

		it('should allow setting element modifiers to boolean true', () => {
			bemModel.setElementModifier('boolean-modifier', true);
			expect(bemModel.modifiers.element).toEqual({
				'boolean-modifier': true,
			});
			bemModel.validate();
			expect(bemModel.cssText).toBe(
				'.test-block__test-element .test-element .test-element--boolean-modifier'
			);
		});

		it('should transform a falsy value to boolean true', () => {
			bemModel.setElementModifier('boolean-modifier', '');
			expect(bemModel.modifiers.element).toEqual({
				'boolean-modifier': true,
			});
			bemModel.validate();
			expect(bemModel.cssText).toBe(
				'.test-block__test-element .test-element .test-element--boolean-modifier'
			);
		});
	});

	describe('toString', () => {
		it('should return the CSS text representation of the instance', () => {
			const bemModel = new BemModel({
				block: 'test-block',
				element: 'test-element',
				modifiers: {
					block: {
						'block-modifier': 'block-value',
					},
					element: {
						'element-modifier': true,
					},
				},
				prefix: 'test-prefix-',
			});

			expect(bemModel.toString()).toBe(
				'.test-prefix-test-block__test-element .test-prefix-test-block--block-modifier_block-value .test-prefix-test-element .test-prefix-test-element--element-modifier'
			);
		});

		it('should automatically validate and return the new CSS text representation if instance is invalid', () => {
			const bemModel = new BemModel({
				block: 'test-block',
				element: 'test-element',
				modifiers: {
					block: {
						'block-modifier': 'block-value',
					},
					element: {
						'element-modifier': true,
					},
				},
				prefix: 'test-prefix-',
			});

			bemModel.block = 'new-block';
			expect(bemModel.invalid).toBe(true);
			expect(bemModel.toString()).toBe(
				'.test-prefix-new-block__test-element .test-prefix-new-block--block-modifier_block-value .test-prefix-test-element .test-prefix-test-element--element-modifier'
			);
			expect(bemModel.invalid).toBe(false);
		});
	});
});
