/*
 *  Biomorph.js
 *  Copyright (c) 2010 Cameron McKay.  All rights reserved.
 */
(function ($) {
  const renderCreature = function (spec) {
    const length = spec.length || 0,
      stems = spec.stems || [],
      dir = spec.dir || 0,
      newDir = ((dir % 8) + 8) % 8,
      oldPos = spec.oldPos || { x: 0, y: 0 },
      newPos = {
        x: oldPos.x + length * stems[newDir].x,
        y: oldPos.y + length * stems[newDir].y,
      },
      segments = [],
      a = [],
      b = [];

    segments.push({ start: oldPos, finish: newPos });

    if (length > 1) {
      a = renderCreature(
        $.extend({}, spec, {
          oldPos: newPos,
          length: length - 1,
          dir: dir + 1,
        })
      );
      b = renderCreature(
        $.extend({}, spec, {
          oldPos: newPos,
          length: length - 1,
          dir: dir - 1,
        })
      );
    }

    return segments.concat(a).concat(b);
  };

  const drawCreature = function (context, segments) {
    segments.forEach(function (segment) {
      const start = segment.start,
        finish = segment.finish;
      context.beginPath();
      context.moveTo(start.x, -start.y);
      context.quadraticCurveTo(
        start.x + Math.signum(start.x),
        -start.y - Math.signum(start.y),
        finish.x,
        -finish.y
      );
      context.stroke();
    });
  };

  const randomCreature = function () {
    const ret = [];
    for (const i = 0; i < 7; i++) {
      ret.push(bio.gene({ val: Number.randomInt(-4, 4) }));
    }
    ret.push(bio.gene({ val: Number.randomInt(2, 12), min: 2, max: 12 })); // length
    ret.push(bio.gene({ val: Number.randomInt(1, 2), min: 1, max: 2 })); // line weight
    ret.push(
      bio.gene({ val: Number.randomInt(0, 250), min: 0, max: 250, delta: 50 })
    ); // red
    ret.push(
      bio.gene({ val: Number.randomInt(0, 250), min: 0, max: 250, delta: 50 })
    ); // green
    ret.push(
      bio.gene({ val: Number.randomInt(0, 250), min: 0, max: 250, delta: 50 })
    ); // blue
    //    ret.push(bio.gene({val: Number.randomInt(0, 250), min:0, max: 250, delta: 50}));
    //    ret.push(bio.gene({val: Number.randomInt(0, 250), min:0, max: 250, delta: 50}));
    //    ret.push(bio.gene({val: Number.randomInt(0, 250), min:0, max: 250, delta: 50}));
    return ret;
  };

  const mutateCreature = function (genes, index) {
    const mutated = genes.slice(0).map(function (gene) {
      return gene.clone();
    });
    mutated[index].mutate();
    return mutated;
  };

  const mateCreatures = function (mother, father) {
    const child = [];
    for (const i = 0; i < mother.length; i++) {
      const coinFlip = Number.randomInt(0, 1);
      if (coinFlip) {
        child.push(mother[i]);
      } else {
        child.push(father[i]);
      }
    }
    return child;
  };

  const calculateStems = function (genes) {
    return [
      { x: 0, y: genes[0].val() },
      { x: genes[1].val(), y: genes[2].val() },
      { x: genes[3].val(), y: 0 },
      { x: genes[4].val(), y: -genes[5].val() },
      { x: 0, y: -genes[6].val() },
      { x: -genes[4].val(), y: -genes[5].val() },
      { x: -genes[3].val(), y: 0 },
      { x: -genes[1].val(), y: genes[2].val() },
    ];
  };

  const calculateBounds = function (segments) {
    const min = { x: 0, y: 0 };
    const max = { x: 0, y: 0 };
    segments.forEach(function (segment) {
      const start = segment.start,
        finish = segment.finish;
      min.x = Math.min(start.x, finish.x, min.x);
      min.y = Math.min(start.y, finish.y, min.y);
      max.x = Math.max(start.x, finish.x, max.x);
      max.y = Math.max(start.y, finish.y, max.y);
    });
    return { min: min, max: max };
  };

  const createOffspring = function (parent) {
    const indices = [];
    for (const i = 0; i < parent.length; i++) {
      indices.push(i);
    }

    const children = [];
    indices
      .shuffle()
      .slice(0, 8)
      .forEach(function (index) {
        children.push(mutateCreature(parent, index));
      });

    [parent].concat(children).forEach(function (genes, index) {
      const segments = renderCreature({
        length: genes[7].val(),
        stems: calculateStems(genes),
        dir: 0,
        oldPos: { x: 0, y: 0 },
      });

      const cell = $('#cell-' + index);
      cell.parent().data('genes', genes);

      const context = cell[0].getContext('2d');
      context.save();
      prepareContext(context, segments, genes);
      drawCreature(context, segments);
      context.restore();
    });
  };

  const prepareContext = function (context, segments, genes) {
    const bounds = calculateBounds(segments),
      width = Math.max(Math.abs(bounds.min.x), bounds.max.x) * 2,
      height = Math.max(Math.abs(bounds.min.y), bounds.max.y) * 2,
      factor = 120 / Math.max(width, height),
      scale = { x: factor, y: factor };

    context.clearRect(0, 0, 150, 150);
    context.translate(75, 75);
    context.scale(scale.x, scale.y);
    context.strokeStyle =
      'rgb(' +
      genes[9].val() +
      ', ' +
      genes[10].val() +
      ', ' +
      genes[11].val() +
      ')';
    context.lineWidth = genes[8].val() / factor;
    context.lineJoin = 'miter';
    context.lineCap = 'square';
  };

  $(function () {
    $('#menu').css('opacity', 0.3);
    $('#bottom-menu').css('opacity', 0.9);

    const parent = randomCreature();
    //    const parent = [
    //        bio.gene({val: 1}),
    //        bio.gene({val: 1}),
    //        bio.gene({val: 1}),
    //        bio.gene({val: 1}),
    //        bio.gene({val: 1}),
    //        bio.gene({val: 1}),
    //        bio.gene({val: 1}),
    //        bio.gene({val: 5}),
    //        bio.gene({val: Number.randomInt(1, 2), min: 1, max: 2}),  // line weight
    //        bio.gene({val: Number.randomInt(0, 250), min:0, max: 250, delta: 50}), // red
    //        bio.gene({val: Number.randomInt(0, 250), min:0, max: 250, delta: 50}), // green
    //        bio.gene({val: Number.randomInt(0, 250), min:0, max: 250, delta: 50}) // blue
    //    ];
    createOffspring(parent);

    $('div.cell').click(function (event) {
      const genes = $(this).data('genes');

      if (event.shiftKey) {
        const target = $('div.save-cell.target canvas');
        target.parent().data('genes', genes);

        const segments = renderCreature({
          length: genes[7].val(),
          stems: calculateStems(genes),
          dir: 0,
          oldPos: { x: 0, y: 0 },
        });

        const context = target[0].getContext('2d');
        context.save();
        prepareContext(context, segments, genes);
        drawCreature(context, segments);
        context.restore();

        target
          .parent()
          .clearQueue()
          .animate({ backgroundColor: '#444' }, 600)
          .animate({ backgroundColor: '#222' }, 800);

        const mateable = true;
        saveCells.each(function () {
          if (!$(this).data('genes')) {
            mateable = false;
          }
        });
        if (mateable) {
          $('#menu').fadeTo('slow', 1.0).css('cursor', 'pointer');
        }
      } else {
        createOffspring(genes);
      }
    });

    const saveCells = $('div.save-cell').click(function () {
      saveCells.removeClass('target');
      $(this).addClass('target');
    });

    $('#menu').click(function () {
      const mother = $('#save-1').data('genes');
      const father = $('#save-2').data('genes');
      if (mother && father) {
        const child = mateCreatures(mother, father);
        createOffspring(child);
        $('#cell-0')
          .parent()
          .clearQueue()
          .animate({ backgroundColor: '#444' }, 600)
          .animate({ backgroundColor: '#222' }, 800);
      }
    });
  });
})(jQuery);
