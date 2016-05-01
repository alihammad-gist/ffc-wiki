import * as shim from 'es6-shim';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Autocomplete from 'react-autocomplete';
import * as _ from 'lodash';


require('./main.scss');

type suggestion = {
	title: string
	summary: string
	link: string
};

type search = {
	tite: string
	snippet: string
}

// data helpers
function wikiSuggestions(resp) {
	const [
		term,
		titles,
		summaries,
		links
	] = resp;
	let results = [];
	for(var i = 0; i < titles.length; i++) {
		results.push({
			title: titles[i],
			summary: summaries[i],
			link: links[i]
		});
	}
	
	return { term, results };
}

function wikiSearch(resp, term) {
	return {
		term,
		offset: resp.continue !== undefined ? resp.continue.sroffset : undefined,
		results: resp.query.search,
	}
}

interface state {
	value?: string,
	suggestions?: {
		term: string,
		results: suggestion[]
	}
	search?: {
		term: string,
		offset: number,
		results: search[]
	}
}

// components
class App extends React.Component<{}, state> {
	
	debouncedSuggest;
	
	constructor(props, context) {
		super(props, context);
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
	
	render() {
		return (
			<div className='container'>
				<div className='row'>
					<div className='col-md-12'>
						<Autocomplete
							inputProps={{
								name: "term", 
								onKeyPress: e => ( e.which === 13 ? this.search() : null ),
								className: 'form-control input-search',
								placeholder: ''
							}}
							ref="autocomplete"
							value={this.state.value}
							items={this.state.suggestions.results}
							getItemValue = { item => item.title }
							onSelect={(value, item) => {
								this.setState({ value })
								this.search();
							}}
							onChange={(event, value) => {
								this.setState({ value });
								this.debouncedSuggest();
							}}
							renderItem={(item, isHighlighted) => (
								<li 
									className={isHighlighted ? 'list-group-item active' : 'list-group-item'}
									key={item.link}
									>
									{item.title}
								</li>
							)}
							renderMenu={(items, value, style) => (
								<ul className='list-group' 
									style={Object.assign(
										style,
										{
											position: 'fixed'
										}
										)}
									>
									{items}
								</ul>
							)}
							wrapperProps={{className: 'input-group'}}
							/>
					</div>
				</div>
				<div className='row'>
					<SearchResults results={this.state.search.results} />
				</div>
			</div>
		);
	}
	
	suggest() {
		const sug = this.state.suggestions;
		const val = this.state.value;
		
		if (val !== '') {
			if (sug.term === undefined || val !== sug.term) {
				JSONP.get(
					'https://en.wikipedia.org/w/api.php', 
					{
						action: 'opensearch',
						format: 'json',
						search: val
					},
					(resp) => {
						this.setState({
							suggestions: wikiSuggestions(resp)
						});
					}
				);
			}
		}	
	}
	
	search() {
		const { search: s, value } = this.state;
		if (value !== '') {
			if (s.term === undefined || value !== s.term) {
				JSONP.get(
					'https://en.wikipedia.org/w/api.php', 
					{
						action: 'query',
						list: 'search',
						format: 'json',
						srsearch: value
					},
					(resp) => {
						this.setState({
							search: wikiSearch(resp, value)
						});
					}
				);
			}
		}
	}
		
};

function SearchResults(props) {
	return (
		<ul className='results'>
			{props.results.map(v => (
				<li key={v.title}>
					<h3>
						<a 
							href={`https://en.wikipedia.org/wiki/${v.title}`}
							target='_blank'
							>
							{v.title}
						</a>
					</h3>
					<p dangerouslySetInnerHTML={{__html: v.snippet}} />
				</li>
			))}
		</ul>
	);
}


ReactDOM.render(<App />, document.getElementById('root'));