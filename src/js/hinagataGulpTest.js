var expect = chai.expect;

mocha.setup('bdd');

describe('javascript', function () {
    it('calc 1 + 3', function () {
        expect(1 + 3).to.eql(4);
    });
});

mocha.checkLeaks();
mocha.run();
