import hyphenated from './syntax/hyphenated';

const unbem = (passedClasses, {
    prefix = '',
    syntax = {},
} = {}) => {
    let classes = passedClasses;

    if (typeof passedClasses === 'string') {
        classes = passedClasses.split(' ');
    }

    if (!classes || !Array.isArray(classes)) {
        throw new Error('You must specify a single class string, or an array of class names');
    }

    const separators = {
        ...hyphenated,
        ...syntax,
    };

    const lookup = {};

    const b = '(.+?)';
    const e = '(.+?)';
    const m = `(?:${separators.modifier}${b})?`;
    const v = `(?:${separators.value}${b})?`;

    const regexpBlock = new RegExp(`^${prefix}${b}${m}${v}$`);
    const regexpElement = new RegExp(`^${e}${m}${v}$`);

    const allClasses = classes.reduce((bemObjects, className) => {
        const classSplit = className.split(separators.block);
        const parsedBlock = classSplit[0] ? regexpBlock.exec(classSplit[0]) : undefined;
        const parsedElement = classSplit[1] ? regexpElement.exec(classSplit[1]) : undefined;

        if (!parsedBlock && !parsedElement) return bemObjects;

        const block = parsedBlock && parsedBlock[1];

        if (!block) return bemObjects;

        const bem = {block};
        const blockModifier = parsedBlock[2];

        const element = parsedElement ? parsedElement[1] : undefined;
        const elementModifier = parsedElement ? parsedElement[2] : undefined;

        lookup[block] = lookup[block] || {};

        if (blockModifier) {
            bem.modifiers = {};
            bem.modifiers.block = {
                [blockModifier]: parsedBlock[3] || true,
            };
            lookup[block] = {
                ...lookup[block],
                ...bem.modifiers.block,
            };
        }

        if (!element) {
            return [
                ...bemObjects,
                bem,
            ];
        }

        bem.element = element;

        if (elementModifier) {
            bem.modifiers = bem.modifiers || {};
            bem.modifiers.element = {
                [elementModifier]: parsedElement[3] || true,
            }
            lookup[element] = lookup[element] || {};
            lookup[element] = {
                ...lookup[element],
                ...bem.modifiers.element,
            };
        }

        return [
            ...bemObjects,
            bem,
        ];
    }, []);

    return allClasses.reduce((merged, bem) => {
        const foundIndex = merged.findIndex(item => item.block === bem.block || (item.element === bem.block));

        if(bem.element && lookup[bem.element]) {
            // We can assume that the element is merged with the block

            if (Object.keys(lookup[bem.element]).length > 0) {
                bem.modifiers = bem.modifiers || {};
                bem.modifiers.element = {
                    ...(!bem.modifiers.element ? {} : bem.modifiers.element),
                    ...lookup[bem.element]
                };
            }

            if (foundIndex < 0) return [
                ...merged,
                bem,
            ];

            const found = merged[foundIndex];
            found.element = bem.element;

            if (bem.modifiers && bem.modifiers.element) {
                found.modifiers = {
                    ...found.modifiers,
                    element: {
                        ...(!found.modifiers.element ? {} : found.modifiers.element),
                        ...bem.modifiers.element,
                    },
                }
            }

            return [
                ...merged.slice(0, foundIndex),
                found,
                ...merged.slice(foundIndex + 1),
            ];
        }

        if (foundIndex < 0) return [
            ...merged,
            bem,
        ];

        const found = merged[foundIndex];

        if (Object.keys(lookup[bem.block]).length) {

            const modifierType = found.element === bem.block ? 'element' : 'block';

            found.modifiers = {
                ...found.modifiers,
                [modifierType]: {
                    ...(!found.modifiers[modifierType] ? {} : found.modifiers[modifierType]),
                    ...lookup[bem.block],
                },
            }
        }

        return [
            ...merged.slice(0, foundIndex),
            found,
            ...merged.slice(foundIndex + 1),
        ];
    }, [])
}

export default unbem
