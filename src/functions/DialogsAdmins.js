import { AbstractMethod } from './AbstractMethod';

import { Group } from '@vkontakte/vkui';

export class DialogsAdmins extends AbstractMethod {

    beforeLogic = async () => {
        const dialogs = await this.getDialogs();
        const admins = dialogs.filter((dialog) => {
            const peer = this.getOwnerInfo(dialog.peer);

            if (peer && (peer.creator || peer.admin_rights)) {
                return true;
            }

            return false;
        });

        if (!admins.length) {
            return this.showMethodFinish(this.lang('methods.dialogs_admins.no_admins'), false);
        }

        this.setState({ dialogs: admins });
    };

    content = () => {
        const { dialogs } = this.state;

        if (dialogs) {
            return (
                <Group>
                    {
                        dialogs.map((dialog, key) => {
                            const peer = this.getOwnerInfo(dialog.peer);

                            return this.getPeerRow({
                                peer: dialog.peer,
                                description: peer.creator
                                    ? this.lang('methods.dialogs_admins.creator')
                                    : this.lang('methods.dialogs_admins.admin'),
                            }, key);
                        })
                    }
                </Group>
            );
        }
    };

}
