#!/usr/bin/env node

// RSS -> Tumblr

var feedparser = require('feedparser');
var rem = require('rem');

if (process.argv.length < 4) {
  console.log('Usage: rss-to-tumblr http://your.rss.feed/path yourtumblrname');
  process.exit(1);
}

rem.connect('tumblr.com', '*').prompt(function (err, user) {
  feedparser.parseUrl(process.argv[2])
    .on('article', function (c) {
      var src = c['content:encoded']['#'];
      var title = c['title'];
      var description = c['description'];
      var date = c['date'];

      user.debug = true;
      user('blog', process.argv[3] + '.tumblr.com', 'post').post({
        type: 'text',
        state: 'published',
        date: new Date(date).toISOString(),
        format: 'html',
        slug: description,
        title: title,
        body: src
      }, function (err, json) {
        console.log(err, json);
      })
    });
});