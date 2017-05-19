import { A4firstPage } from './app.po';

describe('a4first App', () => {
  let page: A4firstPage;

  beforeEach(() => {
    page = new A4firstPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
