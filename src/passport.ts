// import * as passport from 'passport';
// import * as localStrategy from 'passport-local';
// import * as dotenv from 'dotenv';

// dotenv.config();

// module.exports = () => {
//     passport.serializeUser((user, done) => {
//         done(null, user);
//     });

//     passport.deserializeUser((id, done) => {

//         done(null, user);
//     });

//     passport.use(new localStrategy.Strategy({
//         usernameField: 'id',
//         passwordField: 'pw',
//         session: true,
//         passReqToCallback: false,
//     }, (id, pw, done) => {
//         const envId: string|undefined = process.env.ID;
//         const envPw: string|undefined = process.env.PASSWORD;
//         if (envId === undefined || envPw === undefined) {
//             done(new Error('Check ID & PASSWORD in dotenv file'));
//         }
//         if (id !== envId) {
//             done(null, false, {
//                 message: 'Undefined ID'
//             });
//         }
//         else if (pw === envPw) {
//             done(null, {
//                 id: id,
//                 pw: pw,
//             });
//         }
//         else {
//             done(null, false, {
//                 message: 'Undefined PASSWORD'
//             });
//         }
//     }))
// }