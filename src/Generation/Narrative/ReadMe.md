# Narrative Generation

> Textual (scalable to audio) generation capable of handling everything from NPC conversatoins to in-game assets such as books, cards, histories, etc

## Features
1. ngramths
  > Responsible for word creation
1. ngrams
  > Responsible for content/theme/etc creation

## Workflow

## End Result
Acessing the upcoming/TBD'd **NoSQL** database on object like the below will either be retrieved or created and stored for the book seelcted
```
{
  ngrams: {

  },
  ngramths: { // NOTE: _NO_ spaces should be stored with our implementation
    'Book Title': {
      _length:  1234, // total amount of ngramths created
      _longest: 11 // length of longest ngramth created
      END_OF_WORD: { // END_OF_WORD `data: value` map for the final gramth of a word
          // NOTE: this should be only 1 layer deep
        _length: 5, // Object.keys(END_OF_WORD).length --> omitting any underscore prefixed keys
        _sum: 23, // Object.values(END_OF_WORD).reduce((a,c) => a+c, 0)
        _eow: [2,3,6,9], // [...new Set(Object.values(END_OF_WORD))].sort() --> omitting any underscore prefixed keys
        de: 3,
        en: 3,
        es: 2,
        area: 6,
        real: 9,
          // NOTE: the underscored will determine % of matched ngramth finishing current word creation
            // EXAMPLE: const isEOW = Math.ceil(Math.random()*_sum) >= _sum - END_OF_WORD[currentEOW]
      },
      2: { // key is the n value
        ce: 2,
        co: 1,
        de: 2,
        en: 2,
        es: 2,
        nc: 1,
        nd: 2,
        on: 1,
        sc: 1,
        ...
      },
      4: {
        area : 4,
        real: 5,
        ...
      },
      ...
    }
  },
}
```