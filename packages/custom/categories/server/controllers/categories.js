'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Message = mongoose.model('Message'),
    Line = mongoose.model('Line'),
    User = mongoose.model('User'),
    Category = mongoose.model('Channel'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');


exports.all = function (req, res) {

    Category.find().sort('channel').exec(function (err, categories) {
        console.log(categories);
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the categories'
            });
        }

        res.jsonp(categories)
    });

};

exports.initDB = function () {
    User.remove({}, function(){});
    Line.remove({}, function(){});
    Message.remove({}, function(){});

    Category.remove({}, function(){
        var channel = new Category();
        channel.channel = "עצמים";
        channel.words = ["תפוח", "שולחן", "מלפפון", "מנורה", "ילד", "אבא", "אבטיח", "אביב", "אגודל", "אוזן", "אוטובוס", "מוזיקה", "פטריות", "פיתה", "פלאפל", "חגורה", "חלב", "עוגה", "שער", "ענן", "עפרון", "עץ",  "עיתון", "עכביש",  "תינוק", "תיק", "תמונה", "שקל", "חלון", "עגבניה", "חצאית"  , "ספר", "לחם", "גרביים", "גשם", "דבש", "דג", "סנדלים", "פסנתר", "טלפון", "רגל", "ראש", "קפה", "מצלמה", "רימון", "רכבת", "ירח",  "משפחה", "כביש", "שוקולד", "נשק", "סבא", "סבון", "סבתא", "כדור", "כדורגל", "כדורסל", "כובע", "כוכב", "כוס",];
        channel.word = undefined;
        channel.startTime = undefined;
        channel.activeUser = undefined;
        channel.save(function (err) {

        });

        var channel = new Category();
        channel.channel = "ביטויים";
        channel.words = ["התפוח לא נופל רחוק מן העץ", "חתול בשק", "מרוב עצים לא רואים את היער", " הקש ששבר את גב הגמל", "אזניים לכותל", "טובים השניים מן האחד", "אהבה מקלקלת את השורה", "אין בוכים על חלב שנשפך", "אין חדש תחת השמש", "אין משיחין בשעת הסעודה", "אין עשן ללא אש", "אל תסתכל בקנקן אלא במה שיש בו", "דין פרוטה כדין מאה", "הדשא של השני ירוק יותר", "על ראש הגנב בוער הכובע" , "השמים הם הגבול", "טוב ציפור אחת ביד משתיים על העץ", "אם אין קמח אין תורה", "טמן ידו בצלחת", "טמן ראשו בחול", "לא דובים ולא יער","עד חצי המלכות" , "עין תחת עין", "פעם שלישית גלידה", "פה מפיק מרגליות", "תמונה אחת שווה אלף מילים" ];
        channel.word = undefined;
        channel.startTime = undefined;
        channel.activeUser = undefined;
        channel.save(function (err) {
            /*if (err) console.log(err);
             Channel.findOne({
             _id: channel._id
             }).exec(function(err, channel) {
             return channel;
             });*/
        });

        var channel = new Category();
        channel.channel = "פעלים";
        channel.words = ["לשתות", "לאכול", "לעוף", "לרקוד", "ללכת", "לחבק", "לתופף", "לנהוג", "לחייך" , "לבכות", "לצחוק", "לשבת", "לטאטא", "לדבר", "לנגן", "לכתוב","לדוג", "לטוס" , "לאפות", "להתפלל", "לטפס", "לישון", "לפגוש", "לכעוס", "לאהוב", "לצלול", "לרכב"];
        channel.word = undefined;
        channel.startTime = undefined;
        channel.activeUser = undefined;
        channel.save(function (err) {
            /*if (err) console.log(err);
             Channel.findOne({
             _id: channel._id
             }).exec(function(err, channel) {
             return channel;
             });*/
        });
    });

};

