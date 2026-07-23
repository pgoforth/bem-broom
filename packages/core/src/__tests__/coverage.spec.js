import { unbem } from '../index.js';

// Targets the remaining branch in unbem's sort tiebreak: two equal classes
// compare as `0` (the `a === b` arm), which only happens with a duplicate.
describe('unbem coverage', () => {
	it('dedupes duplicate classes (equal-key sort tiebreak)', () => {
		expect(unbem('title title')).toEqual(unbem('title'));
	});
});
