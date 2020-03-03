<p align="center">
  <img src="https://raw.githubusercontent.com/pgoforth/bem-broom/main/docs/src/assets/bem-broom.png" alt="bem-broom" />

  <h1 align="center">@bem-broom/core</h1>

  <p align="center">
    Utility for generating and parsing BEM class names using JS objects
  </p>
</p>

<div align="center">

[![CI](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml/badge.svg)](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml) [![coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/pgoforth/7aef5fd167d2b627b7c06604ca82af90/raw/bem-broom-core-coverage.json)](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/%40bem-broom%2Fcore.svg)](https://www.npmjs.com/package/@bem-broom/core) [![minzipped size](https://img.shields.io/bundlephobia/minzip/%40bem-broom%2Fcore)](https://bundlephobia.com/package/@bem-broom/core) [![license](https://img.shields.io/npm/l/%40bem-broom%2Fcore.svg)](./LICENSE)

</div>

---

## Install

```sh
npm install @bem-broom/core
```

## Usage Example

```Javascript
import { bem, unbem } from '@bem-broom/core';

const bemObject = {
    prefix: 'abc-',
    block: 'navigation',
    element: 'link',
    modifiers: {
        block: {
            location: 'header'
        },
        element: {
            active: true
        }
    }
};

const classNames = bem(bemObject);
/*
    [
        'abc-navigation',
        'abc-navigation--location_header',
        'abc-navigation__link',
        'abc-link',
        'abc-link--active',
    ]
*/

const parsedBem = unbem('xyz-block__element--modifier_value', {prefix: 'xyz-'});
/*
    {
        block: 'block',
        element: 'element',
        modifiers: {
            element: {
                modifier: 'value'
            }
        }
    }
*/
```

---
