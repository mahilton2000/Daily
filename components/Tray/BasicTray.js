import React, { useMemo } from 'react';
import { CHAT_ASIDE } from '../Aside/ChatAside';
import { NETWORK_ASIDE } from '../Aside/NetworkAside';
import { PEOPLE_ASIDE } from '../Aside/PeopleAside';
import { DEVICE_MODAL } from '../DeviceSelectModal';
import { useAppState } from '../../contexts/AppStateProvider';
import { useCallState } from '../../contexts/CallProvider';
import { useChat } from '../../contexts/ChatProvider';
import { useUIState } from '../../contexts/UIStateProvider';
import { ReactComponent as IconCameraOff } from '../../icons/camera-off-md.svg';
import { ReactComponent as IconCameraOn } from '../../icons/camera-on-md.svg';
import { ReactComponent as IconChat } from '../../icons/chat-md.svg';
import { ReactComponent as IconLeave } from '../../icons/leave-md.svg';
import { ReactComponent as IconMicOff } from '../../icons/mic-off-md.svg';
import { ReactComponent as IconMicOn } from '../../icons/mic-on-md.svg';
import { ReactComponent as IconNetwork } from '../../icons/network-md.svg';
import { ReactComponent as IconPen } from '../../icons/pen-md.svg';
import { ReactComponent as IconPeople } from '../../icons/people-md.svg';
import { ReactComponent as IconSettings } from '../../icons/settings-md.svg';
import { ReactComponent as IconShare } from '../../icons/share-sm.svg';
import { useDevices, useLocalParticipant, useScreenShare } from '@daily-co/daily-react-hooks';
import { Tray, TrayButton } from './Tray';

const MAX_SCREEN_SHARES = 2;

export const BasicTray = () => {
  const { callObject, leave } = useCallState();
  const { openModal, toggleAside } = useUIState();
  const { hasCamError, hasMicError } = useDevices();
  const { hasNewMessages } = useChat();
  const { isBoardActive, createBoard, deleteBoard, isAllowedToTalk } = useAppState();

  const { isSharingScreen, screens, startScreenShare, stopScreenShare } = useScreenShare();

  const localParticipant = useLocalParticipant();

  const isCamMuted = useMemo(
    () => !localParticipant?.video || hasCamError,
    [hasCamError, localParticipant?.video]
  );

  const isMicMuted = useMemo(
    () => !localParticipant?.audio || hasMicError,
    [hasMicError, localParticipant?.audio]
  );

  const toggleCamera = (newState) => {
    if (!callObject) return false;
    return callObject.setLocalVideo(newState);
  };

  const toggleMic = (newState) => {
    if (!callObject) return false;
    return callObject.setLocalAudio(newState);
  };

  const toggleBoard = () =>
    isBoardActive ? deleteBoard() : createBoard();

  const toggleScreenShare = () =>
    isSharingScreen ? stopScreenShare() : startScreenShare();

  const disabled = screens.length >= MAX_SCREEN_SHARES && !isSharingScreen;

  return (
    <Tray className="tray">
      <TrayButton
        label="Camera"
        onClick={() => toggleCamera(isCamMuted)}
        orange={isCamMuted}
      >
        {isCamMuted ? <IconCameraOff /> : <IconCameraOn />}
      </TrayButton>
      <TrayButton
        label="Mic"
        onClick={() => toggleMic(isMicMuted)}
        orange={isMicMuted}
        disabled={!isAllowedToTalk}
      >
        {isMicMuted ? <IconMicOff /> : <IconMicOn />}
      </TrayButton>
      <span className="divider" />

      {localParticipant?.owner && (
        <TrayButton label="Board" onClick={toggleBoard} orange={isBoardActive}>
          <IconPen />
        </TrayButton>
      )}
      <TrayButton
        label="Chat"
        bubble={hasNewMessages}
        onClick={() => toggleAside(CHAT_ASIDE)}
      >
        <IconChat />
      </TrayButton>
      <TrayButton label="People" onClick={() => toggleAside(PEOPLE_ASIDE)}>
        <IconPeople />
      </TrayButton>
      <TrayButton
        label={isSharingScreen ? 'Stop': 'Share'}
        orange={isSharingScreen}
        disabled={disabled}
        onClick={toggleScreenShare}
      >
        <IconShare />
      </TrayButton>
      <TrayButton
        label="Network"
        onClick={() => toggleAside(NETWORK_ASIDE)}
      >
        <IconNetwork />
      </TrayButton>
      <TrayButton label="Settings" onClick={() => openModal(DEVICE_MODAL)}>
        <IconSettings />
      </TrayButton>

      <span className="divider" />

      <TrayButton label="Leave" onClick={() => leave()} orange>
        <IconLeave />
      </TrayButton>
      <style jsx>
        {`
          .tray {
            position: relative;
          }
        `}
      </style>
    </Tray>
  );
};
export default BasicTray;