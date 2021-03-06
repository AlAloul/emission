/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { Dimensions, View, StyleSheet } from 'react-native'

import Show from './show'

class LargeList extends React.Component {
  state: {
    width: number,
    height: number;
  };

  constructor(props) {
    super(props)
    this.state = this.imageDimensions()
  }

  imageDimensions() {
    const window = Dimensions.get('window')
    const isPad = window.width > 700
    const imageWidth = (isPad ? ((window.width - 100) / 2) : (window.width - 40))
    const imageHeight = Math.floor(imageWidth / 1.5)
    return { width: imageWidth, height: imageHeight }
  }

  onLayout = (e) => {
    this.setState(this.imageDimensions())
  }

  render() {
    const showStyles = StyleSheet.create({
      container: {
        margin: 10,
        width: this.state.width,
      },
      image: {
        width: this.state.width,
        height: this.state.height,
        marginBottom: 5,
      },
    })

    return (
      <View style={styles.container} onLayout={this.onLayout}>
        { this.props.shows.map(show => this.renderShow(show, showStyles)) }
      </View>
    )
  }

  renderShow(show, showStyles) {
    return <Show show={show} styles={showStyles} key={show.__id} />
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: -10,
    marginRight: -10,
  },
})

export default Relay.createContainer(LargeList,{
  fragments: {
    shows: () => Relay.QL`
      fragment on PartnerShow @relay(plural: true) {
        __id
        ${Show.getFragment('show')}
      }
    `,
  }
})
