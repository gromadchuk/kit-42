import React from 'react';

import { RichCell, Avatar, InfoRow, Progress, Placeholder, Spinner } from '@vkontakte/vkui';
import { Icon28DoneOutline, Icon28HistoryForwardOutline, Icon28RecentOutline } from '@vkontakte/icons';

import { formatNumber, getPercent } from '../js/helpers';
import { lang } from '../js/lang';

const iconsAlias = {
    loading: Icon28HistoryForwardOutline,
    wait: Icon28RecentOutline,
    done: Icon28DoneOutline,
};

export const MultiProgress = ({ lines, type, text }) => {
    if (type === 'spinner') {
        return (
            <Placeholder icon={ <Spinner /> }>
                { text }
            </Placeholder>
        );
    }

    if (type === 'loading') {
        return lines.map((line, key) => {
            const { name, progress, total, status } = line;

            let progressPercent = 0;
            if (total) {
                progressPercent = getPercent(progress, total);
            }

            let progressHeader = lang('MultiProgress.empty_total');

            if (total && status === 'done') {
                progressHeader = `${ formatNumber(total) } / ${ formatNumber(total) }`;
                progressPercent = 100;
            } else if (progress && total) {
                progressHeader = `${ formatNumber(progress) } / ${ formatNumber(total) }`;
            } else if (total) {
                progressHeader = formatNumber(total);
            }

            return (
                <RichCell
                    key={ key }
                    disabled={ true }
                    before={ <Avatar size={ 48 }>{ iconsAlias[status] }</Avatar> }
                    text={
                        <InfoRow header={ progressHeader }>
                            <Progress value={ progressPercent } />
                        </InfoRow>
                    }
                >{ name }</RichCell>
            );
        });
    }

    return null;
};
