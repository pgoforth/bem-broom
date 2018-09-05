<p align="center">
  <img src="docs/img/bem-broom.png" />

  <h1 align="center">bem-broom</h1>

  <p align="center">
    Utility for generating and parsing BEM class names using JS objects
  </p>
</p>

[![Build Status](https://travis-ci.org/pgoforth/bem-broom.svg?branch=master)](https://travis-ci.org/pgoforth/bem-broom)
[![Coverage Status](https://coveralls.io/repos/github/pgoforth/bem-broom/badge.svg?branch=master)](https://coveralls.io/github/pgoforth/bem-broom?branch=master)

---

## Usage Example

```Javascript
import {bem, unbem} from 'bem-broom'

const bemObject = {
    prefix: 'abc-'
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
