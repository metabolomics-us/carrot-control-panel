import { async } from '@angular/core/testing';

import { Library } from './library.model';

describe('LibraryModel',() => {
    let library: Library
    it('should split on " | "', () => {
      library=new Library('method | test | blah | positive')
      expect(library.toString()).toBe('method | test | blah | positive')
      expect(library.method).toBe('method')
    });
  });
  