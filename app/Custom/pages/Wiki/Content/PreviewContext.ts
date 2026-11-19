import { createContext, useContext } from 'react'

export const WikiPreviewContext = createContext('')
export const useWikiAnchorPrefix = (): string => useContext(WikiPreviewContext)
