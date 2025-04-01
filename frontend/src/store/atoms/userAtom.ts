
import { atom } from "recoil"

export const userIdState = atom<string | null>({
    key : 'userIdState',
    default: null,

})

export const userNameState = atom <string>({
    key : "userNameState",
    default:'Guest'
})