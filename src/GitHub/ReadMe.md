# octocat

_The_ generic workflow:
 - https://github.com/actions/starter-workflows/blob/main/ci/blank.yml

Reference:
- Checking in your node_modules directory can cause problems. As an alternative, you can use a tool called [@vercel/ncc](https://github.com/vercel/ncc) to compile your code and modules into one file used for distribution.

- https://github.com/marketplace?category=&type=actions [marketplace examples]

## apps
https://docs.github.com/en/apps/creating-github-apps/setting-up-a-github-app/about-creating-github-apps

> Difference between apps and actions
> > https://docs.github.com/en/actions/creating-actions/about-custom-actions#comparing-github-actions-to-github-apps

## actions
auto auth: https://docs.github.com/en/actions/security-guides/automatic-token-authentication

https://docs.github.com/en/actions/creating-actions/about-custom-actions
> https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
> https://github.com/actions/typescript-action
> > https://github.com/actions <<<-- nice
> > https://github.com/actions/checkout <<<-- this is an actual repo:
``` # use the above when needing to figure out hte ins-and-outs of the below
steps:
    - uses: actions/checkout@v3
## Another example:
 - uses: actions/setup-node@v3
      with:
        node-version: '16'
# > > https://github.com/actions/setup-node <<<-- this is an actual repo:
```
> > https://github.com/features/actions <<<-- showcase

> > https://github.com/devops-actions <<<-- user's collection of really nice utility actions
    https://github.com/devops-actions/json-to-file/blob/main/action.yml
    https://github.com/wow-actions

---
---
TOOLKIT: more than just the two below
CORE:  interface to the workflow commands, input and output variables, exit statuses, and debug messages.
GITHUB: returns an authenticated Octokit REST client and access to GitHub Actions contexts
> > https://github.com/actions/toolkit
> >  - https://github.com/actions/toolkit/tree/main/packages/core
> >  - https://github.com/actions/toolkit/tree/main/packages/github
---
---

- https://github.com/actions/typescript-action/blob/main/package.json
- - https://docs.github.com/en/actions/creating-actions/creating-a-composite-action?platform=mac
- - - https://docs.github.com/en/actions/learn-github-actions/essential-features-of-github-actions#sharing-data-between-jobs [saves file]

BUILD AND TEST: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs
VERSION WHEN DONE: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github

run jobs in sequence: https://docs.github.com/en/actions/using-workflows/about-workflows#creating-dependent-jobs

MANUAL RUN: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch
CRON RUN: https://docs.github.com/en/actions/managing-issues-and-pull-requests/scheduling-issue-creation
- https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/running-scripts-before-or-after-a-job

- https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables
- https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#runs-for-composite-actions
- https://docs.github.com/en/actions/learn-github-actions/contexts#github-context

contexts: https://docs.github.com/en/actions/learn-github-actions/contexts#example-printing-context-information-to-the-log
variables and secrets: https://docs.github.com/en/actions/learn-github-actions/variables#creating-configuration-variables-for-a-repository
                      -> https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables


_below_ is what we were looking for fo the generated maze/mandala idea
 - found [here](https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables)
> GITHUB_SHA
> >The commit SHA that triggered the workflow. The value of this commit SHA depends on the event that triggered the workflow. For more information, see "Events that trigger workflows." For example, ffac537e6cbbf934b08745a378932722df287a53.

## workflows
> Note: If you need to use a workflow run's URL from within a job, you can combine these variables: $GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID

native commands: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions
- send values before and after: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#sending-values-to-the-pre-and-post-actions
- store locally: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#example-of-writing-an-environment-variable-to-github_env
- define output variable: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-output-parameter

### starter workflows
- https://github.com/actions/starter-workflows
  - https://docs.github.com/en/actions/learn-github-actions/using-starter-workflows
    - https://docs.github.com/en/actions/using-workflows/creating-starter-workflows-for-your-organization

https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts <-
- https://github.com/actions/download-artifact

pass variables between jobs: https://docs.github.com/en/actions/learn-github-actions/variables#passing-values-between-steps-and-jobs-in-a-workflow
 - follow up \[BETTER EXAMPLE]: https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts#passing-data-between-jobs-in-a-workflow


## runners
https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners/about-github-hosted-runners#overview-of-github-hosted-runners
- https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners/about-github-hosted-runners#viewing-available-runners-for-a-repository

https://docs.github.com/en/actions/hosting-your-own-runners
https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners/about-github-hosted-runners
 - https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners/customizing-github-hosted-runners#installing-software-on-macos-runners