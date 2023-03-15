import fg from 'fast-glob'
import fs from 'fs-extra'
import matter from 'gray-matter'
import { resolve } from 'node:path'
import { _dirname } from '../../vite.config'

interface MetaOptions {
  title: string
  date: string
  tags?: string[]
  path: string
  mtime?: Date
}

const docsPath = resolve(_dirname, 'docs').replace(/\\/g, '/')

async function filterPosts() {
  const reg = docsPath + '/**/*.md'
  return await fg(reg, {
    onlyFiles: true,
    ignore: ['**/index.md'],
  })
}

function dumpMessage(items: string[]) {
  let results: MetaOptions[] = []

  for (let i = 0; i < items.length; i++) {
    const raw = fs.readFileSync(items[i], 'utf-8')
    const frontMatter = raw.match(/---[\S\s]*---/)
    if (!frontMatter) {
      continue
    }
    const data = matter(frontMatter[0]).data
    const { date } = data
    if (!date) {
      continue
    }
    const { title, tags } = data
    results.push({
      title,
      date,
      tags,
      path: items[i].replace(docsPath, ''),
      mtime: fs.statSync(items[i]).mtime,
    })
  }
  results.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
  return results
}

async function main() {
  const items = await filterPosts()
  const lists = dumpMessage(items)
  fs.writeJSON(resolve(docsPath, 'public/lists.json'), lists)
}

try {
  main()
} catch (e: any) {}
