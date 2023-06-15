# Setup SOPS in GitHub Actions

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/nhedger/setup-sops?label=latest&logo=github)](https://github.com/marketplace/actions/setup-sops)
[![Test](https://github.com/nhedger/setup-sops/actions/workflows/test.yaml/badge.svg)](https://github.com/nhedger/setup-sops/actions/workflows/test.yaml)
[![Integrate](https://github.com/nhedger/setup-sops/actions/workflows/integrate.yaml/badge.svg)](https://github.com/nhedger/setup-sops/actions/workflows/integrate.yaml)

**Setup SOPS** is a GitHub action that provides a cross-platform interface
for setting up [SOPS](https://github.com/mozilla/sops) in GitHub
Actions runners.

## Inputs

The following inputs are supported.

```yaml
- name: Setup SOPS
  uses: nhedger/setup-sops@v1
  with:

    # The version of SOPS to install.
    # This input is optional and defaults to "latest".
    # Example values: "3.7.3", "latest"
    version: "latest"

    # The GitHub token to use to authenticate GitHub API requests.
    # This input is optional and defaults to the job's GitHub token.
    # Example value: ${{ secrets.GITHUB_TOKEN }}
    token: ${{ github.token }}
```

## Examples

### Basic example

Setup the latest version of SOPS.

```yaml
- name: Setup SOPS
  uses: nhedger/setup-sops@v1

- name: Run SOPS
  run: sops --version
```

### Specific version

Install version `3.7.3` of SOPS.

```yaml
- name: Setup SOPS
  uses: nhedger/setup-sops@v1
  with:
    version: 3.7.3

- name: Run SOPS
  run: sops --version
```

## License

The scripts and documentation in this project are licensed under
the [MIT License](LICENSE.md).
