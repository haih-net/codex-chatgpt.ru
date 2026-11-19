import type * as React from 'react'
import type { TermId, TermSource, TermExercise } from './terms/interfaces'
import type { SeoHeadersProps } from 'app/components/seo/SeoHeaders'

export interface WikiPageMetadata {
  intro: React.ReactNode
  termId?: TermId
  title: string
  description: string
  sources?: TermSource[]
  exercise?: TermExercise
  related?: TermId[]
  image?: SeoHeadersProps['image']
}

export interface WikiEntry extends WikiPageMetadata {
  path: string
  key: string
}

export interface WikiBranch {
  page: WikiEntry
  children: WikiBranch[]
}
