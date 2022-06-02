# Narrative Generation

> Textual (scalable to audio) generation capable of handling everything from NPC conversatoins to in-game assets such as books, cards, histories, etc

## Features
1. ngramths
  - Responsible for word creation
    - Useful in naming characters / places / items / etc
    - Creations will most likely be gibberish
1. ngrams
  - Responsible for content/theme/etc creation
    -  Useful in creating NPC conversations,  descriptions, histories, scrolls, etc
    - Creations will most likely seem to be written in a stream-of-consciousness style
1. markov chain
  - string created by progressively walking through a linked key value pair

## Workflow
1. Book is selected
1. `db` queried :: NOTE >  persistence state is a future integration when more is known about how the persistene layer will function
  1. book previously parsed
    1. return ngram content
  1. book DNE
    1. [ngram.ts] -> parse ngram(th)s from book
    1. save to `db`
    1. return parsed
1. [markov.ts] -> start key decided
1. [markov.ts] -> chain created
1. return chain

## End Result
Acessing the upcoming/TBD'd **NoSQL** database on object like the below will either be retrieved or created and stored for the book seelcted
```
{
  ngrams: {
    _range: [1,3], // starting and ending ammounts 
    'Book Title': {
      _length: 1234,
      1: {
        _length: 816,
        this: { little: 5, is: 1 },
        little: { piggy: 5, box: 1 },
        piggy: { went: 2, stayed: 1, had: 2, gold: 1 },
        went: { to: 1, wee: 1 },
        to: { market: 1, the: 1, be: 1 },
        market: { this: 1 },
        ...
      },
      2: {
        _length: 507,
        'this little': {piggy: 5},
        'this is': {a: 1},
        'little piggy': {went: 2, stayed: 1, had: 2},
        'piggy had': { none: 1 },
        'piggy stayed': { home: 1 },
        'piggy went': { to: 1, wee: 1 },
        'went to': {market: 1}
        ...
      },
      3: {
        _length: 241,
        'this little piggy': {went: 2, stayed: 1, had: 2},
        'little piggy had':{ none:1 },
        'little piggy stayed':{ home:1 },
        'little piggy went':{ to: 1, wee: 1 },
        ...
      }
    }
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

Future integration could also scrape Project Gutenberg when books were specified
> https://www.gutenberg.org/ebooks/subject/3243?start_index=26