import React, { Component } from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api";
import {
  FaUser,
  FaStar,
  FaCodeBranch,
  FaExclamationTriangle,
} from "react-icons/fa";

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

function ReposGrid({ repos }) {
  return (
    <ul className="grid space-around">
      {repos.map((repo, index) => {
        const {
          name,
          owner,
          html_url,
          stargazers_count,
          forks,
          open_issues,
        } = repo;
        const { login, avatar_url } = owner;
        return (
          <li key={html_url} className="repo bg-light">
            <h4 className="header-lg center-text">#{index + 1}</h4>
            <img
              src={avatar_url}
              alt={`avatar for ${login}`}
              className="avatar"
            />
            <h2 center-text>
              <a href={html_url} className="link">
                {login}
              </a>
            </h2>
            <ul className="card-list">
              <li>
                <FaUser color="rgb(255, 191, 116)" size={22} />
                <a href={`https://github.com/${login}`}>{login}</a>
              </li>
              <li>
                <FaStar color="rgb(255, 215, 0)" size={22} />
                {stargazers_count.toLocaleString()} stars
              </li>
              <li>
                <FaCodeBranch color="rgb(129, 195, 245)" size={22} />
                {forks.toLocaleString()} forks
              </li>
              <li>
                <FaExclamationTriangle color="rgb(241, 138, 147)" size={22} />
                {open_issues.toLocaleString()} open
              </li>
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired,
};

class Popular extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLanguage: "All",
      repos: {},
      error: null,
    };
    this.updateLanguage = this.updateLanguage.bind(this);
    this.isLoading = this.isLoading.bind(this);
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage(selectedLanguage) {
    this.setState({ selectedLanguage, error: null });

    if (!this.state.repos[selectedLanguage]) {
      fetchPopularRepos(selectedLanguage)
        .then((data) => {
          this.setState(({ repos }) => ({
            repos: {
              ...repos,
              [selectedLanguage]: data,
            },
          }));
        })
        .catch((error) => {
          console.warn("Error while fetching repos", error);

          this.setState({ error: "There was an error fetching the reops!" });
        });
    }
  }

  isLoading() {
    const { selectedLanguage, error, repos } = this.state;
    return !repos[selectedLanguage] && error === null;
  }

  render() {
    const { selectedLanguage, repos, error } = this.state;
    console.log(repos);
    return (
      <React.Fragment>
        <LanguagesNav
          selected={selectedLanguage}
          onUpdate={this.updateLanguage}
        />

        {this.isLoading() && <h2>Loading</h2>}
        {error && <p>Error</p>}
        {repos[selectedLanguage] && (
          <ReposGrid repos={repos[selectedLanguage]} />
        )}
      </React.Fragment>
    );
  }
}

export default Popular;
