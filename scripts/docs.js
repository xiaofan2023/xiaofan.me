const { resolve } = require('node:path')
const fse = require('fs-extra')
const fg = require('fast-glob')
const matter = require('gray-matter')

const docsPath = resolve(__dirname, '..', 'docs').replace(/\\/g, '/')

async function filterMarkdown() {
  let reg = docsPath + '/**/*.md'
  const results = await fg(reg, {
    onlyFiles: true,
    ignore: ['**/index.md'],
  })
  return results
}

function dumpMessage(items) {
  let results = []
  for (let i = 0; i < items.length; i++) {
    const raw = fse.readFileSync(items[i], 'utf-8')
    const frontMatter = raw.match(/---[\S\s]*---/)
    if (!frontMatter) {
      continue
    }
    const data = matter(frontMatter[0]).data
    const { title, date, tags } = data
    if (!date) {
      continue
    }
    results.push({
      title,
      date,
      tags,
      path: items[i].replace(docsPath, ''),
      mtime: fse.statSync(items[i]).mtime,
    })
  }
  return results
}

async function main() {
  const items = await filterMarkdown()
  const lists = dumpMessage(items)
  lists.sort((a, b) => a.date > b.date)
  const saveTo = resolve(docsPath, 'public/posts.json')
  fse.writeJson(saveTo, lists)
}

main()
