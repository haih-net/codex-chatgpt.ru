export interface CallRoomRecord {
  id: string
  title: string
  createdById: string
  authenticatedOnly: boolean
  accessCodeHash: string | null
  closed: boolean
  version: number
  admissionToken?: string
  resumeToken?: string
}
export interface CallResumeSession {
  id: string
  roomId: string
  name: string
  userId: string | null
  version?: number
}
export interface CallAdmission {
  roomId: string
  version: number
  name: string
  userId: string | null
  expires: number
}
export interface CallIceServer {
  urls: string[]
  username?: string
  credential?: string
}
