import unbem from '../unbem'
import standard from '../syntax/standard'

describe('unbem', () => {
    describe('block', () => {
        it('should return correct bem objects for block', () => {
            expect(unbem('fake-block')).toEqual([
                {
                    block: 'fake-block',
                },
            ])
        })

        it('should output correct bem objects for prefixed block', () => {
            expect(
                unbem('fake-prefix-fake-block', {
                    prefix: 'fake-prefix-',
                })
            ).toEqual([
                {
                    block: 'fake-block',
                },
            ])
        })

        it('should output correct bem objects for when no block provided', () => {
            expect(unbem('__fake-element')).toEqual([])
        })

        it('should output correct bem objects for when no block provided with prefix', () => {
            expect(
                unbem('fake-prefix-__fake-element', {
                    prefix: 'fake-prefix-',
                })
            ).toEqual([])
        })

        it('should output correct bem objects for boolean block modifiers', () => {
            expect(unbem('fake-block--boolean-modifier')).toEqual([
                {
                    block: 'fake-block',
                    modifiers: {
                        block: {
                            'boolean-modifier': true,
                        },
                    },
                },
            ])
        })

        it('should output correct bem objects for value block modifiers', () => {
            expect(unbem('fake-block--value-modifier_fake-value')).toEqual([
                {
                    block: 'fake-block',
                    modifiers: {
                        block: {
                            'value-modifier': 'fake-value',
                        },
                    },
                },
            ])
        })
    })

    describe('element', () => {
        it('should output correct bem objects for element', () => {
            expect(unbem('fake-block__fake-element')).toEqual([
                {
                    block: 'fake-block',
                    element: 'fake-element',
                },
            ])
        })

        it('should output correct bem objects for prefixed element', () => {
            expect(
                unbem('fake-prefix-fake-block__fake-element', {
                    prefix: 'fake-prefix-',
                })
            ).toEqual([
                {
                    block: 'fake-block',
                    element: 'fake-element',
                },
            ])
        })

        it('should output correct bem objects for boolean element modifiers', () => {
            expect(unbem('fake-block__fake-element--boolean-modifier')).toEqual(
                [
                    {
                        block: 'fake-block',
                        element: 'fake-element',
                        modifiers: {
                            element: {
                                'boolean-modifier': true,
                            },
                        },
                    },
                ]
            )
        })

        it('should output correct bem objects for value element modifiers', () => {
            expect(
                unbem('fake-block__fake-element--value-modifier_fake-value')
            ).toEqual([
                {
                    block: 'fake-block',
                    element: 'fake-element',
                    modifiers: {
                        element: {
                            'value-modifier': 'fake-value',
                        },
                    },
                },
            ])
        })
    })

    describe('block + element', () => {
        it('should output correct bem objects for block + element', () => {
            expect(unbem('fake-block__fake-element')).toEqual([
                {
                    block: 'fake-block',
                    element: 'fake-element',
                },
            ])
        })

        it('should output correct bem objects for prefixed block + element', () => {
            expect(
                unbem('fake-prefix-fake-block__fake-element', {
                    prefix: 'fake-prefix-',
                })
            ).toEqual([
                {
                    block: 'fake-block',
                    element: 'fake-element',
                },
            ])
        })

        it('should output correct bem objects for boolean block + element modifiers', () => {
            expect(
                unbem([
                    'fake-block--boolean-block-modifier',
                    'fake-block__fake-element--boolean-element-modifier',
                ])
            ).toEqual([
                {
                    block: 'fake-block',
                    element: 'fake-element',
                    modifiers: {
                        block: {
                            'boolean-block-modifier': true,
                        },
                        element: {
                            'boolean-element-modifier': true,
                        },
                    },
                },
            ])
        })

        it('should output correct bem objects for value block + element modifiers', () => {
            expect(
                unbem([
                    'fake-block--value-block-modifier_fake-block-value',
                    'fake-block__fake-element--value-element-modifier_fake-element-value',
                ])
            ).toEqual([
                {
                    block: 'fake-block',
                    element: 'fake-element',
                    modifiers: {
                        block: {
                            'value-block-modifier': 'fake-block-value',
                        },
                        element: {
                            'value-element-modifier': 'fake-element-value',
                        },
                    },
                },
            ])
        })

        it('should output correct bem objects for value and bool block + element modifiers', () => {
            expect(
                unbem([
                    'fake-block__fake-element',
                    'fake-block--bool-block-modifier',
                    'fake-block--bool-block-modifier-2',
                    'fake-block--value-block-modifier_fake-block-value',
                    'fake-block--value-block-modifier-2_fake-block-value-2',
                    'fake-block--bool-block-modifier__fake-element',
                    'fake-block--bool-block-modifier-2__fake-element',
                    'fake-block--value-block-modifier_fake-block-value__fake-element',
                    'fake-block--value-block-modifier-2_fake-block-value-2__fake-element',
                    'fake-element',
                    'fake-element--bool-element-modifier',
                    'fake-element--bool-element-modifier-2',
                    'fake-element--value-element-modifier_fake-element-value',
                    'fake-element--value-element-modifier-2_fake-element-value-2',
                    'fake-block__fake-element--bool-element-modifier',
                    'fake-block__fake-element--bool-element-modifier-2',
                    'fake-block__fake-element--value-element-modifier_fake-element-value',
                    'fake-block__fake-element--value-element-modifier-2_fake-element-value-2',
                ])
            ).toEqual([
                {
                    block: 'fake-block',
                    element: 'fake-element',
                    modifiers: {
                        block: {
                            'bool-block-modifier': true,
                            'bool-block-modifier-2': true,
                            'value-block-modifier': 'fake-block-value',
                            'value-block-modifier-2': 'fake-block-value-2',
                        },
                        element: {
                            'bool-element-modifier': true,
                            'bool-element-modifier-2': true,
                            'value-element-modifier': 'fake-element-value',
                            'value-element-modifier-2': 'fake-element-value-2',
                        },
                    },
                },
            ])
        })

        it('should output correct bem objects for value and bool block + element modifiers with minimal classnames', () => {
            expect(
                unbem([
                    'fake-block--bool-block-modifier',
                    'fake-block--bool-block-modifier-2',
                    'fake-block--value-block-modifier_fake-block-value',
                    'fake-block--value-block-modifier-2_fake-block-value-2__fake-element',
                    'fake-element--bool-element-modifier',
                    'fake-element--bool-element-modifier-2',
                    'fake-element--value-element-modifier_fake-element-value',
                    'fake-element--value-element-modifier-2_fake-element-value-2',
                ])
            ).toEqual([
                {
                    block: 'fake-block',
                    element: 'fake-element',
                    modifiers: {
                        block: {
                            'bool-block-modifier': true,
                            'bool-block-modifier-2': true,
                            'value-block-modifier': 'fake-block-value',
                            'value-block-modifier-2': 'fake-block-value-2',
                        },
                        element: {
                            'bool-element-modifier': true,
                            'bool-element-modifier-2': true,
                            'value-element-modifier': 'fake-element-value',
                            'value-element-modifier-2': 'fake-element-value-2',
                        },
                    },
                },
            ])
        })

        it('should output correct bem objects for block + element without modifiers', () => {
            expect(
                unbem([
                    'fake-block',
                    'fake-block2',
                    'fake-block__fake-element',
                    'fake-element',
                    'fake-element2',
                ])
            ).toEqual([
                {
                    block: 'fake-block',
                    element: 'fake-element',
                },
                {
                    block: 'fake-block2',
                },
                {
                    block: 'fake-element2',
                },
            ])
        })
    })

    it('should throw an error if no string or array classnames are passed', () => {
        expect(() => unbem({})).toThrow()
    })

    it('should output correct bem objects for when no block or element provided', () => {
        expect(unbem('__')).toEqual([])
    })

    describe('syntax', () => {
        it('should output correct bem objects for standard bem syntax', () => {
            expect(
                unbem(
                    'fakeBlock--fakeElement-valueElementModifier-fakeElementValue',
                    {
                        syntax: standard,
                    }
                )
            ).toEqual([
                {
                    block: 'fakeBlock',
                    element: 'fakeElement',
                    modifiers: {
                        element: {
                            valueElementModifier: 'fakeElementValue',
                        },
                    },
                },
            ])
        })
    })
})
