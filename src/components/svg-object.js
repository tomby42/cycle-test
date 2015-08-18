import Cycle from 'cycle-react';
import React from 'react';
import h from './svg-helpers';

function renderWrapper (child, object, interactions) {
  return (<g transform={h.transformFor(object.get('transformation'))}
          onMouseDown={interactions.listener('onMouseDown')}>
          {child}
          </g>);
}

function getSizePos (object) {
  let height = object.getIn(['size', 'height']);
  let width = object.getIn(['size', 'width']);
  let x = -width / 2;
  let y = -height / 2;

  return {
    x, y, height, width
  };
}

const renderObject = {
  rect: function (object, interactions) {
    let style = { fill: object.get('fill') || 'transparent' };
    let {x, y, width, height} = getSizePos (object);

    return renderWrapper (<rect className={object.get('className')} style={style}
                          x={x} y={y} width={width} height={height}></rect>,
                          object, interactions);
  },

  photo: function (object, interactions) {
    let {x, y, width, height} = getSizePos (object);
    // due to react doesn't support xlink:href we should do next thing
    // more info here http://stackoverflow.com/questions/26815738/svg-use-tag-and-reactjs
    let imgTag = '<image';
    imgTag += ' xlink:href="' + object.get('src') + '"';
    imgTag += ' x="' + x + '"';
    imgTag += ' y="' + y + '"';
    imgTag += ' width="' + width + '"';
    imgTag += ' height="' + height + '"';
    imgTag += ' />';

    return <g transform={h.transformFor(object.get('transformation'))}
            onMouseDown={interactions.listener('onMouseDown')}
            dangerouslySetInnerHTML={{__html: imgTag }} />;
  },

  text: function (object, interactions) {
    return renderWrapper (<text x='0' y='0' textAnchor='middle'>{object.get('text')}</text>,
                          object, interactions);
  },

  polygon: function (/*object, interactions*/) {
    return <g></g>;
  }
};


let SvgObject = Cycle.component ('SvgObject', function (interactions, props) {

  let object$ = props.get ('object');

  let vtree$ = object$.map (
    object => {
      if (!object) {
        return <g></g>;
      }

      let type = object.get('type');

      return renderObject[type] (object, interactions);
    });

  return {
    view: vtree$,
    events: {
      onSelectObject: interactions.get('onMouseDown').
        shareReplay(1).
        withLatestFrom (object$, (ev, object) => object)
    }
  };
});

module.exports = SvgObject;
