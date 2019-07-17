const path = require('path')
const fs = require('fs')
const { test } = require('@ianwalter/bff')
const svelte = require('svelte/compiler')
const slimdown = require('..')

const filename = path.join(__dirname, 'fixtures/example.md')
const src = fs.readFileSync(filename)

test('preprocess', async ({ expect }) => {
  const context = {}
  const { code } = await svelte.preprocess(src, slimdown(context), { filename })
  expect(code).toMatchSnapshot()
  expect(context.frontmatter.slug).toBe('rich-man')
})
