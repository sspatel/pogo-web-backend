import * as team from './team';
import * as room from './room';
import * as handlers from './handlers';
export interface TeamMember extends team.TeamMember {
}
export interface Current extends team.Current {
}
export interface TurnAction extends room.TurnAction {
}
export interface Player extends room.Player {
}
export interface Room extends room.Room {
}
export interface Move extends room.Move {
}
export interface OnGetOpponentPayload extends handlers.OnGetOpponentPayload {
}
export interface OnNewRoomPayload extends handlers.OnNewRoomPayload {
}
export interface OnReadyGamePayload extends handlers.OnReadyGamePayload {
}
export interface OnTeamSubmitPayload extends handlers.OnTeamSubmitPayload {
}
export interface OnActionProps extends handlers.OnActionProps {
}
export interface OnChargeEndProps extends handlers.OnChargeEndProps {
}
export interface ResolveTurnPayload extends handlers.ResolveTurnPayload {
}
export interface Update extends handlers.Update {
}
