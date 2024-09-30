

import schedule from 'node-schedule';
import { ElHoss } from '../modules/event/event.controllers.js';

export const job = () => {
    schedule.scheduleJob('*/2 * * * *', function () {
        const req = {
            params: { eventId: '66f5bda40e26ba7d3eea8ecf' },
        };
        const res = {
            status: (code) => ({
                json: (data) => console.log(`Response Status ${code}:`, data),
            }),
        };
        const next = (err) => {
            if (err) {
                console.error('Error:', err);
            }
        };

        // Call the ElHoss function
        ElHoss(req, res, next);
    })
}