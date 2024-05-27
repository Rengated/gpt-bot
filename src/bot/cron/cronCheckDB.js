import cron from "node-cron";

export function myCronJob(){
    cron.schedule('* * * * * *', function() {
        console.log('running a task every minute');
        });
}