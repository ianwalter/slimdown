const unified = require('unified')
const markdown = require('remark-parse')
const frontmatter = require('remark-frontmatter')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify')
const format = require('rehype-format')
const yaml = require('js-yaml')

const processor = unified().use(markdown).use(frontmatter)


module.exports = (context = {}) => ({
  markup: ({ content }) => {
    return new Promise((resolve, rejecct) => {
      processor
        .use(() => thing => {
          // console.log('thing', thing)

        })
        .use(() => ({ children }) => {
          const { value } = children.find(child => child.type === 'yaml')
          context.frontmatter = yaml.safeLoad(value) || {}
        })
        .use(remark2rehype)
        .use(format)
        .use(html)
        .process(content, (err, file) => {
          if (err) {
            rejecct(err)
          }
          resolve({ code: String(file), map: '' })
        })
    })
  }
})
