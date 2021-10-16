var assert = require('assert');
var sie = require('../src');

var fs = require('fs');

describe('Reading SIE files', function() {
  const data = sie.readBuffer(fs.readFileSync('./test/test.SI'));

  var fnamn = data.list('fnamn');
  it('1.1 Failed to read object', function() { assert.equal(fnamn.length, 1); });
  it('1.2 Failed to convert charset to UTF8', function() { assert.equal(fnamn[0]['företagsnamn'], 'Testföretaget'); });

  describe('verifications', function() {
    var ver = data.list('ver');
    it('2.1 Failed to list verifications', function() { assert.equal(data.list('ver').length, 2); });
    it('2.2 Failed to read verification attributes', function() { assert.equal(ver[0].vernr , '1'); });
    it('2.3 Failed to list verification transactions', function() { assert.equal(ver[0].poster.length , 6,); });
    it('2.4 Failed to read transaction attributes', function() { assert.equal(ver[0].poster[2].belopp , '11025.00'); });

    var k = data.getKonto(ver[0].poster[2].kontonr);
    it('3.1 Utility getKonto failed to read attributes', function() {
      assert.equal(k.kontonamn, 'Bank, checkräkningskonto');
    })
    it('3.2 Utility getKonto failed to lookup kontoplan', function() {
      assert.equal(k.kontoplan, 'EUBAS97');
    })

    var o = data.getObjekt(ver[0].poster[2].objektlista[0].dimensionsnr, ver[0].poster[2].objektlista[0].objektnr);
    it('4.1 Utility getObjekt failed to lookup objekt', function() { assert.equal(o.objektnamn, 'Utbildning'); });
    it('4.1 Utility getObjekt failed to traverse dimensions', function() { assert.equal(o.namn, 'Konsult Utbildning'); });
  })
})