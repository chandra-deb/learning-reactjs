import React, { Component } from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api";

function LanguagesNav({ selected, onUpdate }) {
  const languages = ["All", "Javascript", "Python", "Ruby", "Rust", "Julia"];

  return (
    <ul className="flex-center">
      {languages.map((language) => (
        <li key={language}>
          <button
            onClick={() => onUpdate(language)}
            className="btn-clear nav-link"
            style={language === selected ? { color: "red" } : null}
          >
            {language}
          </button>
        </li>
      ))}
    </ul>
  );
}

LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

class Popular extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLanguage: "All",
      repos: null,
      error: null,
    };
    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage(selectedLanguage) {
    this.setState({ selectedLanguage, repos: null, error: null });

    fetchPopularRepos(selectedLanguage)
      .then((repos) => this.setState({ repos, error: null }))
      .catch((error) => {
        console.warn("Error while fetching repos", error);

        this.setState({ error: "There was an error fetching the reops!" });
      });
  }

  isLoading() {
    return this.state.repos === null && this.state.error === null;
  }

  render() {
    const { selectedLanguage, repos, error } = this.state;
    return (
      <React.Fragment>
        <LanguagesNav
          selected={selectedLanguage}
          onUpdate={this.updateLanguage}
        />

        {this.isLoading() && <h2>Loading</h2>}
        {error && <p>Error</p>}
        {repos && <pre>{JSON.stringify(repos, null, 2)}</pre>}
      </React.Fragment>
    );
  }
}

export default Popular;
