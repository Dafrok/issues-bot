const {OPENED, REOPENED} = require('../config/actions.js')
const {closeIssue, createComment} = require('../util/github.js')
const noop = require('noop3')

const send = (res, message) => () => res.send(message)

const action = payload => ({
  is () {
    const args = arguments
    return {
      do (callback) {
        if ([].reduce.call(args, (ret, item) => ret || item === payload.action, false) && callback) {
          return callback(payload)
        } else {
          return Promise.reject()
        }
      }
    }
  }
})

const checkIssue = payload => {
  const {body} = payload.issue
  if (!body.match(/<!-- Created by issues bot. DO NOT REMOVE. -->/)) {
    return closeIssue(payload)
      .then(() => createComment(payload, `
Auto closed by issues bot. Please create your issue by issue generator.

当前问题由机器人自动关闭，请使用 ISSUE 生成器提交您的问题。
      `))
  } else {
    return Promise.resolve()
  }
}

const ok = res => () => res.send(ok)

module.exports = (req, res) => {
  const payload = req.body
  action(payload)
    .is(OPENED, REOPENED)
    .do(checkIssue)
    .then(ok(res))
    .catch(noop)
}