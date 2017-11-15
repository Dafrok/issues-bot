const {OPENED, REOPENED} = require('../config/actions.js')
const {closeIssue, createComment} = require('../util/github.js')
const noop = require('noop3')

const invalidIssueComment = `
Auto closed by issues bot. Please create your issue by issue generator.

当前问题由机器人自动关闭，请使用 ISSUE 生成器提交您的问题。
`

const checkIssue = body => !body.match(/<!-- Created by issues bot. DO NOT REMOVE. -->/)

module.exports = async (req, res) => {
  const payload = req.body

  switch (payload.action) {
    case OPENED:
    case REOPENED:
      const isValid = checkIssue(payload.issue.body)
      if (isValid) {
        await closeIssue(payload)
        await createComment(payload, invalidIssueComment)
      }
      res.send('ok!')
      break
    default:
      res.send('ok!')
  }
}
