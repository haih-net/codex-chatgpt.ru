import { redirect, type LoaderFunctionArgs } from 'react-router'
import type { MetaFunction } from 'react-router'
import { createSeoMeta, unavailableSeoMeta } from '../components/seo/SeoHeaders'
import { ConceptPage } from 'app/Custom/pages/Concepts/Concept'
import { loadConcept } from 'app/Custom/pages/Concepts/Concept/loader.server'

export const redirects: ReadonlyMap<string, string> = new Map([
  ['/terms', '/wiki/concepts'],
  ['/terms/language-model', '/wiki/concepts/language-model'],
  ['/terms/harness', '/wiki/concepts/harness'],
  ['/terms/agent', '/wiki/concepts/agent'],
  ['/terms/runtime', '/wiki/concepts/runtime'],
  ['/terms/context', '/wiki/concepts/context'],
  ['/terms/tool', '/wiki/concepts/tool'],
  ['/terms/orchestration', '/wiki/concepts/orchestration'],
  ['/terms/thread', '/wiki/concepts/thread'],
  ['/terms/turn', '/wiki/concepts/turn'],
  ['/terms/skill', '/wiki/concepts/skill'],
  ['/terms/memory', '/wiki/concepts/memory'],
  ['/terms/compaction', '/wiki/concepts/compaction'],
  ['/terms/decomposition', '/wiki/concepts/decomposition'],
  ['/terms/subagent', '/wiki/concepts/subagent'],
  ['/terms/parallelism', '/wiki/concepts/parallelism'],
  ['/terms/headless', '/wiki/concepts/headless'],
  ['/terms/base-instructions', '/wiki/concepts/base-instructions'],
  ['/terms/model-catalog', '/wiki/concepts/model-catalog'],
  ['/terms/practice', '/wiki/concepts/practice'],
  ['/wiki/rust/core/thread', '/wiki/concepts/thread'],
  ['/wiki/rust/core/turn', '/wiki/concepts/turn'],
  ['/wiki/rust/core/skill', '/wiki/concepts/skill'],
  ['/wiki/rust/core/memory', '/wiki/concepts/memory'],
  ['/wiki/rust/core/compaction', '/wiki/concepts/compaction'],
  ['/wiki/rust/core/subagent', '/wiki/concepts/subagent'],
  ['/wiki/rust/core/base-instructions', '/wiki/concepts/base-instructions'],
  ['/wiki/rust/core/model-catalog', '/wiki/concepts/model-catalog'],
  ['/wiki/typescript-sdk/headless', '/wiki/concepts/headless'],
  ['/wiki/practice/preparation', '/wiki/concepts/practice'],
  ['/wiki/lab', '/wiki/practice/lab'],
  ['/wiki/run', '/wiki/practice/run'],
  ['/wiki/build', '/wiki/practice/build'],
  ['/wiki/system-prompt', '/wiki/practice/system-prompt'],
  ['/wiki/shared-auth', '/wiki/experiments/shared-auth'],
  ['/wiki/shared-build', '/wiki/experiments/shared-build'],
  ['/wiki/request-lifecycle', '/wiki/rust/core/request-lifecycle'],
])

export const loader = (args: LoaderFunctionArgs) => {
  const destination = redirects.get(args.url.pathname.replace(/\/+$/, ''))
  if (destination) {
    return redirect(destination + args.url.search, 301)
  }
  return loadConcept(args)
}

export const meta: MetaFunction<typeof loader> = ({
  loaderData: data,
  error,
}) => (error || !data ? unavailableSeoMeta() : createSeoMeta(data.seo))

export default ConceptPage
