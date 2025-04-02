import { atom } from "recoil";


export const localVideoStreamState = atom<MediaStream | null>({
    key : "localVedioStreamState",
    default : null ,
});

export const localAudioStreamState = atom<MediaStream | null>({
    key : 'localAudioStreamState',
    default : null,
});

export const isLocalVideoEnableState = atom<boolean>({
    key : "isLocalVedioEnableState",
    default : true,

});

export const isLocalAudioEnableState = atom<boolean>({
    key : 'isLocalAudioEnableState',
    default : true,
});