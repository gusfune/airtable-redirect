require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;

const Airtable = require('airtable');
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_APIKEY,
});
const base = Airtable.base('appVGDKZEwAVKVttl');
let links = {};

base('Links')
  .select({
    // Selecting the first 3 records in Grid view:
    view: 'Grid view',
  })
  .eachPage(
    function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function(record) {
        links[record.get('Slug')] = record.get('Destination');
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
    },
    function done(err) {
      if (err) {
        console.error(err);
        return;
      }
    },
  );

app.get('/', (req, res) => res.redirect(301, process.env.DEFAULT_REDIRECT));
app.get('/:slug', (req, res) => {
  if (links[req.params.slug]) {
    res.redirect(301, links[req.params.slug]);
  } else {
    res.redirect(301, res.redirect(301, process.env.DEFAULT_REDIRECT));
  }
});

app.listen(port, () =>
  console.log(`App listening on port ${process.env.PORT}!`),
);
