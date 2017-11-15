const GitHub = require('github')

const github = new GitHub({
  debug: process.env.NODE_ENV === 'development'
})

github.authenticate({
  type: 'token',
  token: process.env.GITHUB_TOKEN
})

const createComment = async (payload, body) => {
  const owner = payload.repository.owner.login
  const repo = payload.repository.name
  const number = payload.issue.number
  github.issues.createComment({
    owner,
    repo,
    number,
    body
  })
}

const closeIssue = async payload => {
  const owner = payload.repository.owner.login
  const repo = payload.repository.name
  const number = payload.issue.number
  const state = 'closed'
  github.issues.edit({
    owner,
    repo,
    number,
    state
  })
}

module.exports = {
  createComment,
  closeIssue
}