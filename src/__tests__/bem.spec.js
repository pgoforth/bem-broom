import bem from '../bem'
import standard from '../syntax/standard'

describe('bem', () => {
    describe('block', () => {
        it('should output correct classnames for block', () => {
            expect(
                bem({
                    block: 'fake-block',
                })
            ).toEqual(['fake-block'])
        })

        it('should output correct classnames for prefixed block', () => {
            expect(
                bem({
                    prefix: 'fake-prefix-',
                    block: 'fake-block',
                })
            ).toEqual(['fake-prefix-fake-block'])
        })

        it('should output correct classnames for boolean block modifiers', () => {
            expect(
                bem({
                    block: 'fake-block',
                    modifiers: {
                        block: {
                            'boolean-modifier': true,
                        },
                    },
                })
            ).toEqual(['fake-block', 'fake-block--boolean-modifier'])
        })

        it('should output correct classnames for value block modifiers', () => {
            expect(
                bem({
                    block: 'fake-block',
                    modifiers: {
                        block: {
                            'value-modifier': 'fake-value',
                        },
                    },
                })
            ).toEqual(['fake-block', 'fake-block--value-modifier_fake-value'])
        })
    })

    describe('element', () => {
        it('should output correct classnames for element', () => {
            expect(
                bem({
                    element: 'fake-element',
                })
            ).toEqual(['fake-element'])
        })

        it('should output correct classnames for prefixed element', () => {
            expect(
                bem({
                    prefix: 'fake-prefix-',
                    element: 'fake-element',
                })
            ).toEqual(['fake-prefix-fake-element'])
        })

        it('should output correct classnames for boolean element modifiers', () => {
            expect(
                bem({
                    element: 'fake-element',
                    modifiers: {
                        element: {
                            'boolean-modifier': true,
                        },
                    },
                })
            ).toEqual(['fake-element', 'fake-element--boolean-modifier'])
        })

        it('should output correct classnames for value element modifiers', () => {
            expect(
                bem({
                    element: 'fake-element',
                    modifiers: {
                        element: {
                            'value-modifier': 'fake-value',
                        },
                    },
                })
            ).toEqual([
                'fake-element',
                'fake-element--value-modifier_fake-value',
            ])
        })
    })

    describe('block + element', () => {
        it('should output correct classnames for block + element', () => {
            expect(
                bem({
                    block: 'fake-block',
                    element: 'fake-element',
                })
            ).toEqual(['fake-block__fake-element', 'fake-element'])
        })

        it('should output correct classnames for prefixed block + element', () => {
            expect(
                bem({
                    prefix: 'fake-prefix-',
                    block: 'fake-block',
                    element: 'fake-element',
                })
            ).toEqual([
                'fake-prefix-fake-block__fake-element',
                'fake-prefix-fake-element',
            ])
        })

        it('should output correct classnames for boolean block + element modifiers', () => {
            expect(
                bem({
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
                })
            ).toEqual([
                'fake-block__fake-element',
                'fake-block--boolean-block-modifier',
                'fake-element',
                'fake-element--boolean-element-modifier',
            ])
        })

        it('should output correct verbose classnames for boolean block + element modifiers', () => {
            expect(
                bem({
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
                    verbose: true,
                })
            ).toEqual([
                'fake-block__fake-element',
                'fake-block--boolean-block-modifier',
                'fake-block--boolean-block-modifier__fake-element',
                'fake-element',
                'fake-element--boolean-element-modifier',
                'fake-block__fake-element--boolean-element-modifier',
            ])
        })

        it('should output correct classnames for value block + element modifiers', () => {
            expect(
                bem({
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
                })
            ).toEqual([
                'fake-block__fake-element',
                'fake-block--value-block-modifier_fake-block-value',
                'fake-element',
                'fake-element--value-element-modifier_fake-element-value',
            ])
        })

        it('should output correct verbose classnames for value block + element modifiers', () => {
            expect(
                bem({
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
                    verbose: true,
                })
            ).toEqual([
                'fake-block__fake-element',
                'fake-block--value-block-modifier_fake-block-value',
                'fake-block--value-block-modifier_fake-block-value__fake-element',
                'fake-element',
                'fake-element--value-element-modifier_fake-element-value',
                'fake-block__fake-element--value-element-modifier_fake-element-value',
            ])
        })
    })

    it('should ignore all false and undefined modifiers', () => {
        expect(
            bem({
                block: 'fake-block',
                element: 'fake-element',
                modifiers: {
                    block: {
                        'boolean-block-modifier': false,
                    },
                    element: {
                        'boolean-element-modifier': undefined,
                    },
                },
            })
        ).toEqual(['fake-block__fake-element', 'fake-element'])
    })

    it('should format all values to strings and hyphenate spaces', () => {
        const modifierObject = { fakeAttribute: 'fake-value' }
        expect(
            bem({
                block: {},
                element: [1, 2, 3],
                modifiers: {
                    block: {
                        'block   modifierWith  SpAcEs': true,
                    },
                    element: {
                        [modifierObject]: 'element    modifier   wSpaces',
                    },
                },
            })
        ).toEqual([
            '-object-Object-__1-2-3',
            '-object-Object---block-modifierWith-SpAcEs',
            '1-2-3',
            '1-2-3---object-Object-_element-modifier-wSpaces',
        ])
    })

    it('should throw an error if neither block or element are passed', () => {
        expect(() =>
            bem({
                modifiers: {
                    block: {
                        'boolean-block-modifier': true,
                    },
                    element: {
                        'boolean-element-modifier': true,
                    },
                },
            })
        ).toThrow()
    })

    describe('syntax', () => {
        it('should output correct classnames for standard bem syntax', () => {
            expect(
                bem({
                    block: 'fakeBlock',
                    element: 'fakeElement',
                    modifiers: {
                        block: {
                            valueBlockModifier: 'fakeBlockValue',
                            valueBlockBooleanModifier: true,
                        },
                        element: {
                            valueElementModifier: 'fakeElementValue',
                            valueElementBooleanModifier: true,
                        },
                    },
                    syntax: standard,
                })
            ).toEqual([
                'fakeBlock--fakeElement',
                'fakeBlock-valueBlockModifier-fakeBlockValue',
                'fakeBlock-valueBlockBooleanModifier',
                'fakeElement',
                'fakeElement-valueElementModifier-fakeElementValue',
                'fakeElement-valueElementBooleanModifier',
            ])
        })

        it('should output correct verbose classnames for standard bem syntax', () => {
            expect(
                bem({
                    block: 'fakeBlock',
                    element: 'fakeElement',
                    modifiers: {
                        block: {
                            valueBlockModifier: 'fakeBlockValue',
                            valueBlockBooleanModifier: true,
                        },
                        element: {
                            valueElementModifier: 'fakeElementValue',
                            valueElementBooleanModifier: true,
                        },
                    },
                    syntax: standard,
                    verbose: true,
                })
            ).toEqual([
                'fakeBlock--fakeElement',
                'fakeBlock-valueBlockModifier-fakeBlockValue',
                'fakeBlock-valueBlockModifier-fakeBlockValue--fakeElement',
                'fakeBlock-valueBlockBooleanModifier',
                'fakeBlock-valueBlockBooleanModifier--fakeElement',
                'fakeElement',
                'fakeElement-valueElementModifier-fakeElementValue',
                'fakeBlock--fakeElement-valueElementModifier-fakeElementValue',
                'fakeElement-valueElementBooleanModifier',
                'fakeBlock--fakeElement-valueElementBooleanModifier',
            ])
        })
    })
})
