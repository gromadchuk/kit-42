import React from 'react';

import { ModalPage, ModalPageHeader } from '@vkontakte/vkui';

export function CustomModal({ id, onClose, modalData }) {

    return (
        <ModalPage
            id={ id }
            header={ <ModalPageHeader>{ modalData.header }</ModalPageHeader> }
            onClose={ onClose }
            settlingHeight={ 100 }
        >
            { modalData.content }
        </ModalPage>
    );

}
