export interface CallRoomRecord {
  id: string
  title: string
  createdById: string
  authenticatedOnly: boolean
  accessCodeHash: string | null
  closed: boolean
  version: number
  admissionToken?: string
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
