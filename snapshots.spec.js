var snap = require('./snapshot');
describe('Snapshots', function () {

  beforeEach(function () {

  });

  it('should get snapshots for pages passed in', function () {
    var pages = ['google.com'];

    var expectedPages = { 'google.com': 'dataShit' };
    expect(snap.get(pages)).to.evenutally.equal(expectedPages);
  });


});

