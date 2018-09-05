import hyphenated from './syntax/hyphenated';

const bem = ({
    block,
    element,
    modifiers = {},
    prefix = '',
    syntax = {},
    verbose = false,
}) => {
    if (!block && !element) {
        throw new Error('You must specify a block or an element when using BEM syntax');
    }

    const classes = [];
    const separators = {
        ...hyphenated,
        ...syntax,
    };

    /*
     *  There are instances where class prefix is imported from a SASS file.
     *  In these cases, upon import, the single (or double) quotes remain.
     *  We must remove them before use.
     */
    const classPrefix = prefix
        ? prefix.replace(/^['"]/, '').replace(/['"]$/, '')
        : '';

    if (block) {
        classes.push(!element
            ? `${classPrefix}${block}`
            : `${classPrefix}${block}${separators.block}${element}`
        );

        const blockModifierKeys = modifiers.block
            ? Object.keys(modifiers.block)
            : [];

        blockModifierKeys.forEach((key) => {
            const value = modifiers.block[key];
            const isBoolean = value === undefined || value === !!value;
            if (isBoolean) {
                if (value) {
                    const className = `${classPrefix}${block}${separators.modifier}${key}`;
                    classes.push(className);
                    verbose && element && classes.push(`${className}${separators.block}${element}`);
                }
            } else {
                const className = `${classPrefix}${block}${separators.modifier}${key}${separators.value}${value}`;
                classes.push(className);
                verbose && element && classes.push(`${className}${separators.block}${element}`);
            }
        })
    }
    if (element) {
        classes.push(`${classPrefix}${element}`);

        const elementModifierKeys = modifiers.element
            ? Object.keys(modifiers.element)
            : [];

        elementModifierKeys.forEach((key) => {
            const value = modifiers.element[key];
            const isBoolean = value === undefined || value === !!value;
            if (isBoolean) {
                if (value) {
                    classes.push(`${classPrefix}${element}${separators.modifier}${key}`);
                    verbose && block && classes.push(`${classPrefix}${block}${separators.block}${element}${separators.modifier}${key}`);
                }
            } else {
                classes.push(`${classPrefix}${element}${separators.modifier}${key}${separators.value}${value}`);
                verbose && block && classes.push(`${classPrefix}${block}${separators.block}${element}${separators.modifier}${key}${separators.value}${value}`);
            }
        })
    }

    return classes.map((className) => className
        .toString()
        .replace(/\s\s+/g, ' ')
        .replace(/[\s!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, separators.space)
    );
}

export default bem;
