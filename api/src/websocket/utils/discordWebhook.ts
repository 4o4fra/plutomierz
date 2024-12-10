import axios from 'axios';
import { plutaDev, plutaValue } from './updatePlutaValue';

export const sendPlutaDevToDiscord = () => {
    if (plutaDev !== "") {
        axios.post('https://discord.com/api/webhooks/1312149530598178967/5Nh0cEXsFpTYqtcB14SxR7LXai_Z74cGkeRxXY5uboFSFDzx6cNZGNfpSU3NPkmALzZ_', {
            content: `${plutaDev}`
        }).then(response => {
            if (response.status !== 204) {
                console.error('Failed to send Pluta to Discord webhook');
            }
        }).catch(error => {
            console.error('Error sending Pluta to Discord webhook:', error);
        });
    }
};

export const sendPlutaValueToDiscord = () => {
    axios.post('https://discord.com/api/webhooks/1312821271800840293/SZF8okE1hvoLT3Vwet-LmOdxoDNuz2Y5t6ad37VQvHXfILrbFrt9HPWleYm9lhpp4n2z', {
        content: `**${plutaValue} Plut**`
    }).then(response => {
        if (response.status !== 204) {
            console.error('Failed to send Pluta to Discord webhook');
        }
    }).catch(error => {
        console.error('Error sending Pluta to Discord webhook:', error);
    });
};