const missionControlEnabled = process.env.NEXT_PUBLIC_ENABLE_MISSION_CONTROL === 'true'

// Mission Control is archived by default. Re-enable by setting
// NEXT_PUBLIC_ENABLE_MISSION_CONTROL=true.
export const MISSION_CONTROL_ARCHIVED = !missionControlEnabled
export const MISSION_CONTROL_ARCHIVE_REDIRECT_PATH = '/'

export function getMissionControlRedirectPath() {
  return MISSION_CONTROL_ARCHIVE_REDIRECT_PATH
}

export function isMissionControlArchived() {
  return MISSION_CONTROL_ARCHIVED
}
