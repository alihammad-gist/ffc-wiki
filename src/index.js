"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDOM = require('react-dom');
var Autocomplete = require('react-autocomplete');
var _ = require('lodash');
require('./main.scss');
// data helpers
function wikiSuggestions(resp) {
    var term = resp[0], titles = resp[1], summaries = resp[2], links = resp[3];
    var results = [];
    for (var i = 0; i < titles.length; i++) {
        results.push({
            title: titles[i],
            summary: summaries[i],
            link: links[i]
        });
    }
    return { term: term, results: results };
}
function wikiSearch(resp, term) {
    return {
        term: term,
        offset: resp.continue !== undefined ? resp.continue.sroffset : undefined,
        results: resp.query.search,
    };
}
// components
var App = (function (_super) {
    __extends(App, _super);
    function App(props, context) {
        _super.call(this, props, context);
        this.state = {
            value: '',
            suggestions: {
                term: undefined,
                results: [],
            },
            search: {
                term: undefined,
                results: [],
                offset: 0,
            }
        };
        this.debouncedSuggest = _.debounce(this.suggest, 300);
    }
    App.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {className: 'container'}, React.createElement("div", {className: 'row'}, React.createElement("div", {className: 'col-md-12'}, React.createElement(Autocomplete, {inputProps: {
            name: "term",
            onKeyPress: function (e) { return (e.which === 13 ? _this.search() : null); },
            className: 'form-control input-search',
            placeholder: ''
        }, ref: "autocomplete", value: this.state.value, items: this.state.suggestions.results, getItemValue: function (item) { return item.title; }, onSelect: function (value, item) {
            _this.setState({ value: value });
            _this.search();
        }, onChange: function (event, value) {
            _this.setState({ value: value });
            _this.debouncedSuggest();
        }, renderItem: function (item, isHighlighted) { return (React.createElement("li", {className: isHighlighted ? 'list-group-item active' : 'list-group-item', key: item.link}, item.title)); }, renderMenu: function (items, value, style) { return (React.createElement("ul", {className: 'list-group', style: Object.assign(style, {
            position: 'fixed'
        })}, items)); }, wrapperProps: { className: 'input-group' }}))), React.createElement("div", {className: 'row'}, React.createElement(SearchResults, {results: this.state.search.results}))));
    };
    App.prototype.suggest = function () {
        var _this = this;
        var sug = this.state.suggestions;
        var val = this.state.value;
        if (val !== '') {
            if (sug.term === undefined || val !== sug.term) {
                JSONP.get('https://en.wikipedia.org/w/api.php', {
                    action: 'opensearch',
                    format: 'json',
                    search: val
                }, function (resp) {
                    _this.setState({
                        suggestions: wikiSuggestions(resp)
                    });
                });
            }
        }
    };
    App.prototype.search = function () {
        var _this = this;
        var _a = this.state, s = _a.search, value = _a.value;
        if (value !== '') {
            if (s.term === undefined || value !== s.term) {
                JSONP.get('https://en.wikipedia.org/w/api.php', {
                    action: 'query',
                    list: 'search',
                    format: 'json',
                    srsearch: value
                }, function (resp) {
                    _this.setState({
                        search: wikiSearch(resp, value)
                    });
                });
            }
        }
    };
    return App;
}(React.Component));
;
function SearchResults(props) {
    return (React.createElement("ul", {className: 'results'}, props.results.map(function (v) { return (React.createElement("li", {key: v.title}, React.createElement("h3", null, React.createElement("a", {href: "https://en.wikipedia.org/wiki/" + v.title, target: '_blank'}, v.title)), React.createElement("p", {dangerouslySetInnerHTML: { __html: v.snippet }}))); })));
}
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
