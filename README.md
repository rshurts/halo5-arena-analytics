# Halo 5 Arena Analytics

[halo5analytics.meteorapp.com](http://halo5analytics.meteorapp.com/) is a web application for analyising arena performance using the [Halo 5 API](https://developer.haloapi.com/).
![screenshot](/screenshot.png?raw=true)

## Development

Install the following dependencies and set up a settings file with your API key.

### Dependencies

1. [Meteor](https://www.meteor.com/install) installed.
2. A `settings.json` with a Halo API Key added to the root of the project.
3. Run `meteor npm install`.

```JSON
{
  "halo5APIKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## Running Locally

To run application locally use `npm run dev` or `meteor run --settings settings.json` and then open a web broswer to [http://localhost:3000](http://localhost:3000).
