import React, { FC, PropsWithChildren, useState } from 'react';
import Modal from 'react-modal';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const MyModal: FC<PropsWithChildren<ModalProps>> = ({ isOpen, onRequestClose, children }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      {children}
    </Modal>
  );
};