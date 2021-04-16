// @flow

export type RoomT = {|
  id: string,
  users: Array<string>,
  owner: string,
  round: number,
  time: number,
|};