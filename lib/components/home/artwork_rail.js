/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { View, StyleSheet, TouchableHighlight, LayoutAnimation, Text, Image } from 'react-native';

import Spinner from '../spinner';
import Grid from '../artwork_grids/generic_grid';
import SerifText from '../text/serif';
import Separator from '../separator';
import colors from '../../../data/colors';

class ArtworkRail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      gridHeight: 0,
    };
  }

  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true });
  }

  onPress() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: true });
  }

  renderExpansionButton() {
    if (!this.state.expanded) {
      return (
        <TouchableHighlight style={styles.expansionButton} onPress={this.onPress.bind(this) } underlayColor={'white'}>
            <Image style={{height: 8, width: 15, alignSelf: 'center'}} source={require('../../../images/chevron.png')} />
        </TouchableHighlight>
      );
    }
    return null;
  }

  renderViewAllButton() {
    if (this.state.expanded) {
      return (
        <TouchableHighlight style={styles.viewAllButton} onPress={this.onViewAllPress.bind(this)} underlayColor={'gray'}>
          <Text style={styles.viewAllText}>VIEW ALL</Text>
        </TouchableHighlight>
      );
    }
    return null;
  }

  onViewAllPress() {
    // pop new view controller
  }

  onGridLayout(event) {
    this.setState({ gridHeight: event.nativeEvent.layout.height });
  }

  renderModuleResults() {
    if (this.props.rail.results && this.props.rail.results.length) {
      return (
        <View style={[styles.container, { height: this.state.expanded ? this.state.gridHeight + 150 : 500 }]}>
          <View style={[styles.gridContainer, { height: this.state.expanded ? this.state.gridHeight + 100 : 420 }]}>
            <View onLayout={this.onGridLayout.bind(this)}>
              <Grid artworks={this.props.rail.results}/>
            </View>
            { this.renderViewAllButton() }
          </View>
          <Separator/>
          { this.renderExpansionButton() }
        </View>
      );
    } else if (this.props.rail.results) {
      // temporary; for those pesky empty rails on staging
      return <View/>;
    } else {
      return <Spinner style={{ flex: 1 }} />;
    }
  }

  render() {
    return (
      <View>
        <SerifText style={styles.title}>{this.props.rail.title}</SerifText>
        <View style={{ margin: 20 }}>
          { this.renderModuleResults() }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    margin: 10,
    fontSize: 20,
    alignSelf: 'center',
  },
  container: {
    backgroundColor: 'white',
  },
  gridContainer: {
    overflow: 'hidden',
  },
  grid: {
    marginTop: -10,
  },
  expansionButton: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderColor: colors['gray-regular'],
    borderWidth: 1,
    borderRadius: 30,
    alignSelf: 'center',
    top: -20,
    justifyContent: 'center'
  },
  viewAllButton: {
    width: 240,
    height: 40,
    backgroundColor: 'black',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  viewAllText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Avant Garde Gothic ITCW01Dm',
  }
});

export default Relay.createContainer(ArtworkRail, {
  initialVariables: {
    fetchContent: false,
  },

  fragments: {
    rail: () => Relay.QL`
      fragment on HomePageArtworkModule {
        title
        results @include(if: $fetchContent) {
          ${Grid.getFragment('artworks')}
        }
      }
    `,
  }
});