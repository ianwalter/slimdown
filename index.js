const unified = require('unified')
const markdown = require('remark-parse')
const frontmatter = require('remark-frontmatter')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify')
const format = require('rehype-format')
const yaml = require('js-yaml')

const processor = unified().use(markdown).use(frontmatter)
const byH1 = child => child.type === 'heading' && child.depth === 1

module.exports = (context = {}) => ({
  markup: ({ content, filename }) => {
    return new Promise((resolve, reject) => {
      processor
        .use(() => ({ children }) => {
          // Add frontmatter object which contains all frontmatter data.
          const fmNode = children.find(child => child.type === 'yaml')
          context.frontmatter = yaml.safeLoad(fmNode.value) || {}

          // Try to determine and set the title.
          if (context.frontmatter.title) {
            context.title = context.frontmatter.title
          } else if (!context.title) {
            const h1Node = children.find(byH1)
            if (h1Node) {
              const text = h1Node.children.find(child => child.type === 'text')
              if (text) {
                context.title = text.value
              }
            }
          }

          // Try to determine and set the date.
          if (context.frontmatter.date) {
            context.date = context.frontmatter.date
          } else if (!context.date) {
            // TODO:
          }

          // Try to determine and set the slug.
          if (context.frontmatter.slug) {

          } else if (!context.slug) {
            // TODO:
          }
        })
        .use(remark2rehype)
        .use(format)
        .use(html)
        .process(content, (err, file) => {
          if (err) {
            reject(err)
          }
          resolve({ code: String(file), map: '' })
        })
    })
  }
})
