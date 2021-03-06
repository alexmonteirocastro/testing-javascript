import React, { Component } from 'react';
import ContentLoader, { Rect, Circle } from 'react-content-loader';

export default class RecipeCardLoader extends Component {
  render() {
    return (
      <div>
        <ContentLoader height={400} speed={1} primaryColor={'#f2c3a6'} secondaryColor={'#eba57a'}>
          <Rect x={20} y={0} width={320} height={170}/>
          <Rect x={20} y={190} width={320} radius={5} height={10}/>
          <Rect x={20} y={210} width={220} radius={5} height={10}/>
          <Rect x={20} y={230} width={180} radius={5} height={10}/>
        </ContentLoader>
      </div>
    );
  }
}
