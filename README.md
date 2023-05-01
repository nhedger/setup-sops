![Banner](.github/banner.svg)

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/nhedger/setup-sops?label=latest&logo=github)](https://github.com/marketplace/actions/setup-sops)
[![Test](https://github.com/nhedger/setup-sops/actions/workflows/test.yaml/badge.svg)](https://github.com/nhedger/setup-sops/actions/workflows/test.yaml)
[![Integrate](https://github.com/nhedger/setup-sops/actions/workflows/integrate.yaml/badge.svg)](https://github.com/nhedger/setup-sops/actions/workflows/integrate.yaml)

# Setup SOPS in GitHub Actions

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

## Caveats

This action makes HTTP requests to the GitHub REST API to determine the URL of
the assets to download. By default, these requests are made anonymously,
which means that they are subject to harsher rate limits.

> GitHub-hosted **macOS** runners are typically subject to this issue, because
> most of them share a common IP address, which increases the likelihood of
> hitting the rate limit.

If you encounter rate limiting issues, try setting the `GITHUB_TOKEN`
environment variable to authenticate the requests and increase the
[rate limit][rate-limit].

[rate-limit]: https://docs.github.com/en/actions/learn-github-actions/usage-limits-billing-and-administration#usage-limits

```yaml
- name: Setup SOPS
  uses: nhedger/setup-sops@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## License

The scripts and documentation in this project are licensed under
the [MIT License](LICENSE.md).
