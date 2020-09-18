const {createLogger,format ,transports} = require('winston');
const { json, combine,timestamp, prettyPrint } = format;

const logger = createLogger({
    level:'info',
    format: combine(
        timestamp(),
        json(),
        prettyPrint()
    ),
    transports:[
        new transports.File({filename:'combined.log'}),
        new transports.File({filename:'error.log',level:'error'}),
    ],
});
if(process.env.NODE_ENV !== 'production'){
    logger.add(new transports.Console({format:format.simple()}));
}
module.exports = logger;